// @flow
const BlockServer = require('../src/block_server');
const sinon = require('sinon');
const clipboardy = require('clipboardy');
const path = require('path');
const {getTemporaryDirectoryPath} = require('./helpers');
const {outputFile, ensureDir} = require('fs-extra');

describe('BlockServer', function() {
    let oldCwd: string;

    beforeEach(async function() {
        oldCwd = process.cwd();

        const tmpDir = getTemporaryDirectoryPath();

        await Promise.all([
            outputFile(
                path.join(tmpDir, 'block.json'),
                JSON.stringify({
                    frontendEntry: './frontend/index.js',
                }),
            ),
            outputFile(
                path.join(tmpDir, 'package.json'),
                JSON.stringify({
                    dependencies: {
                        react: '^16.0.0',
                        'react-dom': '^16.0.0',
                    },
                }),
            ),
            ensureDir(path.join(tmpDir, 'node_modules')),
            outputFile(path.join(tmpDir, 'frontend', 'index.js'), '// Empty JS file'),
        ]);

        process.chdir(tmpDir);
    });

    afterEach(function() {
        process.chdir(oldCwd);
    });

    describe('startAsync', function() {
        let blockServer: BlockServer;

        beforeEach(function() {
            blockServer = new BlockServer({
                apiKey: 'key123',
                transpileAll: false,
                blockJson: {
                    frontendEntry: './frontend/index.js',
                },
                remoteJson: {
                    blockId: 'blk123',
                    baseId: 'app123',
                },
            });

            sinon
                .stub(blockServer, 'startLocalAsync')
                .callsFake(port => 'https://localhost:' + port);
            sinon.stub(blockServer, 'startNgrokAsync').resolves('https://abc123.ngrok.io');
            sinon.stub(blockServer, 'bundleFiles').returns();
            sinon.stub(clipboardy, 'write').resolves();
        });

        it('copies the server URL to the clipboard in local mode', async function() {
            await blockServer.startAsync(1234, false);

            sinon.assert.calledOnce(clipboardy.write);
            sinon.assert.calledWithExactly(clipboardy.write, 'https://localhost:1234');
        });

        it('copies the server URL to the clipboard in Ngrok mode', async function() {
            await blockServer.startAsync(1234, true);

            sinon.assert.calledOnce(clipboardy.write);
            sinon.assert.calledWithExactly(clipboardy.write, 'https://abc123.ngrok.io');
        });
    });
});
