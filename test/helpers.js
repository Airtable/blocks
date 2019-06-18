// @flow
const path = require('path');
const os = require('os');

function getTemporaryDirectoryPath(): string {
    const id = Math.random()
        .toString()
        .slice(2);
    const tmpDirName = 'airtable-blocks-cli-test_' + id;
    return path.join(os.tmpdir(), tmpDirName);
}

module.exports = {
    getTemporaryDirectoryPath,
};
