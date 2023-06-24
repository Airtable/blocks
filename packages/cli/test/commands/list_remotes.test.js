// @flow
/* eslint-disable no-console */
const assert = require('assert');
const sinon = require('sinon');
const path = require('path');
const fsUtils = require('../../src/helpers/fs_utils');
// flow-disable-next-line because flow-type defs are missing for @oclif/test
const {expect, test} = require('@oclif/test');
const {getTemporaryDirectoryPath, assertThrowsAsync} = require('../helpers');
const getBlockDirPathModule = require('../../src/helpers/get_block_dir_path');
const listRemotes = require('../../src/commands/list_remotes');

describe('list-remotes', function() {
    describe('runCommandAsync', function() {
        let blockDirPath;

        async function runListRemotesAsync(): Promise<void> {
            const fakeArgv = {
                _: [],
                $0: 'block',
            };

            await listRemotes.runCommandAsync(fakeArgv);
        }

        beforeEach(function() {
            blockDirPath = getTemporaryDirectoryPath();
            sinon.stub(getBlockDirPathModule, 'getBlockDirPath').returns(blockDirPath);
        });

        it('errors if there is no block configuration directory', async function() {
            const err = await assertThrowsAsync(async () => {
                await runListRemotesAsync();
            });

            assert.strictEqual(err.message, 'Block configuration directory missing!');
        });

        it('errors if no remotes are found', async function() {
            await fsUtils.mkdirPathAsync(path.join(blockDirPath, '.block'));

            const err = await assertThrowsAsync(async () => {
                await runListRemotesAsync();
            });

            assert.strictEqual(err.message, 'No remotes found!');
        });

        // NOTE: This 'describe' test block departs from our typical testing patterns because
        // it makes use of the @oclif/test lib, which is effectively a mocha extension, allowing
        // chainable extensions, and uses chai.
        describe('outputting to stdout', function() {
            let remotes;
            beforeEach(async function() {
                remotes = [
                    {
                        baseId: 'app123',
                        blockId: 'blk123',
                    },
                    {
                        baseId: 'appAbC',
                        blockId: 'blkAbC',
                    },
                ];

                await fsUtils.mkdirPathAsync(path.join(blockDirPath, '.block'));
            });

            afterEach(async function() {
                await fsUtils.removeAsync(path.join(blockDirPath, '.block'));
            });

            test.stdout()
                .do(
                    async () =>
                        await fsUtils.writeFileAsync(
                            path.join(blockDirPath, '.block', 'a.b.remote.json'),
                            JSON.stringify(remotes[0]),
                        ),
                )
                .it('errors if remote filename is not formatted properly', async output => {
                    const err = await assertThrowsAsync(async () => {
                        await runListRemotesAsync();
                    });

                    expect(err.message).to.equal(
                        "'a.b.remote.json' is an incorrect remote filename format! Please remove the file and use 'block add-remote' to create it.",
                    );
                });

            test.stdout()
                .do(
                    async () =>
                        await fsUtils.writeFileAsync(
                            path.join(blockDirPath, '.block', 'remote.json'),
                            JSON.stringify(remotes[0]),
                        ),
                )
                .do(async () => await runListRemotesAsync())
                .it('lists one remote with "default" as name', async output => {
                    const expectedOutput =
                        'Name    Block identifier \n ─────── ──────────────── \n default app123/blk123';
                    expect(output.stdout.trim()).to.include(expectedOutput.trim());
                });

            test.stdout()
                .do(
                    async () =>
                        await fsUtils.writeFileAsync(
                            path.join(blockDirPath, '.block', 'remote.json'),
                            JSON.stringify(remotes[0]),
                        ),
                )
                .do(
                    async () =>
                        await fsUtils.writeFileAsync(
                            path.join(blockDirPath, '.block', 'whoa.remote.json'),
                            JSON.stringify(remotes[1]),
                        ),
                )
                .do(async () => await runListRemotesAsync())
                .it('lists multiple remotes', async output => {
                    const expectedOutput =
                        'Name    Block identifier \n ─────── ──────────────── \n default app123/blk123    \n whoa    appAbC/blkAbC';
                    expect(output.stdout.trim()).to.include(expectedOutput.trim());
                });

            test.stdout()
                .do(
                    async () =>
                        await fsUtils.writeFileAsync(
                            path.join(blockDirPath, '.block', 'remote.json'),
                            JSON.stringify(remotes[0]),
                        ),
                )
                .do(async () => {
                    const remoteWithServer = {
                        baseId: 'appServer',
                        blockId: 'blkServer',
                        server: 'https://example.com',
                    };
                    await fsUtils.writeFileAsync(
                        path.join(blockDirPath, '.block', 'i_have_server.remote.json'),
                        JSON.stringify(remoteWithServer),
                    );
                })
                .do(async () => await runListRemotesAsync())
                .it('lists "Server" column if it exists', async output => {
                    const expectedOutput =
                        'Name          Block identifier    Server              \n ───────────── ─────────────────── ─────────────────── \n i_have_server appServer/blkServer https://example.com \n default       app123/blk123';
                    expect(output.stdout.trim()).to.include(expectedOutput.trim());
                });

            test.stdout()
                .do(
                    async () =>
                        await fsUtils.writeFileAsync(
                            path.join(blockDirPath, '.block', 'remote.json'),
                            JSON.stringify(remotes[0]),
                        ),
                )
                .do(async () => {
                    const remoteWithServer = {
                        baseId: 'appApiKey',
                        blockId: 'blkApiKey',
                        apiKeyName: 'okok',
                    };
                    await fsUtils.writeFileAsync(
                        path.join(blockDirPath, '.block', 'i_have_api_key.remote.json'),
                        JSON.stringify(remoteWithServer),
                    );
                })
                .do(async () => await runListRemotesAsync())
                .it('lists "Api key name" column if it exists', async output => {
                    const expectedOutput =
                        'Name           Block identifier    Api key name \n ────────────── ─────────────────── ──────────── \n i_have_api_key appApiKey/blkApiKey okok         \n default        app123/blk123       undefined';
                    expect(output.stdout.trim()).to.include(expectedOutput.trim());
                });
        });
    });
});
