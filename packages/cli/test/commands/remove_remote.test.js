// @flow
/* eslint-disable no-console */
const assert = require('assert');
const sinon = require('sinon');
const path = require('path');
const fsUtils = require('../../src/helpers/fs_utils');
const {getTemporaryDirectoryPath, assertThrowsAsync} = require('../helpers');
const getBlockDirPathModule = require('../../src/helpers/get_block_dir_path');
const removeRemote = require('../../src/commands/remove_remote');

describe('remove-remote', function() {
    describe('runCommandAsync', function() {
        let blockDirPath;

        async function runRemoveRemoteAsync(args: {remoteName: string}): Promise<void> {
            const fakeArgv = {
                _: [],
                $0: 'block',
                remoteName: args.remoteName,
            };

            // We stub console.log to tidy up test output, but need to restore it
            // because the test runner relies on it!
            sinon.stub(console, 'log');
            sinon.stub(console, 'error');
            try {
                await removeRemote.runCommandAsync(fakeArgv);
            } finally {
                console.log.restore();
                console.error.restore();
            }
        }

        beforeEach(function() {
            blockDirPath = getTemporaryDirectoryPath();
            sinon.stub(getBlockDirPathModule, 'getBlockDirPath').returns(blockDirPath);
        });

        describe('removing an existing remote JSON file', function() {
            it('succeeds when deleting existing remote', async function() {
                await fsUtils.mkdirPathAsync(path.join(blockDirPath, '.block'));
                const haxJsonPath = path.join(blockDirPath, '.block', 'hax.remote.json');
                const whoaJsonPath = path.join(blockDirPath, '.block', 'whoa.remote.json');
                await fsUtils.writeFileAsync(haxJsonPath, JSON.stringify({}));
                await fsUtils.writeFileAsync(whoaJsonPath, JSON.stringify({}));

                await runRemoveRemoteAsync({remoteName: 'whoa'});

                assert.strictEqual(true, await fsUtils.existsAsync(haxJsonPath));
                assert.strictEqual(false, await fsUtils.existsAsync(whoaJsonPath));
            });

            it('succeeds but does nothing if the remote does not exist', async function() {
                await fsUtils.mkdirPathAsync(path.join(blockDirPath, '.block'));
                const defaultJsonPath = path.join(blockDirPath, '.block', 'remote.json');
                const whoaJsonPath = path.join(blockDirPath, '.block', 'whoa.remote.json');
                await fsUtils.writeFileAsync(defaultJsonPath, JSON.stringify({}));
                await fsUtils.writeFileAsync(whoaJsonPath, JSON.stringify({}));

                await runRemoveRemoteAsync({remoteName: 'thisRemoteDoesNotExist'});

                assert.strictEqual(true, await fsUtils.existsAsync(defaultJsonPath));
                assert.strictEqual(true, await fsUtils.existsAsync(whoaJsonPath));
            });

            it('fails if the remoteName is not formatted properly', async function() {
                const invalidNames = ['//a', 'aa\\\\', 'b:c', 'i have spaces', '~12', 'nok.nok'];

                for (const invalidName of invalidNames) {
                    const err = await assertThrowsAsync(async () => {
                        await runRemoveRemoteAsync({remoteName: invalidName});
                    });
                    assert.strictEqual(
                        err.message,
                        '❌ Incorrect characters for the remote name! Only alphanumeric, -, or _ characters are allowed',
                    );
                }
            });
        });
    });
});
