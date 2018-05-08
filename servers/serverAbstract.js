const request = require('request');
//abstract class for discord servers
class ServerAbstract {
    constructor() {
        this.server_id = null;
        this.webhook_main_url = 'https://discordapp.com/api/webhooks/';
        this.server_json_url = 'https://discordapp.com/api/guilds/<server_id>/widget.json';
        this.webhook_members = {}; //the webhook APIs
        this.server_users = {} //the users on the server
    }

    sendMessage(member, content) {
        if(typeof this.webhook_members[member] === 'undefined') {
            throw `Could not find webhook member "${member}" for this server`
        }

        var url = `${this.webhook_main_url}${this.webhook_members[member]}`;

        request.post({
          url,
          form: {content}
        }, (error, response, body) => {
            if(error) {
                console.log(error, response);
            }
        });
    }

    getMembers() {
        var member_keys = Object.keys(this.webhook_members);
        for(var i = 0; i < member_keys.length; i++) {
            console.log(member_keys[i]);
        }
    }

    getServerUsers() {
        var user_keys = Object.keys(this.server_users);

        for(var i = 0; i < user_keys.length; i++) {
            console.log(user_keys[i]);
        }
    }
}

module.exports = ServerAbstract;
