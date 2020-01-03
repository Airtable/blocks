// @flow
const fs = require('fs');
const invariant = require('invariant');
const pathToRegexp = require('path-to-regexp');
const request = require('request');
const stripAnsi = require('strip-ansi');
const util = require('util');
const {BlocksBackendExecutionStatuses} = require('./blocks_backend_execution_status');
const {normalizeBackendRouteResponse} = require('./normalize_backend_route_response');

import type {BackendRoute, BlockJson} from './types/block_json_type';
import type {
    BackendRouteHandler,
    BackendRouteRequest,
    BackendRouteResponse,
    NormalizedBackendRouteResponse,
} from './types/backend_route_types';
import type {LambdaEvent} from './types/lambda_event_type';
import type {BlocksBackendExecutionStatus} from './blocks_backend_execution_status';

// TODO(Chuan): Add flow typing for BackendBlockSdkWrapper.
// eslint-disable-next-line flowtype/no-weak-types
type BackendBlockSdkWrapper = any;

/** Resolve backend route handler name to the corresponding function. */
type BackendRouteHandlerResolver = (handlerName: string) => BackendRouteHandler;

const requestAsync = util.promisify(request);
const readFileAsync = util.promisify(fs.readFile);
const unlinkAsync = util.promisify(fs.unlink);

async function endStreamAsync(stream: fs.WriteStream) {
    return new Promise<void>(resolve => stream.end(resolve));
}

class BlocksBackendEventHandler {
    _blockJson: BlockJson;
    _backendBlockSdkWrapperInstance: BackendBlockSdkWrapper;
    _enableUploadLogsToS3: boolean;
    _resolveBackendRouteHandler: BackendRouteHandlerResolver;

    constructor(options: {|
        blockJson: BlockJson,
        backendBlockSdkWrapperInstance: BackendBlockSdkWrapper,
        enableUploadLogsToS3: boolean,
        resolveBackendRouteHandler: BackendRouteHandlerResolver,
    |}) {
        this._blockJson = options.blockJson;
        this._backendBlockSdkWrapperInstance = options.backendBlockSdkWrapperInstance;
        this._enableUploadLogsToS3 = options.enableUploadLogsToS3;
        this._resolveBackendRouteHandler = options.resolveBackendRouteHandler;
    }

    /** Utility function to resolve backend route handler using require() and a prefix. */
    static resolveBackendRouteHandlerWithRequirePrefix(
        prefix: string,
        handlerName: string,
    ): BackendRouteHandler {
        const routeHandlerModulePath = prefix + handlerName;
        // flow-disable-next-line since this will be written as part of the build process.
        const routeHandlerModule = require(routeHandlerModulePath);
        if (!routeHandlerModule) {
            throw new Error(
                `Backend route module not found: ${handlerName} (${routeHandlerModulePath})`,
            );
        }
        if (
            typeof routeHandlerModule !== 'object' ||
            typeof routeHandlerModule.default !== 'function'
        ) {
            throw new Error(
                `Backend route module's default export must be a function: ${handlerName}`,
            );
        }
        return routeHandlerModule.default;
    }

