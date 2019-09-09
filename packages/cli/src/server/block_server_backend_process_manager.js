// @flow
/* eslint-disable no-console */

const childProcess = require('child_process');
const delay = require('delay');
const invariant = require('invariant');
const path = require('path');
const semver = require('semver');
const stripAnsi = require('strip-ansi');
const ApiClient = require('../api_client');
const childProcessHelpers = require('../helpers/child_process_helpers');
const hasBackendRoutes = require('../helpers/has_backend_routes');
const {BackendProcessResponseTypes} = require('../types/block_server_backend_process_types');
const {
    getBlocksBackendExecutionStatus,
    BlocksBackendExecutionStatuses,
} = require('../../blocks_backend_wrapper/blocks_backend_execution_status');

import type {Middleware, $Response, NextFunction} from 'express';
import type {BlockJson} from '../types/block_json_type';
import type {
    BackendProcessOptions,
    BackendProcessRequest,
    BackendProcessResponse,
    BackendProcessEventResponse,
} from '../types/block_server_backend_process_types';
import type {PromiseResolveFunction, PromiseRejectFunction} from '../types/promise_types';
import type {RequestId, RequestWithRequestId} from './set_request_id_middleware';

const LAMBDA_SIMULATION_DELAY_MS = 300;

class BlockServerBackendProcessManager {
    _blockJson: BlockJson;
    _outputUserTranspiledDirPath: string;
    _backendSdkBaseUrlIfExists: string | null;
    _getApiClient: () => ApiClient;
    _backendProcess: childProcess.ChildProcess | null;
    _isReady: boolean;
    _resolveStartFn: PromiseResolveFunction<void> | null;
    _rejectStartFn: PromiseRejectFunction | null;
    _resolveStopFn: PromiseResolveFunction<void> | null;
    _resolvePendingRequestFns: Map<RequestId, PromiseResolveFunction<BackendProcessEventResponse>>;
    _inProgressRestartPromise: Promise<void> | null;
    _scheduledRestartPromise: Promise<void> | null;

    constructor(args: {
        blockJson: BlockJson,
        outputUserTranspiledDirPath: string,
        backendSdkBaseUrl: string | null,
        getApiClient: () => ApiClient,
    }) {
        this._blockJson = args.blockJson;
        this._outputUserTranspiledDirPath = args.outputUserTranspiledDirPath;
        this._backendSdkBaseUrlIfExists = args.backendSdkBaseUrl;
        this._getApiClient = args.getApiClient;
        this._backendProcess = null;
        this._isReady = false;
        this._resolveStartFn = null;
        this._rejectStartFn = null;
        this._resolveStopFn = null;
        this._resolvePendingRequestFns = new Map();
        this._inProgressRestartPromise = null;
        this._scheduledRestartPromise = null;
    }

    async _startAsync(): Promise<void> {
        if (!hasBackendRoutes(this._blockJson) || this._backendProcess) {
            return;
        }
        const backendProcessOptions: BackendProcessOptions = {
            blockJson: this._blockJson,
            outputUserTranspiledDirPath: this._outputUserTranspiledDirPath,
            backendSdkBaseUrl: this._backendSdkBaseUrlIfExists,
        };
        this._backendProcess = childProcessHelpers.fork(
            path.join(__dirname, 'block_server_backend_process'),
            [JSON.stringify(backendProcessOptions)],
            {
                env: {
                    FORCE_COLOR: '1',
                    NODE_ENV: 'development',
                },
                // HACK: production blocks currently run node 8.10. node 8.14
                // changed the default max http header size from 80kb to 8kb, so
                // if the user's local node version is >= 8.14, set the max http
                // header size back to 80kb. Ideally blocks-cli should actually
                // use the same version of node that the block runs in
                // production.
                execArgv: semver.gte(process.versions.node, '8.14.0')
                    ? ['--max-http-header-size=80000']
                    : [],
                prefix: 'backend',
            },
        );
        this._backendProcess.on('message', this._onBackendProcessResponse.bind(this));
        invariant(this._backendProcess, 'this._backendProcess');
        this._backendProcess.on('error', this._onBackendProcessError.bind(this));
        invariant(this._backendProcess, 'this._backendProcess');
        this._backendProcess.on('exit', this._onBackendProcessExit.bind(this));
        // - To be resolved by _onBackendProcessResponse in response to
        //   'message' event from backend process.
        // - To be rejected by
        //    - _onBackendProcessError in response to 'error' event from backend process, or
        //    - _onBackendProcessExit in response to 'exit' event from backend process.
        const startPromise = new Promise<void>((resolve, reject) => {
            this._resolveStartFn = resolve;
            this._rejectStartFn = reject;
        });
        try {
            await startPromise;
            console.log('Backend ready');
            this._isReady = true;
        } catch (err) {
            console.log('Could not start backend');
            this._backendProcess = null;
        }
        this._resolveStartFn = null;
        this._rejectStartFn = null;
    }

