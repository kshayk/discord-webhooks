const request = require('request');
const yargs = require('yargs');
const pconfirm = require('prompt-confirm');

//abstract class for discord servers
class ServerAbstract {
    constructor() {
        this.webhook_main_url = 'https://discordapp.com/api/webhooks/';
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

//to create more server classes, copy this and change the webhook_members. also add another case to ServerFactory
class Cnc extends ServerAbstract {
    constructor() {
        super();
        this.webhook_members = {
            'hackermango': '390237661471834112/X449qVEzdGBNkACqPVEXEYQmmiPsNZrkAHJy9ANAyIJWA0HkmbEnkupqs1eMvBdTTlJ3',
            'apolly': '401028144167125003/yOqEHDdg9o9DzOSKbzkAJB4fz5eT1lSbrwBNeWSrcilINTf8nR91Uuq9Gcx1hiCCO83F',
            'p10': '407906839905435649/HTiZBH0UDrX028DkSHjyfvy-1Ig6PX06zdI_T5iiI9ATNe1vw3rn7Qj-LJpMzi6Qu2qn',
            'birthday boi': '424212530320113676/e_MR1i_6lH4th8NEB_slEDQ10FqsqZxbuzu3Sjd5bdGOXR9VxER8oTTXTdf4i_reKETo'
        };

        this.server_users = {
            'rai': '254723676358836225'
        }
    }
}

class ServerFactory {
    static factory(type) {
        switch (type) {
            case 'cnc':
                var obj = new Cnc();
                break;
            default:
                throw `Class ${type} not found`;
        }

        return obj;
    }
}

const argv = yargs.command('send', 'Command to send the webhook message', {
    server: {
        describe: 'the server to send the webbhook to',
        demand: true,
        alias: 's'
    },
    member: {
        describe: 'the webhook to send the message from',
        demand: true,
        alias: 'm'
    },
    content: {
        describe: 'the content of the message',
        demand: true,
        alias: 'c'
    }
})
.command('list-members', 'Command to list all webhook members of certain server', {
    server: {
        describe: 'the server to get all the webbhook members from',
        demand: true,
        alias: 's'
    },
})
.command('list-server-users', 'Command to list the server users which you can tag with @', {
    server: {
        describe: 'the server to get all the webbhook members from',
        demand: true,
        alias: 's'
    },
})
.help()
.argv;

switch (argv._[0]) {
    case 'send':
        var server_class = ServerFactory.factory(argv.server); //an alternative call for static, in PHP it would be ServerFactory::factory()
        var patt = /@[0-9a-zA-z]+/g;
        var regex_matches = [];
        var missing_index_users = false;

        var m;

        do {
            m = patt.exec(argv.content);
            if (m) {
                regex_matches.push(m[0]);
            }
        } while (m);

        if(regex_matches.length !== 0) {
            for(var i = 0; i < regex_matches.length; i++) {
                argv.content = argv.content.replace(regex_matches[i], function(user) {
                    var trimmed_text = regex_matches[i].replace('@', '');

                    var user_id = server_class.server_users[trimmed_text];

                    if(typeof user_id !== 'undefined') {
                        return `<@${user_id}>`;
                    } else {
                        missing_index_users = (missing_index_users) ? missing_index_users += ` ${regex_matches[i]}` : regex_matches[i];
                        return regex_matches[i];
                    }
                });
            }

            if(missing_index_users) {
                var prompt = new pconfirm(`the following users were not found: ${missing_index_users}. Do you wish to continue with the sending?`);
                prompt.ask(function(answer) {
                  if(answer) {
                      server_class.sendMessage(argv.member, argv.content);
                  }
                });
            }
        } else {
            server_class.sendMessage(argv.member, argv.content);
        }

        break;
    case 'list-members':
        var server_class = ServerFactory.factory(argv.server);
        server_class.getMembers();
        break;
    case 'list-server-users':
        var server_class = ServerFactory.factory(argv.server);
        server_class.getServerUsers();
        break;
    default:
        throw `no action named ${argv._[0]} found.`
}
