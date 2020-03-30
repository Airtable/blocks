// @flow
const BlockServer = require('../src/server/block_server');
const BlockBuilder = require('../src/builder/block_builder');
const BlockBuildTypes = require('../src/types/block_build_types');
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
        let blockBuilder: BlockBuilder;

        beforeEach(function() {
            const blockJson = {
                version: '1.0',
                frontendEntry: './frontend/index.js',
            };
            sinon.stub(BlockBuilder.prototype, 'blockJson').returns(blockJson);
            sinon.stub(BlockBuilder.prototype, 'buildAndWatchAsync').resolves();
            blockBuilder = new BlockBuilder({
                buildTypeMode: BlockBuildTypes.DEVELOPMENT,
                blockJson,
                enableIsolatedBuild: false,
                enableDeprecatedAbsolutePathImport: false,
                transpileForAllBrowsers: true,
            });

            blockServer = new BlockServer({
                blockBuilder: blockBuilder,
                apiKey: 'key123',
                remoteJson: {
                    blockId: 'blk123',
                    baseId: 'app123',
                },
                blockDevCredentialsPath: null,
            });

            sinon
                .stub(blockServer, 'startLocalAsync')
                .callsFake(port => 'https://localhost:' + port);
            sinon.stub(clipboardy, 'write').resolves();
        });

        it('copies the server URL to the clipboard in local mode', async function() {
            await blockServer.startAsync(1234);

            sinon.assert.calledOnce(clipboardy.write);
            sinon.assert.calledWithExactly(clipboardy.write, 'https://localhost:1234');
        });

        it('calls BlockBuilder#buildAndWatchAsync once', async function() {
            await blockServer.startAsync(3333);
            sinon.assert.calledOnce(blockBuilder.buildAndWatchAsync);
        });
    });
});
