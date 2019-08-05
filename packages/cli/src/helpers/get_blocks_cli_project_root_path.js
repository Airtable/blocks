// @flow
const pkgDir = require('pkg-dir');

function getBlocksCliProjectRootPath(): string {
    const blocksCliProjectRootPath = pkgDir.sync(__dirname);
    if (!blocksCliProjectRootPath) {
        throw new Error('Unable to find blocks-cli project root');
    }
    return blocksCliProjectRootPath;
}

module.exports = getBlocksCliProjectRootPath;
