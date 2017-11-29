#!/usr/bin/env node
'use  strict';

const _ = require('lodash');
const ngrok = require('ngrok');
const BlockBuilderServer = require('./lib/block_builder_server');

const Commands = {
    run: 'run',
    push: 'push',
    pull: 'pull',
};

function _exitWithError(message) {
    console.log(message);
    process.exit(1);
}

const command = process.argv[2];
if (!command || !_.includes(_.values(Commands), command)) {
    _exitWithError('Please provide a valid command');
}

switch (command) {
    case Commands.run:
        const port = parseInt(process.argv[3]);
        if (!port || isNaN(port)) {
            _exitWithError('Please provide a valid port number');
        }
        const blockBuilderServer = new BlockBuilderServer(port);
        blockBuilderServer.start();
        ngrok.connect(port, (err, url) => {
            if (err) {
                _exitWithError(err.message);
            }
            console.log(`Serving bundle at ${url}/bundle`);
        });
        break;
    default:
        _exitWithError('Not implemented yet');
}
