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

async function runUnsupportedCommandAsync(argv: Argv) {
    throw new Error(`The ${argv._[0]} command is no longer supported. If you are working on a block that is not yet migrated to the new block.json format, you may need to use an old version of blocks-cli`);
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
            remote: {
                description: 'Configure which remote to use',
                type: 'string',
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: commandRunner(CommandNames.RUN),
    },
    [CommandNames.RELEASE]: {
        name: CommandNames.RELEASE,
        command: `${CommandNames.RELEASE}`,
        description: 'Release a block',
        example: `block ${CommandNames.RELEASE}`,
        optionMap: {
            remote: {
                description: 'Configure which remote to use',
                type: 'string',
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: commandRunner(CommandNames.RELEASE),
    },

    // THE FOLLOWING COMMANDS ARE NO LONGER SUPPORTED.
    // TODO(jb): remove them once all blocks are migrated to the standalone CLI world.
    [CommandNames.CLONE]: {
        name: CommandNames.CLONE,
        command: `${CommandNames.CLONE}`, // Doesn't specify the positionals here so that even doing `block clone` will show the unsupported command error.
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.CLONE} app123/blk456 my-block`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.PUSH]: {
        name: CommandNames.PUSH,
        command: `${CommandNames.PUSH}`,
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.PUSH}`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.PULL]: {
        name: CommandNames.PULL,
        command: `${CommandNames.PULL}`,
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.PULL}`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.RENAME_ENTRY]: {
        name: CommandNames.RENAME_ENTRY,
        command: `${CommandNames.RENAME_ENTRY}`, // Doesn't specify the positionals here so that even doing `block rename-entry` will show the unsupported command error.
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.RENAME_ENTRY} newModuleName`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.SET_CREDENTIAL]: {
        name: CommandNames.SET_CREDENTIAL,
        command: `${CommandNames.SET_CREDENTIAL}`,
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.SET_CREDENTIAL}`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.DELETE_CREDENTIAL]: {
        name: CommandNames.DELETE_CREDENTIAL,
        command: `${CommandNames.DELETE_CREDENTIAL}`, // Doesn't specify the positionals here so that even doing `block rename-entry` will show the unsupported command error.
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.DELETE_CREDENTIAL} CREDENTIAL_NAME`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.RENAME_CREDENTIAL]: {
        name: CommandNames.RENAME_CREDENTIAL,
        command: `${CommandNames.RENAME_CREDENTIAL}`, // Doesn't specify the positionals here so that even doing `block rename-entry` will show the unsupported command error.
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.RENAME_CREDENTIAL} CURRENT_NAME NEW_NAME`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
    [CommandNames.LIST_CREDENTIALS]: {
        name: CommandNames.LIST_CREDENTIALS,
        command: `${CommandNames.LIST_CREDENTIALS}`,
        description: false, // UNSUPPORTED, so hide this from help output.
        example: `block ${CommandNames.LIST_CREDENTIALS}`,
        runCommandAsync: runUnsupportedCommandAsync,
    },
};

module.exports = commandConfigs;
