// @flow
const path = require('path');

function getBlocksCliProjectRootPath(): string {
    return path.join(__dirname, '..', '..');
}

module.exports = getBlocksCliProjectRootPath;
