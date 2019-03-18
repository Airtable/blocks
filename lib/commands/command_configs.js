const Commands = require('./commands');
const cliHelpers = require('../helpers/cli_helpers');

const commandConfigs = {
    [Commands.CLONE]: {
        name: Commands.CLONE,
        command: `${Commands.CLONE} <blockIdentifier> <blockDirPath>`,
        description: 'Clone a block from Airtable',
        example: `block ${Commands.CLONE} app123/blk456 my-block`,
        argDescriptions: {
            blockIdentifier: {
                describe: 'identifier for the block (of the form <appId>/<blockId>)',
                type: 'string',
            },
            blockDirPath: {
                describe: 'directory path for the block',
                type: 'string',
            },
        },
        options: {
            environment: {
                description: 'Which environment to clone from',
                choices: ['production', 'staging', 'local'],
                default: 'production',
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: async config => {
            const cloneCommand = require('./clone');
            await cloneCommand.runCommandAsync(config);
        },
    },
    [Commands.RUN]: {
        name: Commands.RUN,
        command: `${Commands.RUN}`,
        description: 'Build and run a block',
        example: `block ${Commands.RUN}`,
        options: {
            local: {
                description:
                    'Run blocks locally on with a self-signed certificate instead of through ngrok.io',
                type: 'boolean',
                default: false,
            },
            'transpile-all': {
                description: 'Transpile JS for all browsers airtable supports, rather than a minimal set for development',
                type: 'boolean',
                default: false,
            },
        },
        runCommandAsync: async config => {
            const getBlockDirPath = require('../get_block_dir_path');
            const getApiKeySync = require('../get_api_key_sync');
            const apiKey = getApiKeySync(getBlockDirPath());

            const defaultPort = 8000;
            const BlockServer = require('../block_server');
            const blockServer = new BlockServer({
                apiKey,
                transpileAll: config.transpileAll,
            });
            let port = defaultPort;
            while (true) { // eslint-disable-line no-constant-condition
                try {
                    // Try starting the server on this port.
                    await blockServer.startAsync(port, config.local);

                    // If we successfully start the server, break out of our loop.
                    break;
                } catch (err) {
                    // If there was an error due to the port being taken, prompt for an
                    // alternative port and try again.
                    if (err.code === 'EADDRINUSE') {
                        const result = await cliHelpers.promptAsync({
                            name: 'port',
                            description: `Port ${port} is taken, please provide an alternative port to run on`,
                        });
                        if (isNaN(result.port)) {
                            throw new Error('Invalid port number');
                        }
                        // Set our port and re-enter the loop.
                        port = result.port;
                    } else {
                        // Rethrow the error.
                        throw err;
                    }
                }
            }
        },
    },
    [Commands.PUSH]: {
        name: Commands.PUSH,
        command: `${Commands.PUSH}`,
        description: 'Push changes to Airtable',
        example: `block ${Commands.PUSH}`,
        options: {
            force: {
                describe: 'Bypass revision check when updating files?',
                type: 'boolean',
                default: false,
            },
        },
        runCommandAsync: async config => {
            const blockPushAsync = require('./push');
            await blockPushAsync({shouldForceUpdate: config.force});
            console.log('Remote block updated');
        },
    },
    [Commands.PULL]: {
        name: Commands.PULL,
        command: `${Commands.PULL}`,
        description: 'Pull changes from Airtable',
        example: `block ${Commands.PULL}`,
        runCommandAsync: async config => {
            const blockPullAsync = require('./pull');
            await blockPullAsync();
            console.log('Local block updated');
        },
    },
    [Commands.RENAME_ENTRY]: {
        name: Commands.RENAME_ENTRY,
        command: `${Commands.RENAME_ENTRY} <newName>`,
        description: 'Update the entry module name',
        example: `block ${Commands.RENAME_ENTRY} newModuleName`,
        argDescriptions: {
            newName: {
                describe: 'new name for the frontend entry module',
                type: 'string',
            },
        },
        runCommandAsync: async config => {
            const updateEntryModuleName = require('./update_entry_module_name');
            updateEntryModuleName(config.newName);
            console.log('Entry module name updated');
        },
    },
};

module.exports = commandConfigs;