    async _stopAsync() {
        if (!hasBackendRoutes(this._blockJson) || !this._backendProcess) {
            return;
        }
        this._isReady = false;
        this._backendProcess.disconnect();
        // To be resolved by _onBackendProcessExit in response to 'exit' event
        // from backend process.
        await new Promise(resolve => {
            this._resolveStopFn = resolve;
        });
        this._resolveStopFn = null;
        this._backendProcess = null;
    }

    async _restartAsync() {
        console.log('Updating backend...');
        try {
            await this._stopAsync();
            await this._startAsync();
        } catch (err) {
            // No-op
        }
        this._inProgressRestartPromise = null;
    }

    /** Schedule the backend process to be restarted.
     *
     * If the block has no backend routes, this method is a no-op.
     *
     * If no backend process is currently running, this method will start one.
     *
     * If a backend process restart is already in progress, this method will
     * schedule an additional restart after the current restart completes.
     * However, if this method is invoked multiple times while a restart is in
     * progress, only one restart will be attempted after the current restart is
     * completed.
     */
    scheduleRestartAsync(): Promise<void> {
        if (!this._inProgressRestartPromise && !this._scheduledRestartPromise) {
            // No restart in progress or scheduled, so we can restart immediately.
            this._inProgressRestartPromise = this._restartAsync();
            return this._inProgressRestartPromise;
        } else if (this._inProgressRestartPromise && !this._scheduledRestartPromise) {
            // A restart is already in progress, and we haven't scheduled
            // another restart yet. So we schedule another restart after the
            // current restart finishes.
            this._scheduledRestartPromise = this._inProgressRestartPromise.then(() => {
                if (!this._scheduledRestartPromise) {
                    // This should not be possible.
                    throw new Error('Unexpected backend process state');
                }
                this._scheduledRestartPromise = null;
                this._inProgressRestartPromise = this._restartAsync();
                return this._inProgressRestartPromise;
            });
            return this._scheduledRestartPromise;
        } else if (this._inProgressRestartPromise && this._scheduledRestartPromise) {
            // A restart is already in progress, and we have already scheduled
            // another restart after the current restart finishes. So nothing to
            // do here.
            return this._scheduledRestartPromise;
        } else {
            // No restart is in progress, but a restart has been scheduled. This
            // should not be possible.
            throw new Error('Unexpected backend process state');
        }
    }

    waitForRestartsAsync(): Promise<void> {
        return this._scheduledRestartPromise || this._inProgressRestartPromise || Promise.resolve();
    }

    /** An Express middleware that tries to forward requests to the block's
     * backend routes. It either sends back the response from the matched
     * backend handler, or falls through to the next handler if no backend
     * handler matched.
     */
    tryForwardRequestToBackendProcessMiddleware(): Middleware {
        return async (req: RequestWithRequestId, res: $Response, next: NextFunction) => {
            // If this block doesn't have backend routes, proceed to next callback.
            if (!hasBackendRoutes(this._blockJson)) {
                next();
                return;
            }
            // If the backend process is restarting (or just starting), return a 503.
            // TODO(Chuan): Wait for backend ready?
            if (!this._isReady) {
                res.status(503).send({
                    error: 'SERVICE_UNAVAILABLE',
                    message: 'Deploy in progress. Try again.',
                });
                return;
            }
            // Forward to backend process.
            let response: BackendProcessEventResponse;
            try {
                response = await this._forwardRequestToBackendProcessAsync(req);
            } catch (err) {
                console.error('Failed to process backend request: ', err);
                res.status(500).send({
                    error: 'SERVER_ERROR',
                    message: stripAnsi(err.message),
                });
                return;
            }
            const executionStatus = getBlocksBackendExecutionStatus(response.headers);
            // If backend process doesn't recognize the request path, proceed to next callback.
            if (executionStatus === BlocksBackendExecutionStatuses.NO_MATCHING_ROUTES) {
                next();
                return;
            }
            // Send back backend process response.
            // TODO(Chuan): Currently the normalization function
            // (normalizeUserResponse) only supports base64-encoded bodies. We
            // should reconsider the backend response format and adapt it
            // accordingly.
            // const {statusCode, headers, body} = normalizeUserResponse(response);
            const {statusCode, headers, body} = response;
            res.writeHead(statusCode || 200, (headers: any)); // eslint-disable-line flowtype/no-weak-types
            res.end(body);
        };
    }

