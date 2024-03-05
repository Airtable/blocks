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
                default: blockCliConfigSettings.HELLO_WORLD_TEMPLATE_URL,
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
            http: {
                description: 'Use HTTP protocol instead of HTTPS for local development server',
                type: 'boolean',
                default: false,
            },
            remote: {
                description: '[Beta] Configure which remote to use',
                type: 'string',
            },
            'backend-sdk-url': {
                description: `Fully formed URL for downloading backend blocks SDK. This should only be for 1P Airtable-built Blocks
\tExample: https://airtable.com/js/compiled/esbuild/production/block_backend_sdk.js`,
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
            testing: {
                description: 'Run in testing mode',
                type: 'boolean',
                default: false,
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
                description: '[Beta] Configure which remote to use',
                type: 'string',
            },
            'backend-sdk-url': {
                description: `fully formed URL for downloading backend blocks SDK. This should only be for 1P Airtable-built Blocks
\tExample: https://airtable.com/js/compiled/esbuild/production/block_backend_sdk.js`,
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
            'upload-source-maps-to-sentry': {
                description:
                    "Uploads the source map for the block's frontend bundle to a Sentry project. Need to also set BLOCK_CLI_SENTRY_{AUTH_TOKEN|ORG|PROJECT} environment variables.",
                type: 'boolean',
                default: false,
                hidden: true,
            },
            comment: {
                description:
                    'A string describing the changes in this release. Can be at most 1000 characters',
                type: 'string',
                hidden: true,
            },
        },
        runCommandAsync: commandRunner(CommandNames.RELEASE),
    },
    [CommandNames.ADD_REMOTE]: {
        name: CommandNames.ADD_REMOTE,
        command: `${CommandNames.ADD_REMOTE} <blockIdentifier> <remoteName>`,
        description: '[Beta] Add a new remote configuration',
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
        description: '[Beta] List remote configurations',
        example: `block ${CommandNames.LIST_REMOTES}`,
        runCommandAsync: commandRunner(CommandNames.LIST_REMOTES),
    },
    [CommandNames.REMOVE_REMOTE]: {
        name: CommandNames.REMOVE_REMOTE,
        command: `${CommandNames.REMOVE_REMOTE} <remoteName>`,
        description: '[Beta] Remove a remote configuration',
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
    [CommandNames.SUBMIT]: {
        name: CommandNames.SUBMIT,
        command: CommandNames.SUBMIT,
        description: 'Submit app for review for listing in the the Airtable Marketplace',
        example: `block ${CommandNames.SUBMIT}`,
        runCommandAsync: commandRunner(CommandNames.SUBMIT),
        optionMap: {
            remote: {
                description: '[Beta] Configure which remote to use',
                type: 'string',
            },
        },
    },
};

module.exports = commandConfigs;
