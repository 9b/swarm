/**
 * Initialize our global space with a couple setup content and shared resources.
 */
socket = null;

(function() {
    if (typeof localStorage.cfg_init === "undefined") {
        localStorage.cfg_init = true;
        localStorage.cfg_debug = true;
        localStorage.cfg_server = '';
        chrome.tabs.create({'url': 'resources/static/options.html'});
    } else {
        chrome.alarms.create("initConnect",
                             {delayInMinutes: 0.1, periodInMinutes: 0.5});
    }
})();


chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == "initConnect") {
        console.log("Server:", localStorage.cfg_server);
        socket = io(localStorage.cfg_server);

        socket.on('connect', function(data) {
            var msg = 'Connection established with server.';
            if (localStorage.cfg_debug === 'true') { console.log(msg); }
        });

        socket.on('disconnect', function(data) {
            var msg = 'Connection lost with server.';
            if (localStorage.cfg_debug === 'true') { console.log(msg); }
        });

        socket.on('error', function(data) {
            console.error.bind(console);
        });

        socket.on('connect_error', function(err) {
            console.error.bind(console);
        });

        socket.on('config', function(data) {
            var msg = 'Configuration change sent from the server.';
            if (localStorage.cfg_debug === 'true') { console.log(msg); }
            localStorage.cfg_server = data.cfg_server;
        });

        socket.on('request', function(task) {
            var msg = 'Request sent from the hive.';
            if (localStorage.cfg_debug === 'true') { console.log(msg); }
            $.ajax({
                url: task.url,
                type: 'GET',
                success: function(data) {
                    socket.emit('process', {'dom': data, 'taskid': task.taskid,
                                            'success': true});
                    var msg = 'Data collected and sent to the hive.';
                    if (localStorage.cfg_debug === 'true') { console.log(msg); }
                },
                error: function(data) {
                    var err = JSON.stringify(data, null, 2);
                    socket.emit('process', {'dom': null, 'taskid': task.taskid,
                                            'error': err, 'success': false});
                    var msg = 'Data collection failed.';
                    if (localStorage.cfg_debug === 'true') { console.error(msg); }
                }
            });
        });

        chrome.alarms.clear("initConnect");
        chrome.alarms.create("heartBeat",
                             {delayInMinutes: 0.1, periodInMinutes: 0.5});
    }

    if (alarm.name == 'heartBeat') {
        var msg = 'Keep-alive sent to the server.';
        if (localStorage.cfg_debug === 'true') { console.log(msg); }
        socket.emit('heartbeat');
    }
});