    async _forwardRequestToBackendProcessAsync(
        req: RequestWithRequestId,
    ): Promise<BackendProcessEventResponse> {
        // Set up promise to be resolved by _onBackendProcessResponse in response
        // to corresponding 'message' event from backend process.
        const {requestId} = req;
        if (this._resolvePendingRequestFns.has(requestId)) {
            // This should not be possible unless there's a programming error.
            throw new Error(`Duplicate request ID ${requestId}`);
        }
        let resolveFn;
        const responsePromise = new Promise<BackendProcessEventResponse>(resolve => {
            resolveFn = resolve;
        });
        invariant(resolveFn, 'resolveFn');
        this._resolvePendingRequestFns.set(requestId, resolveFn);

        // Fetch an access policy for this invocation, so the backend code can
        // make requests to Airtable.
        const apiClient = this._getApiClient();
        if (!apiClient || !apiClient.applicationId || !apiClient.blockInstallationId) {
            throw new Error(
                'Did not receive block information from Airtable. Cannot fulfill backend request',
            );
        }
        const apiAccessPolicyString = await apiClient.fetchAccessPolicyAsync();

        // Send request to backend process.
        const event: BackendProcessRequest = {
            requestId: requestId.toString(),
            method: req.method,
            // eslint-disable-next-line flowtype/no-weak-types
            query: (req.query: any),
            path: req.path,
            body: req.body,
            headers: req.headers,
            presignedS3UploadUrl: '',
            logKey: '',
            blockInvocationId: '',
            apiAccessPolicyString: apiAccessPolicyString,
            applicationId: apiClient.applicationId,
            // eslint-disable-next-line flowtype/no-weak-types
            blockInstallationId: (apiClient.blockInstallationId: any),
            kvValuesByKey: undefined, // SDK will fetch the kvValuesByKey.
            apiBaseUrl: apiClient.apiBaseUrl,
        };
        // Lambda invocation is approximately 300ms, so we want the cli to be
        // approximately as slow in order to simulate realistic UX.
        await delay(LAMBDA_SIMULATION_DELAY_MS);
        invariant(this._backendProcess, 'this._backendProcess');
        this._backendProcess.send(event);

        // Wait for response. To be resolved by _onBackendProcessResponse in
        // response to corresponding 'message' event from backend process.
        const response = await responsePromise;
        this._resolvePendingRequestFns.delete(requestId);
        return response;
    }

    _onBackendProcessResponse(response: BackendProcessResponse) {
        // Ignore messages from backend process if the corresponding process has
        // already been shut down.
        if (!this._backendProcess || this._backendProcess.pid !== response.pid) {
            return;
        }

        switch (response.messageType) {
            case BackendProcessResponseTypes.READY:
                if (this._resolveStartFn) {
                    this._resolveStartFn();
                }
                break;
            case BackendProcessResponseTypes.EVENT_RESPONSE: {
                const resolveFn = this._resolvePendingRequestFns.get(
                    parseInt(response.requestId, 10),
                );
                if (!resolveFn) {
                    throw new Error(
                        `Received response to unknown request ID ${response.requestId}`,
                    );
                }
                resolveFn(response);
                break;
            }
            default:
                throw new Error(
                    `Unexpected response from backend process: ${response.messageType}`,
                );
        }
    }

    _onBackendProcessError(error: Error) {
        // Swallow any errors and log in console. This will allow for recovery on
        // next bundle update.
        console.error('Backend exception: ', error);
        if (this._rejectStartFn) {
            this._rejectStartFn(error);
        }
    }

    _onBackendProcessExit() {
        if (this._resolveStopFn) {
            this._resolveStopFn();
        } else if (this._rejectStartFn) {
            this._rejectStartFn();
        } else {
            console.error('Backend process exited unexpectedly!');
            this._isReady = false;
            this._backendProcess = null;
            this.scheduleRestartAsync();
        }
    }
}

module.exports = BlockServerBackendProcessManager;
