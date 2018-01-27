#!/usr/bin/env node
/* eslint-disable no-console */
'use  strict';

const prompt = require('prompt');
const yargsOuter = require('yargs');
const promisify = require('es6-promisify');

const promptAsync = promisify(prompt.get);

const defaultPort = 8000;

const Commands = {
    RUN: 'run',
    CLONE: 'clone',
    PUSH: 'push',
    PULL: 'pull',
    LINT: 'lint',
    RENAME_ENTRY: 'rename-entry',
};

function _exitWithError(message, err) {
    console.error('Error:', message);
    if (err) {
        console.error(err.stack);
    }
    process.exit(1);
}

function startNgrokAndTriggerInitialBundle(blockBundleServer, port) {
    const ngrok = require('ngrok');
    // We start ngrok, then tell the server its ngrok url, then trigger the
    // initial bundle and finally log the url to the user.
    // NOTE: We wait for the initial bundle to finish before logging the
    // ngrok url to the user so that they we can ensure that there is a
    // bundle at the time the url if first hit.
    ngrok.connect(port, (err, url) => {
        if (err) {
            _exitWithError(err.message);
        }
        blockBundleServer.setPublicUrlForLongPoll(url);
        blockBundleServer.bundle(null, () => {
            console.log(`Serving bundle at ${url}/bundle`);
        });
    });
}

function startBlockBundleServer(blockBundleServer, port) {
    blockBundleServer.startAsync(port).then(() => {
        startNgrokAndTriggerInitialBundle(blockBundleServer, defaultPort);
    }).catch(err => {
        // If there was an error due to the port being taken, prompt for an
        // alternative port and try again
        if (err.code === 'EADDRINUSE') {
            promptAsync({
                name: 'port',
                description: `Port ${port} is taken, please provide an alternative port to run on`,
            }).then(result => {
                const newPort = result.port;
                if (isNaN(newPort)) {
                    _exitWithError('Invalid port number');
                }
                startBlockBundleServer(blockBundleServer, newPort);
            }).catch(err => {
                _exitWithError(err.message);
            });
        } else {
            _exitWithError(err.message);
        }
    });
}

const runBlocksCli = function runBlocksCli() {
    const config = yargsOuter
        .usage('Usage: block <command> [options]')
        .command(`${Commands.CLONE} <blockIdentifier> <blockDirPath>`, 'Clone a block from Airtable')
        .command(Commands.RUN, 'Build and run a block')
        .command(Commands.PUSH, 'Push changes to Airtable')
        .command(Commands.PULL, 'Pull changes from Airtable')
        .command(Commands.LINT, 'Lint block code')
        .command(`${Commands.RENAME_ENTRY} <newName>`, 'Update the entry module name')
        .option('force', {
            describe: 'Bypass revision check when updating files?',
            type: 'boolean',
            default: false,
        })
        .check(config => {
            const command = config._[0] || '';
            if (command === Commands.CLONE) {
                const blockIdentifier = config.blockIdentifier;
                const blockIdentifierSplit = blockIdentifier.split('/');
                if (!blockIdentifierSplit[0] || !blockIdentifierSplit[1]) {
                    throw new Error('Block identifier must be of format <applicationId>/<blockId>');
                }
                config.appId = blockIdentifierSplit[0];
                config.blockId = blockIdentifierSplit[1];
            }
            return true;
        })
        .example('block clone app123/blk456 my-block')
        .example('block run')
        .example('block push')
        .example('block pull')
        .example('block rename-entry newModuleName')
        .help('help')
        .argv;

    const command = config._[0] || '';
    if (command === Commands.RUN) {
        const BlockBundleServer = require('./lib/block_bundle_server');
        const blockBundleServer = new BlockBundleServer();
        startBlockBundleServer(blockBundleServer, defaultPort);
    } else if (command === Commands.CLONE) {
        // Prompt for apiKey
        promptAsync({
            name: 'apiKey',
            description: 'Please enter your API key. You can generate one at https://airtable.com/account',
        }).then(result => {
            const blockCloneAsync = require('./lib/block_clone');
            return blockCloneAsync(config.appId, config.blockId, config.blockDirPath, result.apiKey);
        }).then(() => {
            console.log(`Block cloned in ${config.blockDirPath}`);
        }).catch(err => {
            _exitWithError(err.message);
        });
    } else if (command === Commands.PUSH) {
        const blockPushAsync = require('./lib/block_push');
        blockPushAsync({shouldForceUpdate: config.force}).then(() => {
            console.log('Remote block updated');
        }).catch(err => {
            _exitWithError(err.message);
        });
    } else if (command === Commands.PULL) {
        const blockPullAsync = require('./lib/block_pull');
        blockPullAsync().then(() => {
            console.log('Local block updated');
        }).catch(err => {
            _exitWithError(err.message);
        });
    } else if (command === Commands.LINT) {
        const findBlockDirPathAsync = require('./lib/find_block_dir_path');
        const blockLint = require('./lib/block_lint');
        findBlockDirPathAsync().then(blockDirPath => {
            console.log('Linting...');
            const lint = blockLint(blockDirPath);
            const report = lint.report;
            console.log(lint.formatter(report.results));
        }).catch(err => {
            _exitWithError(err.message);
        });
    } else if (command === Commands.RENAME_ENTRY) {
        const updateEntryModuleName = require('./lib/update_entry_module_name');
        try {
            updateEntryModuleName(config.newName);
            console.log('Entry module name updated');
        } catch (err) {
            _exitWithError(err.message);
        }
    } else {
        yargsOuter.showHelp();
        _exitWithError('Please use a valid command');
    }
};

runBlocksCli();
