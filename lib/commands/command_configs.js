const Commands = require('./commands');
const path = require('path');

function commandRunner(name) {
    return async function(config) {
        const command = require(path.join(__dirname, name));
        await command.runCommandAsync(config);
    };
}

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
        runCommandAsync: commandRunner(Commands.CLONE),
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
        runCommandAsync: commandRunner(Commands.RUN),
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
        runCommandAsync: commandRunner(Commands.PUSH),
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
