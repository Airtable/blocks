// @flow
const proxyquire = require('proxyquire').noCallThru();
const path = require('path');
const sinon = require('sinon');
const assert = require('assert');
const fsUtils = require('../../src/helpers/fs_utils');
const {getTemporaryDirectoryPath} = require('../helpers');
const blockCliConfigSettings = require('../../src/config/block_cli_config_settings');

let postmanRequestFake;
const downloadBackendSdkAsyncPath = path.join(
    __dirname,
    '..',
    '..',
    'src',
    'helpers',
    'download_backend_sdk_async.js',
);

const tmpDir = getTemporaryDirectoryPath();
const downloadBackendSdkAsync = proxyquire(downloadBackendSdkAsyncPath, {
    'postman-request': (args, callback) => {
        postmanRequestFake(args);
        process.nextTick(() => {
            callback(null, {statusCode: 200});
        });
    },
    '../config/block_cli_config_settings': {
        ...blockCliConfigSettings,
        TEMP_DIR_PATH: tmpDir,
    },
});

describe('downloadBackendSdkAsync', function() {
    beforeEach(() => {
        postmanRequestFake = sinon.fake();
    });

    afterEach(async () => {
        await fsUtils.emptyDirAsync(tmpDir);
    });

    it('fetches SDK from provided backendSdkBaseUrlIfExists', async function() {
        await downloadBackendSdkAsync({
            backendSdkBaseUrlIfExists: 'https://foo.com',
            remoteJson: {baseId: 'app123', blockId: 'blk987', server: 'https://do-not-call-me.com'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://foo.com/js/compiled/esbuild/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from remoteJson if backendSdkBaseUrlIfExists is not provided', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {baseId: 'app123', blockId: 'blk987', server: 'https://bar.com'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://bar.com/js/compiled/esbuild/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from production airtable.com if backendSdkBaseUrlIfExists is not provided or remoteJson.server is not configured', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {baseId: 'app123', blockId: 'blk987'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://airtable.com/js/compiled/esbuild/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it("strips 'api-' from remoteJson.server url", async function() {
        await downloadBackendSdkAsync({
            remoteJson: {baseId: 'app123', blockId: 'blk987', server: 'https://api-test.foo.com'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://test.foo.com/js/compiled/esbuild/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it("strips 'api.' from remoteJson.server url", async function() {
        await downloadBackendSdkAsync({
            remoteJson: {baseId: 'app123', blockId: 'blk987', server: 'https://api.foo.com'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://foo.com/js/compiled/esbuild/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    describe('canUseCachedBackendSdk', function() {
        it('fetches from local cache and only makes one network call', async function() {
            await downloadBackendSdkAsync({
                backendSdkBaseUrlIfExists: 'https://foo.com',
                remoteJson: {
                    baseId: 'app123',
                    blockId: 'blk987',
                    server: 'https://do-not-call-me.com',
                },
                canUseCachedBackendSdk: true,
            });

            await downloadBackendSdkAsync({
                backendSdkBaseUrlIfExists: 'https://foo.com',
                remoteJson: {
                    baseId: 'app123',
                    blockId: 'blk987',
                    server: 'https://do-not-call-me.com',
                },
                canUseCachedBackendSdk: true,
            });

            assert(postmanRequestFake.calledOnce);
        });

        it('bypasses cache and makes multiple network call', async function() {
            await downloadBackendSdkAsync({
                backendSdkBaseUrlIfExists: 'https://foo.com',
                remoteJson: {
                    baseId: 'app123',
                    blockId: 'blk987',
                    server: 'https://do-not-call-me.com',
                },
                canUseCachedBackendSdk: true,
            });

            // Call with 'canUseCachedBackendSdk' is false, which should make another network call
            await downloadBackendSdkAsync({
                backendSdkBaseUrlIfExists: 'https://foo.com',
                remoteJson: {
                    baseId: 'app123',
                    blockId: 'blk987',
                    server: 'https://do-not-call-me.com',
                },
                canUseCachedBackendSdk: false,
            });

            assert(postmanRequestFake.calledTwice);
        });
    });
});
