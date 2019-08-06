// @flow
const fs = require('fs');
const util = require('util');
const pathToRegexp = require('path-to-regexp');
// flow-disable-next-line since the sdk file will be written as part of the build process.
const BackendBlockSdkWrapper = require('./block_backend_sdk');

import type {LambdaEvent} from './backend';
import type {BackendRoute, BlockJson} from './types/block_json_type';

// TODO(Chuan): Make this an argument / option to allow easier unit testing.
// flow-disable-next-line since the block.json file will be written as part of the build process.
const blockJson: BlockJson = require('./block.json');
const request = require('request');

type HandlerResponseObj = {
    statusCode?: number,
    body?: mixed,
    headers?: {[string]: mixed},
    errorData?: {
        stack: string,
        message: string,
        name: string,
    },
};

async function requestAsync(opts: Object): Promise<Object> {
    return new Promise(function(resolve, reject) {
        request(opts, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}

async function readFileAsync(filePath: string, encoding: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function convertPromiseOrConstantToPromise(value: mixed): Promise<mixed | void> {
    return Promise.resolve(value);
}

async function endStreamAsync(stream: fs.WriteStream) {
    return new Promise((resolve, reject) => {
        stream.end(resolve);
    });
}

async function uploadLogsToS3Async(
    logFilePath: string,
    logStream: fs.WriteStream,
    presignedS3UploadUrl: string,
) {
    await endStreamAsync(logStream);
    const logs = await readFileAsync(logFilePath, 'utf8');
    return await requestAsync({
        method: 'PUT',
        url: presignedS3UploadUrl,
        body: logs,
        headers: {
            // NOTE: even though we specified the server side encryption when
            // generating the presigned url, we still need to include it as a
            // header. Otherwise, S3 will reject the upload, which is likely a
            // bug on the AWS side.
            'x-amz-server-side-encryption': 'AES256',
        },
    });
}

function wrapConsole(originalConsole, logStream) {
    const methods = ['log', 'error', 'warn', 'info'];
    for (const method of methods) {
        const originalMethod = originalConsole[method];
        // flow-disable-next-line since it doesn't like this, but it's valid.
        originalConsole[method] = function() {
            originalMethod.apply(originalConsole, arguments);
            logStream.write(util.format(...arguments) + '\n');
        };
    }
}

function getRouteAndParamsForEvent(
    event: LambdaEvent,
): {
    route: BackendRoute,
    params: {[string]: string},
} | null {
    for (const route of blockJson.routes || []) {
        if (route.methods.find(method => method.toLowerCase() === event.method.toLowerCase())) {
            const keys = [];
            const re = pathToRegexp(route.urlPath, keys);
            const match = re.exec(event.path);
            if (match) {
                const params = keys.reduce((result, key, index) => {
                    const param = match[index + 1];
                    result[key.name] = param;
                    return result;
                }, {});
                return {
                    route,
                    params,
                };
            }
        }
    }
    return null;
}

const sdkWrapperInstance = new BackendBlockSdkWrapper();

async function callUserCodeForEventAsync(event: LambdaEvent): Promise<HandlerResponseObj> {
    const routeAndParams = getRouteAndParamsForEvent(event);
    if (routeAndParams === null) {
        // No matching route, so treat this as a 404.
        return {
            statusCode: 404,
            body: 'NOT_FOUND',
        };
    }
    const {route, params} = routeAndParams;

    try {
        // Keep this in sync with blocksConfigSettings.GLOBAL_PACKAGES_VARIABLE_NAME.
        // Can't import blocksConfigSettings here because it won't get copied into the
        // deployment bundle.
        // NOTE: it's important that we do this before we require the route module below,
        // since once we require a route module, we'll start running user code (which may
        // depend on this code having run already).
        const GLOBAL_SDK_VARIABLE_NAME = '_airtableBlockSdk';
        if (global[GLOBAL_SDK_VARIABLE_NAME] !== sdkWrapperInstance) {
            // If this isn't assigned yet, or the user's code replaced it for
            // some reason in the previous invocation, set it to the SDK wrapper.
            global[GLOBAL_SDK_VARIABLE_NAME] = sdkWrapperInstance;
        }

        await sdkWrapperInstance.__initializeSdkForEventAsync(event);

        // flow-disable-next-line since this will be written as part of the build process.
        const routeHandlerModule = require('../user/routes/' + route.handler);
        if (!routeHandlerModule) {
            throw new Error(`Route module not found: ${route.handler}`);
        }
        if (
            typeof routeHandlerModule !== 'object' ||
            typeof routeHandlerModule.default !== 'function'
        ) {
            throw new Error(`Route module's default export must be a function: ${route.handler}`);
        }

        const handler = routeHandlerModule.default;

        const requestObj = {
            method: event.method,
            query: event.query,
            params,
            path: event.path,
            body: event.body,
            headers: event.headers,

            // Private fields for SDK consumption:
            _apiBaseUrl: event.apiBaseUrl,
            _apiAccessPolicyString: event.apiAccessPolicyString,
            _applicationId: event.applicationId,
            _blockInstallationId: event.blockInstallationId,
            _blockInvocationId: event.blockInvocationId,
            _kvValuesByKey: event.kvValuesByKey,
        };

        // A backend route handler function may return a promise or a non-promise
        // value. For consistency, let's always convert it to a promise so that we
        // can handle both formats the same.
        const responsePromise = convertPromiseOrConstantToPromise(handler(requestObj));

        const response = await responsePromise;
        return ((response: any): HandlerResponseObj); // eslint-disable-line flowtype/no-weak-types
    } catch (err) {
        console.error(err); // eslint-disable-line no-console
        // Their handler threw an error, so treat this as a 500.
        return {
            statusCode: 500,
            body: {
                error: 'SERVER_ERROR',
            },
            errorData: {
                stack: err.stack,
                message: err.message,
                name: err.name,
            },
        };
    }
}

async function handleEventAsync(event: LambdaEvent): Promise<HandlerResponseObj> {
    const logFilePath = '/tmp/' + event.blockInvocationId + '-log.txt';
    const logStream = fs.createWriteStream(logFilePath);
    // We override the console methods so they also write to our logStream, so
    // we that can upload the logs to S3
    wrapConsole(console, logStream);

    const response = await callUserCodeForEventAsync(event);

    // Before returning, let's upload the logs to S3, but ignore any errors, since we don't want a log upload failure
    // to affect the response.
    // TODO(jb): figure out a better way to handle log upload errors.
    try {
        await uploadLogsToS3Async(logFilePath, logStream, event.presignedS3UploadUrl);
    } catch (err) {
        // No-op
    }

    return response;
}

module.exports = handleEventAsync;
