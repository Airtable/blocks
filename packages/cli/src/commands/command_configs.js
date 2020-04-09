// @flow
const CommandNames = require('./command_names');
const {ConfigLocations} = require('../types/config_helpers_type');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
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
        // By convention, the command names have hyphens whilst file names have underscores
        // flow-disable-next-line since flow wants us to pass a string literal.
        const command = require(path.join(__dirname, name.replace(/-/g, '_')));
        await command.runCommandAsync(argv);
    };
}

async function runUnsupportedCommandAsync(argv: Argv) {
    throw new Error(
        `The ${argv._[0]} command is no longer supported. If you are working on a block that is not yet migrated to the new block.json format, you may need to use an old version of blocks-cli`,
    );
}

const commandConfigs: {[CommandName]: CommandConfig} = {
    [CommandNames.INIT]: {
        name: CommandNames.INIT,
        command: `${CommandNames.INIT} <blockIdentifier> <blockDirPath>`,
        description: 'Initialize a block repo',
        example: `block ${CommandNames.INIT} app123/blk456 --template=templateNpmPackage my-block`,
        optionMap: {
            template: {
                description: 'Block template to use as a starting point for your code',
                type: 'string',
                default: blockCliConfigSettings.HELLO_WORLD_TEMPLATE,
            },
        },
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
        runCommandAsync: commandRunner(CommandNames.INIT),
    },
    [CommandNames.RUN]: {
        name: CommandNames.RUN,
        command: `${CommandNames.RUN}`,
        description: 'Build and run a block',
        example: `block ${CommandNames.RUN}`,
        optionMap: {
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
                hidden: true, // hide from --help output
            },
            'default-port': {
                description: 'Configure the default port to use',
                type: 'number',
                default: 9000,
            },
            remote: {
                description: 'Configure which remote to use',
                type: 'string',
            },
            'backend-sdk-base-url': {
                description: 'Base URL to download backend SDK from',
                type: 'string',
                hidden: true, // hide from --help output
            },
            'backend-sdk-bypass-cache': {
                description: 'Bypass the local caching mechanism for the backend SDK',
                type: 'boolean',
                default: false,
                hidden: true, // hide from --help output
            },
            'enable-deprecated-absolute-path-import': {
                description:
                    'Supports using absolute paths for modules import/require via symlinking into node_modules',
                type: 'boolean',
                default: false,
                hidden: true, // hide from --help output
            },
            'block-dev-credentials-path': {
                description: 'Path to local block dev credentials object',
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
            },
            'backend-sdk-base-url': {
                description: 'Base URL to download backend SDK from',
                type: 'string',
                hidden: true, // hide from --help output
            },
            'enable-deprecated-absolute-path-import': {
                description:
                    'Supports using absolute paths for modules import/require via symlinking into node_modules',
                type: 'boolean',
                default: false,
                hidden: true, // hide from --help output
            },
            'disable-isolated-build': {
                description:
                    'Rather than creating a tmp folder and running the build (including a fresh npm install there), instead build directly from the current directory like block run does',
                type: 'boolean',
                default: false,
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: commandRunner(CommandNames.RELEASE),
    },
    [CommandNames.ADD_REMOTE]: {
        name: CommandNames.ADD_REMOTE,
        command: `${CommandNames.ADD_REMOTE} <blockIdentifier> <remoteName>`,
        description: 'Add a new remote configuration',
        example: `block ${CommandNames.ADD_REMOTE} app123/blk456 new_remote`,
        runCommandAsync: commandRunner(CommandNames.ADD_REMOTE),
        optionMap: {
            server: {
                type: 'string',
                description: 'API server endpoint for the remote',
                hidden: true, // hide from --help output
            },
            'api-key-name': {
                type: 'string',
                description: 'The name of the API key this remote should use',
                hidden: true, // hide from --help output
            },
        },
    },
    [CommandNames.LIST_REMOTES]: {
        name: CommandNames.LIST_REMOTES,
        command: `${CommandNames.LIST_REMOTES}`,
        description: 'List remote configurations',
        example: `block ${CommandNames.LIST_REMOTES}`,
        runCommandAsync: commandRunner(CommandNames.LIST_REMOTES),
    },
    [CommandNames.REMOVE_REMOTE]: {
        name: CommandNames.REMOVE_REMOTE,
        command: `${CommandNames.REMOVE_REMOTE} <remoteName>`,
        description: 'Remove a remote configuration',
        example: `block ${CommandNames.REMOVE_REMOTE} remote_to_delete`,
        runCommandAsync: commandRunner(CommandNames.REMOVE_REMOTE),
    },
    [CommandNames.SET_API_KEY]: {
        name: CommandNames.SET_API_KEY,
        command: `${CommandNames.SET_API_KEY}`,
        description: 'Update your Airtable API key',
        example: `block ${CommandNames.SET_API_KEY}`,
        optionMap: {
            location: {
                type: 'string',
                description: 'Which config file to update: user or block scoped',
                choices: _.values(ConfigLocations),
                default: ConfigLocations.USER,
            },
            'api-key-name': {
                description: 'The name of the API key to set',
                type: 'string',
                hidden: true, // hide from --help output
            },
        },
        runCommandAsync: commandRunner(CommandNames.SET_API_KEY),
    },
    [CommandNames.MIGRATE_OLD_BLOCK]: {
        name: CommandNames.MIGRATE_OLD_BLOCK,
        command: `${CommandNames.MIGRATE_OLD_BLOCK}`,
        description: false, // Not documented, since this is for internal use.
        example: `block ${CommandNames.MIGRATE_OLD_BLOCK}`,
        runCommandAsync: commandRunner(CommandNames.MIGRATE_OLD_BLOCK),
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
