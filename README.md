# muse-angular
My first try learning Angular.  I apologize for any terrible code you find.  I try to refactor the code every time I feel I've learned something important or useful.  But there are still many places where the code is not up-to-standard.

To run Muse's frontend code:
1. Start muse-node
2. npm install
3. npm start
This will open Muse on port 3000

If Muse is not being run on the localhost,
1. Change the commented super in shared/socket.service and create a file containing the ipaddress for your site.  Change the ipaddress on line 10 in socket.service to reflect that ip address.
2. Switch the comments on lines 7 and 8 in http.service.ts
3. Switch the comments on lines 17 and 18 in auth.service.ts

This is the client end for muse-node.
Muse handles alerts as reported by Zabbix, via slack.
Hani serves the workflows as a troubleshooting app
Eva is a T2/T3 tool that is currently under construction.