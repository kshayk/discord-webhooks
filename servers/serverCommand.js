const yargs = require('yargs');
const pconfirm = require('prompt-confirm');

module.exports = yargs.command('send', 'Command to send the webhook message', {
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
.help();
