const getBlockDirPath = require('../get_block_dir_path');
const getApiKeySync = require('../get_api_key_sync');
const BlockServer = require('../block_server');
const LocalSdkBuilder = require('../local_sdk_builder');
const cliHelpers = require('../helpers/cli_helpers');

const DEFAULT_PORT = 8000;

async function runCommandAsync(argv) {
    const apiKey = getApiKeySync(getBlockDirPath());
    const {ngrok, transpileAll, sdkRepo} = argv;

    await LocalSdkBuilder.startIfNeededAsync(sdkRepo || null);

    const blockServer = new BlockServer({
        apiKey,
        transpileAll,
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
