// @flow
const invariant = require('invariant');
const getBlockDirPath = require('../get_block_dir_path');
const getApiKeySync = require('../get_api_key_sync');
const BlockServer = require('../block_server');
const LocalSdkBuilder = require('../local_sdk_builder');
const cliHelpers = require('../helpers/cli_helpers');
const parseAndValidateBlockJsonAsync = require('../helpers/parse_and_validate_block_json_async');
const parseAndValidateRemoteJsonAsync = require('../helpers/parse_and_validate_remote_json_async');

import type {Argv} from 'yargs';

const DEFAULT_PORT = 8000;

async function runCommandAsync(argv: Argv): Promise<void> {
    const apiKey = getApiKeySync(getBlockDirPath());
    const {ngrok, transpileAll, sdkRepo} = argv;
    const remoteName = argv.remote || null;
    invariant(typeof ngrok === 'boolean', 'expects ngrok to be a boolean');
    invariant(typeof transpileAll === 'boolean', 'expects transpileAll to be a boolean');
    invariant(remoteName === null || typeof remoteName === 'string', 'expects remoteName to be null or a string');

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

    let sdkPath;
    if (sdkRepo) {
        invariant(typeof sdkRepo === 'string', 'expects sdkRepo to be a string');
        sdkPath = sdkRepo;
    } else {
        sdkPath = null;
    }
    await LocalSdkBuilder.startIfNeededAsync(sdkPath);

    const blockServer = new BlockServer({
        apiKey,
        transpileAll,
        blockJson,
        remoteJson,
    });

    let port = DEFAULT_PORT;
    while (true) { // eslint-disable-line no-constant-condition
        try {
            // Try starting the server on this port.
            await blockServer.startAsync(port, ngrok);

            // Ran successfully, so break out of our loop.
            break;
        } catch (err) {
            // If there was an error due to the port being taken, prompt for an
            // alternative port and try again.
            if (err.code === 'EADDRINUSE') {
                const result = await cliHelpers.promptAsync({
                    name: 'port',
                    description: `Port ${port} is taken, please provide an alternative port to run on`,
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
