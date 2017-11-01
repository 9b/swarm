Swarm
=====
Swarm turns browsers into potential egress points for URL fetching. Users automatically enroll into a hive of other browsers and listen for work via a persistent websocket connection. When tasked, the browser performs a background AJAX request to get DOM content and send it back to the hive. 

Why?
----
Having a diverse address space from which to perform URL crawls ensures we can collect data without a high chance of being blocked. Users who install swarm aid in the collection process without a need to change their existing work habits. 

How's it work?
--------------
Once installed, swarm will enroll the browser into a hive as specified in the options file. Alarms are used to trigger the initial connection to the server and help maintain persistence. Tasking comes directly from the hive and will simply be a request to download specific URL content. URLs are fetched via an AJAX request and the captured DOM is sent back to the hive. 
