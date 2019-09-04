// @flow

require('@babel/polyfill');
const invariant = require('invariant');
const path = require('path');
const BlocksBackendEventHandler = require('../../blocks_backend_wrapper/blocks_backend_event_handler');
const downloadBackendSdkAsync = require('../helpers/download_backend_sdk_async');
const {BackendProcessResponseTypes} = require('../types/block_server_backend_process_types');

import type {
    BackendProcessOptions,
    BackendProcessRequest,
    BackendProcessResponse,
} from '../types/block_server_backend_process_types';

// Copied from https://stackoverflow.com/questions/17581830/load-node-js-module-from-string-in-memory
function requireFromString(src) {
    const Module = module.constructor;
    const m = new Module();
    m._compile(src, '');
    return m.exports;
}

async function requireBackendSdkAsync(backendSdkBaseUrl: string) {
    const response = await downloadBackendSdkAsync(backendSdkBaseUrl);
    const backendSdkJs = response.body;

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
    process.send(response);
}

async function setUpBackendProcessAsync(options: BackendProcessOptions) {
    const {blockDirPath, blockJson, backendSdkBaseUrl} = options;

    // Download the backend sdk.
    const BackendBlockSdkWrapper = await requireBackendSdkAsync(backendSdkBaseUrl);
    const backendBlockSdkWrapperInstance = new BackendBlockSdkWrapper();

    // Set up backend event handler.
    // TODO(Chuan): Update this when build process is able to handle backend routes.
    const blockDirPathWithTrailingSep = blockDirPath.endsWith(path.sep)
        ? blockDirPath
        : blockDirPath + path.sep;
    const blocksBackendEventHandler = new BlocksBackendEventHandler({
        blockJson,
        backendBlockSdkWrapperInstance,
        enableUploadLogsToS3: false,
        resolveBackendRouteHandler: BlocksBackendEventHandler.resolveBackendRouteHandlerWithRequirePrefix.bind(
            null,
            blockDirPathWithTrailingSep,
        ),
    });

    // When we receive a request, call user code and send back the response.
    process.on('message', async (event: BackendProcessRequest) => {
        const response = await blocksBackendEventHandler.handleEventAsync(event);
        sendResponse({
            messageType: BackendProcessResponseTypes.EVENT_RESPONSE,
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
