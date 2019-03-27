// @flow
const CommandNames = require('./command_names');
const path = require('path');

import type {CommandName} from './command_names';
import type {Argv, Options, PositionalOptions} from 'yargs';

type RunCommandFn = (argv: Argv) => Promise<void>;

type CommandConfig = {|
    name: CommandName,
    command: string,
    description: string,
    example: string,
    positionalMap?: {[string]: PositionalOptions},
    optionMap?: {[string]: Options},
    runCommandAsync: RunCommandFn,
|};

function commandRunner(name: string): RunCommandFn {
    return async function(argv: Argv) {
        // flow-disable-next-line since flow wants us to pass a string literal.
        const command = require(path.join(__dirname, name));
        await command.runCommandAsync(argv);
    };
}

const commandConfigs: {[CommandName]: CommandConfig} = {
    [CommandNames.CLONE]: {
        name: CommandNames.CLONE,
        command: `${CommandNames.CLONE} <blockIdentifier> <blockDirPath>`,
        description: 'Clone a block from Airtable',
        example: `block ${CommandNames.CLONE} app123/blk456 my-block`,
        positionalMap: {
            blockIdentifier: {
                description: 'identifier for the block (of the form <appId>/<blockId>)',
                type: 'string',
            },
            blockDirPath: {
                description: 'directory path for the block',
                type: 'string',
            },
        },
        optionMap: {
            environment: {
                type: 'string',
                description: 'Which environment to clone from',
                choices: ['production', 'staging', 'local'],
                default: 'production',
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: commandRunner(CommandNames.CLONE),
    },
    [CommandNames.RUN]: {
        name: CommandNames.RUN,
        command: `${CommandNames.RUN}`,
        description: 'Build and run a block',
        example: `block ${CommandNames.RUN}`,
        optionMap: {
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
        runCommandAsync: commandRunner(CommandNames.RUN),
    },
    [CommandNames.PUSH]: {
        name: CommandNames.PUSH,
        command: `${CommandNames.PUSH}`,
        description: 'Push changes to Airtable',
        example: `block ${CommandNames.PUSH}`,
        optionMap: {
            force: {
                description: 'Bypass revision check when updating files?',
                type: 'boolean',
                default: false,
            },
        },
        runCommandAsync: commandRunner(CommandNames.PUSH),
    },
    [CommandNames.PULL]: {
        name: CommandNames.PULL,
        command: `${CommandNames.PULL}`,
        description: 'Pull changes from Airtable',
        example: `block ${CommandNames.PULL}`,
        runCommandAsync: commandRunner(CommandNames.PULL),
    },
    [CommandNames.RENAME_ENTRY]: {
        name: CommandNames.RENAME_ENTRY,
        command: `${CommandNames.RENAME_ENTRY} <newName>`,
        description: 'Update the entry module name',
        example: `block ${CommandNames.RENAME_ENTRY} newModuleName`,
        positionalMap: {
            newName: {
                description: 'new name for the frontend entry module',
                type: 'string',
            },
        },
        // NOTE: the module name (rename_entry) doesn't exactly match the command name (rename-entry)
        // in order to conform to our file naming guidelines.
        runCommandAsync: commandRunner('rename_entry'),
    },
    [CommandNames.SET_CREDENTIAL]: {
        name: CommandNames.SET_CREDENTIAL,
        command: `${CommandNames.SET_CREDENTIAL}`,
        description: 'Set developer credentials',
        example: `block ${CommandNames.SET_CREDENTIAL}`,
        // NOTE: the module name (set_credential) doesn't exactly match the command name (set-credential)
        // in order to conform to our file naming guidelines.
        runCommandAsync: commandRunner('set_credential'),
    }
};

module.exports = commandConfigs;
