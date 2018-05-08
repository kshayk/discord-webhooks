const yargs = require('yargs');
const pconfirm = require('prompt-confirm');
const request = require('request');

//require server classes
const ServerFactory = require('./servers/serverFactory.js');

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
            request(server_class.server_json_url, (error, response, body) => {
                if( ! error) {
                    var widget_body = JSON.parse(body);
                    for(var i = 0; i < widget_body.members.length; i++) {
                        server_class.server_users[widget_body.members[i].username.toLowerCase()] =  widget_body.members[i].id;
                    }
                }

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
                } else {
                    server_class.sendMessage(argv.member, argv.content);
                }
            });
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

        //In case the server has the widget activated
        request(server_class.server_json_url, (error, response, body) => {
            if( ! error) {
                var widget_body = JSON.parse(body);
                for(var i = 0; i < widget_body.members.length; i++) {
                    server_class.server_users[widget_body.members[i].username.toLowerCase()] =  widget_body.members[i].id;
                }
            }

            server_class.getServerUsers();
        });

        break;
    default:
        throw `no action named ${argv._[0]} found.`
}
