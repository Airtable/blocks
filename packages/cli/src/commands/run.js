// @flow
const invariant = require('invariant');
const inquirer = require('inquirer');
const getApiKeyWithWarningsAsync = require('../helpers/get_api_key_with_warnings');
const BlockServer = require('../server/block_server');
const BlockBuilder = require('../builder/block_builder');
const LocalSdkBuilder = require('../local_sdk_builder');
const parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
const parseAndValidateRemoteJsonAsync = require('../helpers/parse_and_validate_remote_json_async');
const outputRemotesBetaWarning = require('../helpers/output_remotes_beta_warning');

import type {Argv} from 'yargs';

async function runCommandAsync(argv: Argv): Promise<void> {
    const {transpileAll, sdkRepo, defaultPort} = argv;
    invariant(typeof transpileAll === 'boolean', 'expects transpileAll to be a boolean');
    const remoteName = argv.remote || null;
    invariant(
        remoteName === null || typeof remoteName === 'string',
        'expects remoteName to be null or a string',
    );
    const backendSdkBaseUrl = argv.backendSdkBaseUrl || null;
    invariant(
        backendSdkBaseUrl === null || typeof backendSdkBaseUrl === 'string',
        'expects backendSdkBaseUrl to be null or a string',
    );
    const shouldBackendSdkBypassCache = argv.backendSdkBypassCache || false;
    invariant(
        typeof shouldBackendSdkBypassCache === 'boolean',
        'expects shouldBackendSdkBypassCache to be a boolean',
    );
    const enableDeprecatedAbsolutePathImport = argv.enableDeprecatedAbsolutePathImport || false;
    invariant(
        typeof enableDeprecatedAbsolutePathImport === 'boolean',
        'expects enableDeprecatedAbsolutePathImport to be a boolean',
    );
    const blockDevCredentialsPath = argv.blockDevCredentialsPath || null;
    invariant(
        blockDevCredentialsPath === null || typeof blockDevCredentialsPath === 'string',
        'expect blockDevCredentialsPath to be null or a string',
    );

    if (remoteName !== null) {
        outputRemotesBetaWarning();
    }

    const blockJsonValidationResult = await parseAndValidateBlockJsonAsync();
    if (blockJsonValidationResult.err) {
        throw blockJsonValidationResult.err;
    }
    const blockJson = blockJsonValidationResult.value;

    const parseRemoteResult = await parseAndValidateRemoteJsonAsync(remoteName);
    if (parseRemoteResult.err) {
        throw parseRemoteResult.err;
    }
    const remoteJson = parseRemoteResult.value;

    const apiKeyName = remoteJson.apiKeyName || null;
    const apiKey = await getApiKeyWithWarningsAsync(apiKeyName);

    let sdkPath;
    if (sdkRepo) {
        invariant(typeof sdkRepo === 'string', 'expects sdkRepo to be a string');
        sdkPath = sdkRepo;
    } else {
        sdkPath = null;
    }
    await LocalSdkBuilder.startIfNeededAsync(sdkPath);

    const blockBuilder = await BlockBuilder.createDevelopmentBlockBuilderAsync({
        blockJson,
        remoteJson,
        enableDeprecatedAbsolutePathImport,
        sdkPathIfExists: sdkPath,
        transpileForAllBrowsers: transpileAll,
    });
    const blockServer = new BlockServer({
        apiKey,
        transpileAll,
        blockBuilder,
        backendSdkBaseUrl,
        shouldBackendSdkBypassCache,
        blockDevCredentialsPath,
    });

    let port = defaultPort;
    invariant(typeof port === 'number', 'port should be a number');
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            // Try starting the server on this port.
            await blockServer.startAsync(port);

            // Ran successfully, so break out of our loop.
            break;
        } catch (err) {
            // If there was an error due to the port being taken, prompt for an
            // alternative port and try again.
            if (err.code === 'EADDRINUSE') {
                const result = await inquirer.prompt({
                    type: 'number',
                    name: 'port',
                    message: `Port ${port} is taken, please provide an alternative port to run on:`,
                    default: port + 2,
                });
                if (Number.isNaN(result.port)) {
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
}

module.exports = {runCommandAsync};
