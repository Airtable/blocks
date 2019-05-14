// @flow

/**
 * IMPORTANT **********
 * This file (and all of the contents of this folder) is *very* different from other
 * parts of the codebase. This is the wrapper code used in deployed backend blocks.
 *
 * This whole folder will just be copied directly into backend deployment packages.
 * All dependencies should be installed directly within this folder (i.e. it should
 * not rely on any top-level dependencies), and all requires should be relative.
 *
 * This particular file also cannot contain any async/await code, since it requires
 * regenerator-runtime at the top level. If you add async/await code, it will fail
 * since regenerator runtime will not be defined.
 */

require('@babel/polyfill');

// This is sketchy: some runtime checks for "am I running in Node" check that
// typeof self === 'undefined', so this breaks that...
// But whatwg-fetch references `self` so if we don't do this, the SDK doesn't
// load. TODO(kasra): look into removing the dependency on whatwg-fetch.
global.self = global;

const handleEventAsync = require('./handle_event_async');

export type LambdaEvent = {
    method: string,
    query: {[string]: string | $ReadOnlyArray<string>},
    params: {[string]: mixed},
    path: string,
    body: mixed,
    headers: {[string]: string},
    presignedS3UploadUrl: string,
    logKey: string,
    blockInvocationId: string,
    // kvValuesByKey will be void if the kv data couldn't fit into the request
    // due to payload limits.
    kvValuesByKey: Object | void,
    apiAccessPolicyString: string,
    applicationId: string,
    blockInstallationId: string,
    apiBaseUrl: string,
};
type LambdaContext = Object;
type LambdaCallback = (error: Error | null, response: mixed) => void;

exports.handler = function(event: LambdaEvent, context: LambdaContext, callback: LambdaCallback) {
    handleEventAsync(event).then(response => {
        callback(null, response);
    }).catch(err => {
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
