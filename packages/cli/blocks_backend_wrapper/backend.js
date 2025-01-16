// @flow

/**
 * IMPORTANT **********
 * This file (and all of the contents of this folder) is *very* different from other
 * parts of the codebase. This is the wrapper code used in deployed backend blocks.
 *
 * This whole folder will just be copied directly into backend deployment packages.
 * All dependencies should be installed directly within this folder (i.e. it should
 * not rely on any hyperbase dependencies), and all requires should be relative.
 */

// This is sketchy: some runtime checks for "am I running in Node" check that
// typeof self === 'undefined', so this breaks that...
// But whatwg-fetch references `self` so if we don't do this, the SDK doesn't
// load. TODO(kasra): look into removing the dependency on whatwg-fetch.
global.self = global;

const BlocksDevCredentialsManager = require('./blocks_dev_credentials_manager');
const BlocksBackendEventHandler = require('./blocks_backend_event_handler');

// Keep the module name require'd below in sync with
// blockCliConfigSettings.BACKEND_SDK_MODULE. We can't import blocksConfigSettings
// here because it won't get copied into the deployment bundle.
// flow-disable-next-line since the sdk file will be written as part of the build process.
const BackendBlockSdkWrapper = require('../block_backend_sdk');
// flow-disable-next-line since the block.json file will be written as part of the build process.
const blockJson: BlockJson = require('../user/block.json');

import type {LambdaEvent} from './types/lambda_event_type';

type LambdaContext = Object;
type LambdaCallback = (error: Error | null, response: mixed) => void;

// Lambda layers are available in /opt
const DEV_CREDENTIALS_JSON_FILE_PATH_IN_LAMBDA_LAYER = '/opt/developerCredentials.json';
const blocksDevCredentialsManager = new BlocksDevCredentialsManager(
    DEV_CREDENTIALS_JSON_FILE_PATH_IN_LAMBDA_LAYER,
);

const backendBlockSdkWrapperInstance = new BackendBlockSdkWrapper();
const blocksBackendEventHandler = new BlocksBackendEventHandler({
    blockJson,
    backendBlockSdkWrapperInstance,
    enableUploadLogsToS3: true,
    developerCredentialByNameIfExists: blocksDevCredentialsManager.getDeveloperCredentialByNameIfExists(),
    resolveBackendRouteHandler: BlocksBackendEventHandler.resolveBackendRouteHandlerWithRequirePrefix.bind(
        null,
        '../user/',
    ),
});

exports.handler = function(event: LambdaEvent, context: LambdaContext, callback: LambdaCallback) {
    blocksBackendEventHandler
        .handleEventAsync(event)
        .then(response => {
            callback(null, response);
        })
        .catch(err => {
            callback(null, {
                statusCode: 500,
                // TODO(jb): in dev mode, return error stack + message.
                body: {
                    err: err.toString(),
                    stack: err.stack,
                    message: 'SERVER_ERROR',
                },
            });
        });
};
