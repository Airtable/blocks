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
    FORMAT: 'format',
    PUSH: 'push',
    PULL: 'pull',
    LINT: 'lint',
    RENAME_ENTRY: 'rename-entry',
};

const domainByEnvironment = {
    production: 'airtable.com',
    staging: 'staging.airtable.com',
    local: 'hyperbasedev.com:3000',
};

function _exitWithError(message, err) {
    console.error('Error:', message);
    if (err) {
        console.error(err.stack);
    }
    process.exit(1);
}

function startBlockBundleServerNgrok(blockBundleServer, port) {
    return blockBundleServer.startAsync(port).then(
        () =>
            new Promise((resolve, reject) => {
                require('ngrok').connect(port, (err, url) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(url);
                });
            }),
    );
}

function startBlockBundleServerLocal(blockBundleServer, port) {
    return blockBundleServer.startLocalAsync(port).then(() => {
        const url = `https://localhost:${port}`;
        console.log('Local mode: serving self-signed https on localhost');
        console.log(
            "If this is the first time you're running this command in local mode, you need to do some extra setup in your browser:",
        );
        console.log(`  - Firefox: go to https://localhost:${port} and add an ssl exception`);
        console.log(
            `  - Safari: go to https://localhost:${port}, click show details > visit this website, and log in`,
        );
        console.log(
            '  - Chrome: go to chrome://flags/#allow-insecure-localhost and click enable. Restart your browser',
        );
        console.log('');
        return url;
    });
}

function startBlockBundleServer(blockBundleServer, port, shouldUseLocalhost) {
    const startPromise = shouldUseLocalhost
        ? startBlockBundleServerLocal(blockBundleServer, port)
        : startBlockBundleServerNgrok(blockBundleServer, port);

    startPromise
        .then(url => {
            // Wait for the initial bundle to finish before logging the ngrok
            // url to the user so there's definitely a bundle ready on the
            // first hit.
            blockBundleServer.setPublicBaseUrl(url);
            blockBundleServer.bundle(null, () => {
                console.log(`Serving bundle at ${url}/__runFrame`);
            });
        })
        .catch(err => {
            // If there was an error due to the port being taken, prompt for an
            // alternative port and try again.
            if (err.code === 'EADDRINUSE') {
                promptAsync({
                    name: 'port',
                    description: `Port ${port} is taken, please provide an alternative port to run on`,
                })
                    .then(result => {
                        const newPort = result.port;
                        if (isNaN(newPort)) {
                            _exitWithError('Invalid port number');
                        }
                        startBlockBundleServer(blockBundleServer, newPort, shouldUseLocalhost);
                    })
                    .catch(innerErr => {
                        _exitWithError(innerErr.message);
                    });
            } else {
                _exitWithError(err.message);
            }
        });
}

const runBlocksCli = function runBlocksCli() {
    const config = yargsOuter
        .usage('Usage: block <command> [options]')
        .command(
            `${Commands.CLONE} <blockIdentifier> <blockDirPath>`,
            'Clone a block from Airtable',
        )
        .command(Commands.RUN, 'Build and run a block')
        .command(Commands.PUSH, 'Push changes to Airtable')
        .command(Commands.PULL, 'Pull changes from Airtable')
        .command(Commands.FORMAT, 'Format block code')
        .command(Commands.LINT, 'Lint block code')
        .command(`${Commands.RENAME_ENTRY} <newName>`, 'Update the entry module name')
        .option('force', {
            describe: 'Bypass revision check when updating files?',
            type: 'boolean',
            default: false,
        })
        .option('local', {
            description:
                'Run blocks locally on with a self-signed certificate instead of through ngrok.io',
            type: 'boolean',
            default: false,
        })
        .option('environment', {
            description: 'Which environment to sync with',
            choices: ['production', 'staging', 'local'],
            default: 'production',
        })
        .option('transpile-all', {
            description: 'Transpile JS for all browsers airtable supports, rather than a minimal set for development',
            type: 'boolean',
            default: false
        })
        .check(configInner => {
            const command = configInner._[0] || '';
            if (command === Commands.CLONE) {
                const blockIdentifier = String(configInner.blockIdentifier);
                const blockIdentifierSplit = blockIdentifier.split('/');
                if (!blockIdentifierSplit[0] || !blockIdentifierSplit[1]) {
                    throw new Error('Block identifier must be of format <applicationId>/<blockId>');
                }
                configInner.appId = blockIdentifierSplit[0];
                configInner.blockId = blockIdentifierSplit[1];
            }
            return true;
        })
        .example('block clone app123/blk456 my-block')
        .example('block run')
        .example('block push')
        .example('block pull')
        .example('block rename-entry newModuleName')
        .help('help').argv;

    const command = config._[0] || '';
    if (command === Commands.RUN) {
        const BlockBundleServer = require('./lib/block_bundle_server');
        const blockBundleServer = new BlockBundleServer({transpileAll: config.transpileAll});
        startBlockBundleServer(blockBundleServer, defaultPort, config.local);
    } else if (command === Commands.CLONE) {
        const environment = config.environment;
        const domain = domainByEnvironment[environment];
        // Prompt for apiKey.
        promptAsync({
            name: 'apiKey',
            description: `Please enter your API key. You can generate one at https://${domain}/account`,
        })
            .then(result => {
                const blockCloneAsync = require('./lib/block_clone');
                return blockCloneAsync(
                    environment,
                    config.appId,
                    config.blockId,
                    config.blockDirPath,
                    result.apiKey,
                );
            })
            .then(() => {
                console.log(`Block cloned in ${config.blockDirPath}`);
            })
            .catch(err => {
                _exitWithError(err.message);
            });
    } else if (command === Commands.PUSH) {
        const blockPushAsync = require('./lib/block_push');
        blockPushAsync({shouldForceUpdate: config.force})
            .then(() => {
                console.log('Remote block updated');
            })
            .catch(err => {
                _exitWithError(err.message);
            });
    } else if (command === Commands.PULL) {
        const blockPullAsync = require('./lib/block_pull');
        blockPullAsync()
            .then(() => {
                console.log('Local block updated');
            })
            .catch(err => {
                _exitWithError(err.message);
            });
    } else if (command === Commands.FORMAT) {
        const findBlockDirPathAsync = require('./lib/find_block_dir_path');
        const blockFormat = require('./lib/block_format');
        findBlockDirPathAsync()
            .then(blockDirPath => {
                const setUpDevToolsIfNeededSync = require('./lib/set_up_dev_tools_if_needed_sync');
                const didSetUpDevTools = setUpDevToolsIfNeededSync(blockDirPath);
                if (didSetUpDevTools) {
                    console.log('Dev dependencies updated. Please run `yarn` and try again.');
                    process.exit(1);
                }

                console.log('Formatting...');
                blockFormat(blockDirPath);
                console.log('Done');
            })
            .catch(err => {
                _exitWithError(err.message);
            });
    } else if (command === Commands.LINT) {
        const findBlockDirPathAsync = require('./lib/find_block_dir_path');
        const blockLint = require('./lib/block_lint');
        findBlockDirPathAsync()
            .then(blockDirPath => {
                const setUpDevToolsIfNeededSync = require('./lib/set_up_dev_tools_if_needed_sync');
                const didSetUpDevTools = setUpDevToolsIfNeededSync(blockDirPath);
                if (didSetUpDevTools) {
                    console.log('Dev dependencies updated. Please run `yarn` and try again.');
                    process.exit(1);
                }

                console.log('Linting...');
                const lint = blockLint(blockDirPath);
                const report = lint.report;
                console.log(lint.formatter(report.results));
            })
            .catch(err => {
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
