#!/usr/bin/env node
'use  strict';

const _ = require('lodash');
const ngrok = require('ngrok');
const prompt = require('prompt');
const yargsOuter = require('yargs');
const promisify = require('es6-promisify');
const BlockBundleServer = require('./lib/block_bundle_server');
const blockCloneAsync = require('./lib/block_clone');

const promptAsync = promisify(prompt.get);

const defaultPort = 8000;

const Commands = {
    RUN: 'run',
    CLONE: 'clone',
    PUSH: 'push',
    PULL: 'pull',
};

function _exitWithError(message) {
    console.log(message);
    process.exit(1);
}

function triggerInitialBundleAndStartNgrok(blockBundleServer, port) {
    // We perform an intial bundle before starting ngrok since the user might
    // have made changes since the last time the server was running or this
    // this might be the very first time they are running the server.
    // NOTE: We do this here instead of in BlockBundleServer.start so that
    // the bundler logging doesn't mess up the port prompt stuff below.
    blockBundleServer.bundle(null, () => {
        ngrok.connect(port, (err, url) => {
            if (err) {
                _exitWithError(err.message);
            }
            console.log(`Serving bundle at ${url}/bundle`);
        });
    });
}

function startBlockBundleServer(blockBundleServer, port) {
    blockBundleServer.startAsync(port).then(() => {
        triggerInitialBundleAndStartNgrok(blockBundleServer, defaultPort);
    }).catch(err => {
        // If there was an error due to the port being taken, prompt for an
        // alternative port and try again
        if (err.code == 'EADDRINUSE') {
            prompt.get({
                name: 'port',
                description: `Port ${port} is taken, please provide an alternative port to run on`,
            }, (err, result) => {
                if (err) {
                    _exitWithError(err.message);
                }
                const newPort = result.port;
                if (isNaN(newPort)) {
                    _exitWithError('Invalid port number');
                }
                startBlockBundleServer(newPort);
            });
        } else {
            _exitWithError(err.message);
        }
    });
}



const runBlocksCli =  function runBlocksCli() {
    yargsOuter['$0'] = 'blocks';
    const config = yargsOuter
        .usage('Usage: blocks <command> [options]')
        .command(`${Commands.CLONE} <appId> <blockId> <blockDirPath>`, 'Clone a block')
        .command(Commands.RUN, 'Build and run a block')
        .command(Commands.PUSH, 'Push changes to server')
        .command(Commands.PULL, 'Push changes from server')
        .example('blocks clone app123 blk456 /path/to/block/')
        .example('blocks run')
        .example('block push')
        .example('block pull')
        .help('help')
        .argv;

    const command = config._[0] || '';
    if (command === Commands.RUN) {
        const blockBundleServer = new BlockBundleServer();
        startBlockBundleServer(blockBundleServer, defaultPort);
    } else if (command === Commands.CLONE) {
        // Prompt for apiKey
        promptAsync({
            name: 'apiKey',
            description: `Please enter your api key. You can generate one at https://airtable.com/account`,
        }).then(result => {
            return blockCloneAsync(config.appId, config.blockId, config.blockDirPath, result.apiKey);
        }).then(() => {
            console.log(`Block cloned in ${config.blockDirPath}`);
        }).catch(err => {
            _exitWithError(err.message)
        });
    } else if (command === Commands.PUSH) {
        throw new Error('Not implemented yet');
    } else if (command === Commands.PULL) {
        throw new Error('Not implemented yet');
    } else {
        yargsOuter.showHelp();
        _exitWithError('Please use a valid command');
    }
};

runBlocksCli();
