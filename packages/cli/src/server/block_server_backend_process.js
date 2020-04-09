// @flow

require('core-js/stable');
require('regenerator-runtime/runtime');
const invariant = require('invariant');
const path = require('path');
const BlocksBackendEventHandler = require('../../blocks_backend_wrapper/blocks_backend_event_handler');
const BlockServerBackendDevCredentialsManager = require('./block_server_backend_dev_credentials_manager');
const downloadBackendSdkAsync = require('../helpers/download_backend_sdk_async');
const {BackendProcessResponseTypes} = require('../types/block_server_backend_process_types');

import type {
    BackendProcessOptions,
    BackendProcessRequest,
    BackendProcessResponse,
} from '../types/block_server_backend_process_types';
import type {RemoteJson} from '../types/remote_json_type.js';

// Copied from https://stackoverflow.com/questions/17581830/load-node-js-module-from-string-in-memory
function requireFromString(src) {
    const Module = module.constructor;
    const m = new Module();
    m._compile(src, '');
    return m.exports;
}

async function requireBackendSdkAsync(
    backendSdkBaseUrl: string | null,
    remoteJson: RemoteJson,
    canUseCachedBackendSdk: boolean,
) {
    const backendSdkJs = await downloadBackendSdkAsync({
        backendSdkBaseUrlIfExists: backendSdkBaseUrl,
        remoteJson,
        canUseCachedBackendSdk,
    });

    // This is sketchy: some runtime checks for "am I running in Node" check that
    // typeof self === 'undefined', so this breaks that...
    // But whatwg-fetch references `self` so if we don't do this, the SDK doesn't
    // load. TODO(kasra): look into removing the dependency on whatwg-fetch.
    global.self = global;
    const BackendBlockSdkWrapper = requireFromString(backendSdkJs);
    return BackendBlockSdkWrapper;
}

/** Send message to block server main process. */
function sendResponse(response: BackendProcessResponse) {
    invariant(process.send, 'process.send'); // Suppresses flow warning
    try {
        process.send(response);
    } catch (err) {
        // This can happen when the main process has called disconnect(). Since
        // this process is about to be killed anyway there's nothing we need to
        // do here.
    }
}

async function setUpBackendProcessAsync(options: BackendProcessOptions) {
    const {
        outputUserTranspiledDirPath,
        blockJson,
        remoteJson,
        backendSdkBaseUrl,
        blockDevCredentialsPath,
        canUseCachedBackendSdk,
    } = options;

    // Download the backend sdk.
    const BackendBlockSdkWrapper = await requireBackendSdkAsync(
        backendSdkBaseUrl,
        remoteJson,
        canUseCachedBackendSdk,
    );
    const backendBlockSdkWrapperInstance = new BackendBlockSdkWrapper();

    // Set up the local developer credentials if local path is provided
    const blocksDevCredentialsManager = new BlockServerBackendDevCredentialsManager(
        blockDevCredentialsPath,
    );

    // Set up backend event handler.
    const backendRouteHandlerModulePrefix = outputUserTranspiledDirPath.endsWith(path.sep)
        ? outputUserTranspiledDirPath
        : outputUserTranspiledDirPath + path.sep;
    const blocksBackendEventHandler = new BlocksBackendEventHandler({
        blockJson,
        backendBlockSdkWrapperInstance,
        enableUploadLogsToS3: false,
        developerCredentialByNameIfExists: blocksDevCredentialsManager.getDeveloperCredentialByNameIfExists(),
        resolveBackendRouteHandler: BlocksBackendEventHandler.resolveBackendRouteHandlerWithRequirePrefix.bind(
            null,
            backendRouteHandlerModulePrefix,
        ),
    });

    // When we receive a request, call user code and send back the response.
    process.on('message', async (event: BackendProcessRequest) => {
        const response = await blocksBackendEventHandler.handleEventAsync(event);
        sendResponse({
            messageType: BackendProcessResponseTypes.EVENT_RESPONSE,
            pid: process.pid,
            requestId: event.requestId,
            ...response,
        });
    });

    // Signal that this process is ready to start serving requests.
    sendResponse({
        messageType: BackendProcessResponseTypes.READY,
        pid: process.pid,
    });
}

// Entrypoint
if (require.main === module) {
    invariant(!!process.argv[2], 'BackendProcessOptions argument expected');
    // Since this module is only expected to be invoked programmatically by the
    // block server main process, we will skip validation of the argument here.
    const options: BackendProcessOptions = JSON.parse(process.argv[2]);
    setUpBackendProcessAsync(options);
}
