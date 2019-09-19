// @flow
/* eslint-disable no-console */
const assert = require('assert');
const sinon = require('sinon');
const path = require('path');
const fsUtils = require('../../src/helpers/fs_utils');
const {getTemporaryDirectoryPath, assertThrowsAsync} = require('../helpers');
const getBlockDirPathModule = require('../../src/get_block_dir_path');
const addRemote = require('../../src/commands/add_remote');

describe('add-remote', function() {
    describe('runCommandAsync', function() {
        let blockDirPath;
        let fsUtilsWriteSpy;

        async function runAddRemoteAsync(args: {
            remoteName: string,
            baseId: string | null,
            blockId: string | null,
            server?: string,
            apiKeyName?: string,
        }): Promise<void> {
            const fakeArgv = {
                _: [],
                $0: 'block',
                // flow-disable-next-line because we want to test if null values
                blockIdentifier: `${args.baseId}/${args.blockId}`,
                remoteName: args.remoteName,
                server: args.server,
                apiKeyName: args.apiKeyName,
            };

            // We stub console.log to tidy up test output, but need to restore it
            // because the test runner relies on it!
            sinon.stub(console, 'log');
            sinon.stub(console, 'error');
            try {
                await addRemote.runCommandAsync(fakeArgv);
            } finally {
                console.log.restore();
                console.error.restore();
            }
        }

        beforeEach(function() {
            fsUtilsWriteSpy = sinon.spy(fsUtils, 'writeFileAsync');
            blockDirPath = getTemporaryDirectoryPath();
            sinon.stub(getBlockDirPathModule, 'getBlockDirPath').returns(blockDirPath);
        });

        describe('writing a new remote JSON file', function() {
            it('succeeds with the provided remoteName as the filename prefix, and provided block identifier as file contents', async function() {
                await runAddRemoteAsync({
                    remoteName: 'a_remote_name_123',
                    baseId: 'app123',
                    blockId: 'blkABC',
                });
                assert(fsUtilsWriteSpy.calledOnce);

                // flow-disable-next-line
                const remoteJson = await fsUtils.readJsonIfExistsAsync(
                    path.join(blockDirPath, '.block', 'a_remote_name_123.remote.json'),
                );
                assert(remoteJson);
                assert.strictEqual(remoteJson.baseId, 'app123');
                assert.strictEqual(remoteJson.blockId, 'blkABC');
                assert.strictEqual(remoteJson.server, undefined);
                assert.strictEqual(remoteJson.apiKeyName, undefined);
            });

            it('succeeds with the provided server and apiKeyName', async function() {
                await runAddRemoteAsync({
                    remoteName: 'b_remote_name',
                    baseId: 'appXYZ',
                    blockId: 'blk123',
                    server: 'https://example.com',
                    apiKeyName: 'some-key-name',
                });

                // flow-disable-next-line
                const remoteJson = await fsUtils.readJsonIfExistsAsync(
                    path.join(blockDirPath, '.block', 'b_remote_name.remote.json'),
                );
                assert(remoteJson);
                assert.strictEqual(remoteJson.baseId, 'appXYZ');
                assert.strictEqual(remoteJson.blockId, 'blk123');
                assert.strictEqual(remoteJson.server, 'https://example.com');
                assert.strictEqual(remoteJson.apiKeyName, 'some-key-name');
            });

            it('succeeds creating multiple remotes', async function() {
                await runAddRemoteAsync({
                    remoteName: 'remote_uno',
                    baseId: 'app111',
                    blockId: 'blk111',
                });

                await runAddRemoteAsync({
                    remoteName: 'remote_dos',
                    baseId: 'app222',
                    blockId: 'blk222',
                });
                assert(fsUtilsWriteSpy.calledTwice);

                // flow-disable-next-line
                const remoteJson1 = await fsUtils.readJsonIfExistsAsync(
                    path.join(blockDirPath, '.block', 'remote_uno.remote.json'),
                );
                assert(remoteJson1);
                assert.strictEqual(remoteJson1.baseId, 'app111');
                assert.strictEqual(remoteJson1.blockId, 'blk111');
                assert.strictEqual(remoteJson1.server, undefined);
                assert.strictEqual(remoteJson1.apiKeyName, undefined);

                // flow-disable-next-line
                const remoteJson2 = await fsUtils.readJsonIfExistsAsync(
                    path.join(blockDirPath, '.block', 'remote_dos.remote.json'),
                );
                assert(remoteJson2);
                assert.strictEqual(remoteJson2.baseId, 'app222');
                assert.strictEqual(remoteJson2.blockId, 'blk222');
                assert.strictEqual(remoteJson2.server, undefined);
                assert.strictEqual(remoteJson2.apiKeyName, undefined);
            });

            it('exits without making any changes if adding a duplicate name', async function() {
                // 1. Add a remote
                await runAddRemoteAsync({
                    remoteName: 'dupe_name',
                    baseId: 'appOriginal',
                    blockId: 'blkOriginal',
                });

                // 2. Attempt to add a remote with the same name, but different values.
                await runAddRemoteAsync({
                    remoteName: 'dupe_name',
                    baseId: 'appNoNo',
                    blockId: 'blkNoNo',
                });
                assert(fsUtilsWriteSpy.calledOnce);

                // flow-disable-next-line
                const remoteJson = await fsUtils.readJsonIfExistsAsync(
                    path.join(blockDirPath, '.block', 'dupe_name.remote.json'),
                );
                assert(remoteJson);
                assert.strictEqual(remoteJson.baseId, 'appOriginal');
                assert.strictEqual(remoteJson.blockId, 'blkOriginal');
                assert.strictEqual(remoteJson.server, undefined);
                assert.strictEqual(remoteJson.apiKeyName, undefined);
            });

            it('fails if the provided blockIdentifier is mis-formatted', async function() {
                // We stub console.log to tidy up test output, but need to restore it
                // because the test runner relies on it!
                sinon.stub(console, 'log');
                const err = await assertThrowsAsync(async () => {
                    await addRemote.runCommandAsync({
                        _: [],
                        $0: 'block',
                        blockIdentifier: 'app123/blk123/nonono',
                        remoteName: 'blah',
                    });
                });
                console.log.restore();

                assert.strictEqual(
                    err.message,
                    'Block identifier must be of format <baseId>/<blockId>',
                );
            });

            it('fails if baseId is not given', async function() {
                const err = await assertThrowsAsync(async () => {
                    await runAddRemoteAsync({
                        remoteName: 'missing_baseId',
                        baseId: null,
                        blockId: 'blk123',
                    });
                });
                assert(fsUtilsWriteSpy.notCalled);
                assert.strictEqual(
                    err.message,
                    'Block identifier must be of format <baseId>/<blockId>',
                );
            });

            it('fails if blockId is not given', async function() {
                const err = await assertThrowsAsync(async () => {
                    await runAddRemoteAsync({
                        remoteName: 'missing_blockId',
                        baseId: 'appQQQ',
                        blockId: null,
                    });
                });
                assert(fsUtilsWriteSpy.notCalled);
                assert.strictEqual(
                    err.message,
                    'Block identifier must be of format <baseId>/<blockId>',
                );
            });

            it('fails if the remoteName is not formatted properly', async function() {
                const invalidNames = ['//a', 'aa\\\\', 'b:c', 'i have spaces', '~12', 'nok.nok'];

                for (const invalidName of invalidNames) {
                    const err = await assertThrowsAsync(async () => {
                        await runAddRemoteAsync({
                            remoteName: invalidName,
                            baseId: 'app123',
                            blockId: 'blkABC',
                        });
                    });
                    assert(fsUtilsWriteSpy.notCalled);
                    assert.strictEqual(
                        err.message,
                        '❌ Incorrect characters for the remote name! Only alphanumeric, -, or _ characters are allowed',
                    );
                }
            });
        });
    });
});
