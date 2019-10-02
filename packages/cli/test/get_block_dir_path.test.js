// @flow
const {getBlockDirPath} = require('../src/helpers/get_block_dir_path');
const path = require('path');
const fs = require('fs');
const {getTemporaryDirectoryPath} = require('./helpers');
const {outputFile, ensureDir} = require('fs-extra');
const assert = require('assert');

describe('getBlockDirPath', function() {
    let oldCwd: string;
    let tmpDirPath: string;

    beforeEach(async function() {
        oldCwd = process.cwd();

        tmpDirPath = getTemporaryDirectoryPath();
    });

    afterEach(function() {
        process.chdir(oldCwd);
    });

    it('finds the first parent directory that contains block.json', async function() {
        const nestedDirPath = path.join(tmpDirPath, 'a', 'b', 'c', 'd');

        await Promise.all([
            outputFile(path.join(tmpDirPath, 'block.json'), '{}'),
            outputFile(path.join(nestedDirPath, 'block.json'), '{}'),
        ]);

        process.chdir(nestedDirPath);
        assertPathsEqual(getBlockDirPath(), nestedDirPath);

        process.chdir(path.join(nestedDirPath, '..'));
        assertPathsEqual(getBlockDirPath(), tmpDirPath);

        process.chdir(path.join(nestedDirPath, '..', '..'));
        assertPathsEqual(getBlockDirPath(), tmpDirPath);

        process.chdir(tmpDirPath);
        assertPathsEqual(getBlockDirPath(), tmpDirPath);
    });

    it('throws if no parent directory contains block.json', async function() {
        await ensureDir(tmpDirPath);
        process.chdir(tmpDirPath);

        assert.throws(getBlockDirPath);
    });
});

// This resolves symlinks.
function assertPathsEqual(a, b) {
    assert.strictEqual(fs.realpathSync(a), fs.realpathSync(b));
}
