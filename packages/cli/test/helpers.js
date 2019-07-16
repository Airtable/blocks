// @flow
const path = require('path');
const assert = require('assert');
const os = require('os');
const {TEST_SERVER_PORT} = require('../src/config/block_cli_config_settings');

const TEST_API_URL = 'http://localhost:' + TEST_SERVER_PORT;

async function assertThrowsAsync(fnAsync: Function, message?: string): Promise<Error> {
    try {
        await fnAsync();
    } catch (err) {
        return err;
    }
    assert(false, message || 'Expected error');
    throw new Error('Cannot reach this statement');
}

function getTemporaryDirectoryPath(): string {
    const id = Math.random()
        .toString()
        .slice(2);
    const tmpDirName = 'airtable-blocks-cli-test_' + id;
    return path.join(os.tmpdir(), tmpDirName);
}

module.exports = {
    TEST_API_URL,
    assertThrowsAsync,
    getTemporaryDirectoryPath,
};
