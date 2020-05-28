// @flow
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const fsUtils = require('../../src/helpers/fs_utils');
const {getTemporaryDirectoryPath} = require('../helpers');

const accessAsync = promisify(fs.access);
const mkdirAsync = promisify(fs.mkdir);
const rmdirAsync = promisify(fs.rmdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

describe('fs_utils', function() {
    describe('renameAsync', function() {
        let tmpDir;
        beforeEach(async () => {
            tmpDir = getTemporaryDirectoryPath();
            await mkdirAsync(tmpDir);
        });
        afterEach(async () => {
            await fsUtils.emptyDirAsync(tmpDir);
            await rmdirAsync(tmpDir);
        });

        it('destination does not exist', async () => {
            const oldPath = path.join(tmpDir, 'begin');
            const newPath = path.join(tmpDir, 'end');
            await writeFileAsync(oldPath, 'hello');

            await fsUtils.renameAsync(oldPath, newPath);

            assert.equal(await readFileAsync(newPath), 'hello');
            // flow-disable-next-line https://github.com/facebook/flow/issues/8269
            await assert.rejects(() => accessAsync(oldPath), {code: 'ENOENT'});
        });

        it('destination exists as a file', async () => {
            const oldPath = path.join(tmpDir, 'begin');
            const newPath = path.join(tmpDir, 'end');
            await writeFileAsync(oldPath, 'hello');
            await writeFileAsync(newPath, 'goodbye');

            await fsUtils.renameAsync(oldPath, newPath);

            assert.equal(await readFileAsync(newPath), 'hello');
            // flow-disable-next-line https://github.com/facebook/flow/issues/8269
            await assert.rejects(() => accessAsync(oldPath), {code: 'ENOENT'});
        });

        it('destination exists as a directory', async () => {
            const oldPath = path.join(tmpDir, 'begin');
            const newPath = path.join(tmpDir, 'end');
            await writeFileAsync(oldPath, 'hello');
            await mkdirAsync(newPath);

            // flow-disable-next-line https://github.com/facebook/flow/issues/8269
            await assert.rejects(() => promisify(fs.rename)(oldPath, newPath), {code: 'EISDIR'});
            assert.equal(await readFileAsync(oldPath), 'hello');
            await accessAsync(newPath);
        });
    });
});
