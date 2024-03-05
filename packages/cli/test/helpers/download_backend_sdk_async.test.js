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
            callback(null, {statusCode: 200, body: '{dummy: "test"}'});
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

    it('fetches SDK directly from the URL if backendSdkUrlIfExists is provided', async function() {
        await downloadBackendSdkAsync({
            backendSdkUrlIfExists: 'https://foo.com/fake.js',
            remoteJson: {baseId: 'app123', blockId: 'blk987', server: 'https://do-not-call-me.com'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://foo.com/fake.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from staging.airtable.com URL if remoteJson.remoteName is staging', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {
                baseId: 'app123',
                blockId: 'blk987',
                server: 'https://bar.com',
                remoteName: 'staging',
            },
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri:
                    'https://staging.airtable.com/js/compiled/esbuild/staging/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from alpha-airtable.com URL if remoteJson.remoteName is alpha', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {
                baseId: 'app123',
                blockId: 'blk987',
                server: 'https://bar.com',
                remoteName: 'alpha',
            },
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://alpha-airtable.com/js/compiled/esbuild/alpha/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from bravo-airtable.com URL if remoteJson.remoteName is bravo', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {
                baseId: 'app123',
                blockId: 'blk987',
                server: 'https://bar.com',
                remoteName: 'bravo',
            },
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://bravo-airtable.com/js/compiled/esbuild/bravo/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from hyperbasedev.com:3000 URL if remoteJson.remoteName is development', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {
                baseId: 'app123',
                blockId: 'blk987',
                server: 'https://bar.com',
                remoteName: 'development',
            },
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri:
                    'https://hyperbasedev.com:3000/js/compiled/esbuild/development/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from production airtable.com if if remoteJson.remoteName is not provided', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {baseId: 'app123', blockId: 'blk987', remoteName: null},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://airtable.com/js/compiled/esbuild/production/block_backend_sdk.js',
                headers: {
                    'User-Agent': blockCliConfigSettings.USER_AGENT,
                },
            }),
        );
    });

    it('fetches SDK from production airtable.com if if remoteJson.remoteName is not a Hyperbase RunEnviornment', async function() {
        await downloadBackendSdkAsync({
            remoteJson: {baseId: 'app123', blockId: 'blk987', remoteName: 'blahblah'},
            canUseCachedBackendSdk: true,
        });

        assert(
            postmanRequestFake.calledOnceWithExactly({
                method: 'GET',
                uri: 'https://airtable.com/js/compiled/esbuild/production/block_backend_sdk.js',
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
