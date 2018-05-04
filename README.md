
An app for sending quick messages in the Discord webhook API.
This app is written in node.js with the factory design patter and uses the command line to work.

the command have 2 actions:

**send** - this will send a message through the Discord webhook API. this action has 3 mandatory options:
1. server (alias: s) - this is the server name, its defined in the app itself and will throw error if not found.
2. member (alias: m) - this is the webhook user defined in the server. the list is different between each server classes
3. content (alias: c) - this is the text which will be sent as the message body.

an example for a send call:

$ app.js send -s=myServer -m=serverMember -c="this is my message"

______________________________________________________________________________

**list-members** - this will list all the members that was defined in the server class and that are able to be used in the send command.
this action has 1 mandatory option:
1. server (alias: s) - the server we would like to view the members list