    async _uploadLogsToS3Async(logFilePath: string, presignedS3UploadUrl: string) {
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

    // We patch the global `console` object in order to capture logs
    // from the user's code to a tmp file, which we upload to S3 at
    // the end of the invocation. We need to do this carefully:
    // the `console` object is re-used across separate invocations if
    // the Lambda container happens to be re-used, so after each
    // invocation, we unpatch it to get it back to its original state.
    static originalConsoleMethods = {
        log: console.log, // eslint-disable-line no-console
        error: console.error, // eslint-disable-line no-console
        warn: console.warn, // eslint-disable-line no-console
        info: console.info, // eslint-disable-line no-console
    };
    _patchConsoleToCaptureLogs(logStream: fs.WriteStream) {
        for (const method of Object.keys(BlocksBackendEventHandler.originalConsoleMethods)) {
            const originalMethod = BlocksBackendEventHandler.originalConsoleMethods[method];
            // flow-disable-next-line since it doesn't like this, but it's valid.
            console[method] = function() {
                // eslint-disable-line no-console
                // eslint-disable-line no-console
                originalMethod.apply(console, arguments);
                logStream.write(util.format(...arguments) + '\n');
            };
        }
    }
    _unpatchConsole() {
        for (const method of Object.keys(BlocksBackendEventHandler.originalConsoleMethods)) {
            const originalMethod = BlocksBackendEventHandler.originalConsoleMethods[method];
            // flow-disable-next-line since it doesn't like this, but it's valid.
            console[method] = originalMethod; // eslint-disable-line no-console
        }
    }

    _getRouteAndParamsForEvent(
        event: LambdaEvent,
    ): {route: BackendRoute, params: {[string]: string}} | null {
        for (const route of this._blockJson.routes || []) {
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
                    return {route, params};
                }
            }
        }
        return null;
    }

    _createResponseForExecutionError(
        err: Error,
        status: BlocksBackendExecutionStatus,
    ): NormalizedBackendRouteResponse {
        console.error(err); // eslint-disable-line no-console
        return normalizeBackendRouteResponse(
            {
                statusCode: 500,
                body: JSON.stringify({error: 'SERVER_ERROR', message: stripAnsi(err.message)}),
                errorData: {stack: err.stack, message: err.message, name: err.name},
            },
            status,
        );
    }

    async _callUserCodeForEventAsync(event: LambdaEvent): Promise<NormalizedBackendRouteResponse> {
        const routeAndParams = this._getRouteAndParamsForEvent(event);
        if (routeAndParams === null) {
            // No matching route, so treat this as a 404.
            return normalizeBackendRouteResponse(
                {
                    statusCode: 404,
                    body: 'NOT_FOUND',
                },
                BlocksBackendExecutionStatuses.NO_MATCHING_ROUTES,
            );
        }
        const {route, params} = routeAndParams;

        try {
            // Keep this in sync with blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME.
            // Can't import blocksConfigSettings here because it won't get copied into the
            // deployment bundle.
            // NOTE: it's important that we do this before we require the route module below,
            // since once we require a route module, we'll start running user code (which may
            // depend on this code having run already).
            const GLOBAL_SDK_VARIABLE_NAME = '_airtableBlockSdk';
            if (global[GLOBAL_SDK_VARIABLE_NAME] !== this._backendBlockSdkWrapperInstance) {
                // If this isn't assigned yet, or the user's code replaced it for
                // some reason in the previous invocation, set it to the SDK wrapper.
                global[GLOBAL_SDK_VARIABLE_NAME] = this._backendBlockSdkWrapperInstance;
            }

            await this._backendBlockSdkWrapperInstance.__initializeSdkForEventAsync(event);
        } catch (err) {
            return this._createResponseForExecutionError(
                err,
                BlocksBackendExecutionStatuses.BACKEND_SDK_INIT_ERROR,
            );
        }

        let handler: BackendRouteHandler;
        try {
            handler = this._resolveBackendRouteHandler(route.handler);
        } catch (err) {
            return this._createResponseForExecutionError(
                err,
                BlocksBackendExecutionStatuses.HANDLER_LOAD_ERROR,
            );
        }

        const requestObj: BackendRouteRequest = {
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
        let response: BackendRouteResponse;
        try {
            // A backend route handler function may return a promise or a non-promise
            // value. For consistency, let's always convert it to a promise so that we
            // can handle both formats the same.
            response = await Promise.resolve(handler(requestObj));
        } catch (err) {
            return this._createResponseForExecutionError(
                err,
                BlocksBackendExecutionStatuses.HANDLER_EXECUTION_ERROR,
            );
        }

        let normalizedResponse: BackendRouteResponse;
        try {
            normalizedResponse = normalizeBackendRouteResponse(
                response,
                BlocksBackendExecutionStatuses.SUCCESS,
            );
        } catch (err) {
            return this._createResponseForExecutionError(
                err,
                BlocksBackendExecutionStatuses.HANDLER_RESPONSE_VALIDATION_ERROR,
            );
        }
        return normalizedResponse;
    }

    async handleEventAsync(event: LambdaEvent): Promise<NormalizedBackendRouteResponse> {
        let logFilePath: string;
        let logStream: fs.WriteStream | null;

        if (this._enableUploadLogsToS3) {
            logFilePath = '/tmp/' + event.blockInvocationId + '-log.txt';
            logStream = fs.createWriteStream(logFilePath, {flags: 'wx'});
            // We override the console methods so they also write to our logStream, so
            // we that can upload the logs to S3.
            this._patchConsoleToCaptureLogs(logStream);
        } else {
            logStream = null;
        }

        const normalizedResponse = await this._callUserCodeForEventAsync(event);

        // Unpatch console before ending the logStream. Otherwise, any subsequent
        // console.logs will crash since they will attempt to write to a closed stream.
        this._unpatchConsole();
        if (logStream !== null) {
            await endStreamAsync(logStream);
        }

        if (this._enableUploadLogsToS3) {
            // Before returning, let's upload the logs to S3, but ignore any
            // errors, since we don't want a log upload failure to affect the
            // response.
            // TODO(jb): figure out a better way to handle log upload errors.
            // Suppress "possibly uninitialized variable" error in Flow.
            invariant(logFilePath, 'logFilePath');
            try {
                await this._uploadLogsToS3Async(logFilePath, event.presignedS3UploadUrl);
            } catch (err) {
                // No-op
            }
            try {
                await unlinkAsync(logFilePath);
            } catch (err) {
                // No-op
            }
        }

        return normalizedResponse;
    }
}

module.exports = BlocksBackendEventHandler;
