// @flow
const path = require('path');
const os = require('os');
const {TEST_SERVER_PORT} = require('../src/config/block_cli_config_settings');

const TEST_API_URL = 'http://localhost:' + TEST_SERVER_PORT;

function getTemporaryDirectoryPath(): string {
    const id = Math.random()
        .toString()
        .slice(2);
    const tmpDirName = 'airtable-blocks-cli-test_' + id;
    return path.join(os.tmpdir(), tmpDirName);
}

module.exports = {
    TEST_API_URL,
    getTemporaryDirectoryPath,
};
