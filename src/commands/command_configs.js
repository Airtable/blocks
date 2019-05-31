// @flow
const CommandNames = require('./command_names');
const Environments = require('../types/environments');
const path = require('path');
const _ = require('lodash');

import type {CommandName} from './command_names';
import type {Argv, Options, PositionalOptions} from 'yargs';

type RunCommandFn = (argv: Argv) => Promise<void>;

type CommandConfig = {|
    name: CommandName,
    command: string,
    // A description of `false` hides the command.
    description: string | false,
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
    [CommandNames.INIT]: {
        name: CommandNames.INIT,
        command: `${CommandNames.INIT} <blockIdentifier> <blockDirPath>`,
        description: 'Initialize a block repo',
        example: `block ${CommandNames.INIT} app123/blk456 my-block`,
        positionalMap: {
            blockIdentifier: {
                description: 'identifier for the block (of the form <baseId>/<blockId>)',
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
                description: 'Which environment the block lives on',
                choices: _.values(Environments),
                default: Environments.PRODUCTION,
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: commandRunner(CommandNames.INIT),
    },
    [CommandNames.CLONE]: {
        name: CommandNames.CLONE,
        command: `${CommandNames.CLONE} <blockIdentifier> <blockDirPath>`,
        description: 'Clone a block from Airtable',
        example: `block ${CommandNames.CLONE} app123/blk456 my-block`,
        positionalMap: {
            blockIdentifier: {
                description: 'identifier for the block (of the form <baseId>/<blockId>)',
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
                choices: _.values(Environments),
                default: Environments.PRODUCTION,
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
            ngrok: {
                description:
                    'Run blocks through ngrok.io',
                type: 'boolean',
                hidden: true, // hide from --help output
                default: false,
            },
            'transpile-all': {
                description:
                    'Transpile JS for all browsers airtable supports, rather than a minimal set for development',
                type: 'boolean',
                default: false,
            },
            'sdk-repo': {
                description:
                    'Path to a local copy of @airtable/blocks to use instead of the npm one',
                type: 'string',
                hidden: true,
            },
        },
        runCommandAsync: commandRunner(CommandNames.RUN),
    },
    [CommandNames.RELEASE]: {
        name: CommandNames.RELEASE,
        command: `${CommandNames.RELEASE}`,
        description: 'Release a block',
        example: `block ${CommandNames.RELEASE}`,
        runCommandAsync: commandRunner(CommandNames.RELEASE),
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
        description: false,
        example: `block ${CommandNames.SET_CREDENTIAL}`,
        // NOTE: the module name (set_credential) doesn't exactly match the command name (set-credential)
        // in order to conform to our file naming guidelines.
        runCommandAsync: commandRunner('set_credential'),
    },
    [CommandNames.DELETE_CREDENTIAL]: {
        name: CommandNames.DELETE_CREDENTIAL,
        command: `${CommandNames.DELETE_CREDENTIAL} <credentialName>`,
        description: false,
        example: `block ${CommandNames.DELETE_CREDENTIAL} CREDENTIAL_NAME`,
        positionalMap: {
            credentialName: {
                description: 'name of credential to delete',
                type: 'string',
            },
        },
        // NOTE: the module name (delete_credential) doesn't exactly match the command name (delete-credential)
        // in order to conform to our file naming guidelines.
        runCommandAsync: commandRunner('delete_credential'),
    },
    [CommandNames.RENAME_CREDENTIAL]: {
        name: CommandNames.RENAME_CREDENTIAL,
        command: `${CommandNames.RENAME_CREDENTIAL} <currentName> <newName>`,
        description: false,
        example: `block ${CommandNames.RENAME_CREDENTIAL} CURRENT_NAME NEW_NAME`,
        positionalMap: {
            currentName: {
                type: 'string',
                description: 'Current name for the credential',
            },
            newName: {
                type: 'string',
                description: 'New name for the credential',
            },
        },
        // NOTE: the module name (rename_credential) doesn't exactly match the command name (rename-credential)
        // in order to conform to our file naming guidelines.
        runCommandAsync: commandRunner('rename_credential'),
    },
    [CommandNames.LIST_CREDENTIALS]: {
        name: CommandNames.LIST_CREDENTIALS,
        command: `${CommandNames.LIST_CREDENTIALS}`,
        description: false,
        example: `block ${CommandNames.LIST_CREDENTIALS}`,
        // NOTE: the module name (list_credentials) doesn't exactly match the command name (list-credentials)
        // in order to conform to our file naming guidelines.
        runCommandAsync: commandRunner('list_credentials'),
    },
};

module.exports = commandConfigs;
