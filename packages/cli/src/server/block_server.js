// @flow
/* eslint-disable no-console */
const _ = require('lodash');
const invariant = require('invariant');
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const envify = require('loose-envify/custom');
const stripAnsi = require('strip-ansi');
const ErrorCodes = require('../types/error_codes');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const generatePollForLiveReloadCode = require('./generate_poll_for_live_reload');
const ApiClient = require('../api_client');
const fsUtils = require('../helpers/fs_utils');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const BlockBuilder = require('../builder/block_builder');
const {BlockBuilderStatuses} = require('../types/block_builder_state_data_types');
const getBlocksCliProjectRootPath = require('../helpers/get_blocks_cli_project_root_path');
const setRequestIdMiddleware = require('./set_request_id_middleware');
const clipboardy = require('clipboardy');
const BlockServerBackendProcessManager = require('./block_server_backend_process_manager');
const {Environments} = require('../types/block_json_type');

import type {$Application, $Request, $Response, Middleware, NextFunction} from 'express';
import type {BlockJson, Environment} from '../types/block_json_type';
import type {RemoteJson} from '../types/remote_json_type';
import type {BlockBuilderStateData} from '../types/block_builder_state_data_types';
import type {PromiseResolveFunction, PromiseRejectFunction} from '../types/promise_types';
import type {RequestId, RequestWithRequestId} from './set_request_id_middleware';

const BUNDLE_TIMEOUT_MS = 10000; // 10 seconds
const LONG_POLL_TIMEOUT_MS = 30000; // 30 seconds

/**
 * This module is ONLY used to serve the `block run` command; it effectively creates an Express server
 * to serve the block code.
 */
class BlockServer {
    _pendingLongPollResolveRejectByRequestId: Map<
        RequestId,
        {
            resolve: PromiseResolveFunction<void>,
            reject: PromiseRejectFunction,
        },
    >;
    _expressApp: $Application;
    _apiKey: string;
    _blockJson: BlockJson;
    _remoteJson: RemoteJson;
    _blockDevCredentialsPath: string | null;
    _blockDirPath: string;
    _blockServerUrlIfExists: string | null;
    _apiClient: ApiClient;
    _blockBuilder: BlockBuilder;
    _environment: Environment;
    _backenedProcessManager: BlockServerBackendProcessManager;
    _shouldBypassSameBaseAndBlockChecks: boolean;

    constructor(args: {
        blockBuilder: BlockBuilder,
        apiKey: string,
        blockDevCredentialsPath: string | null,
        shouldBackendSdkBypassCache: boolean,
        shouldBypassSameBaseAndBlockChecks: boolean,
        backendSdkUrl: string | null,
        environment: Environment,
    }) {
        const {
            blockBuilder,
            apiKey,
            blockDevCredentialsPath,
            backendSdkUrl,
            environment,
            shouldBackendSdkBypassCache,
            shouldBypassSameBaseAndBlockChecks,
        } = args;

        this._pendingLongPollResolveRejectByRequestId = new Map();
        this._expressApp = express();
        this._blockBuilder = blockBuilder;
        this._apiKey = apiKey;
        this._remoteJson = this._blockBuilder.remoteJson;
        this._blockDevCredentialsPath = blockDevCredentialsPath;
        this._blockJson = this._blockBuilder.blockJson;
        this._blockDirPath = this._blockBuilder.blockDirPath;
        this._blockServerUrlIfExists = null;
        this._environment = environment;
        this._shouldBypassSameBaseAndBlockChecks = shouldBypassSameBaseAndBlockChecks;
        this._backenedProcessManager = new BlockServerBackendProcessManager({
            blockJson: this._blockJson,
            remoteJson: this._remoteJson,
            outputUserTranspiledDirPath: this._blockBuilder.outputUserTranspiledDirPath,
            backendSdkUrl: backendSdkUrl || null,
            shouldBackendSdkBypassCache,
            blockDevCredentialsPath: this._blockDevCredentialsPath,
            getApiClient: () => this._apiClient,
        });

        this._setUpExpressRoutes();
        this._setUpRunFrameRoutes();
        this._setUpBackendRoutes();
        this._validateBlockDirectory();
    }
    _setUpExpressRoutes(): void {
        // Set Access-Control-Allow-Origin on all requests.
        this._expressApp.use((req: $Request, res: $Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });

        // Set a requestId on each request.
        this._expressApp.use(setRequestIdMiddleware());
    }
    async _ensureBundleIsReadyAsync(): Promise<void> {
        const {blockBuilderStateData} = this._blockBuilder;
        switch (blockBuilderStateData.status) {
            case BlockBuilderStatuses.READY:
            case BlockBuilderStatuses.ERROR:
                return;

            case BlockBuilderStatuses.BUILDING:
                await blockBuilderStateData.promise;
                break;

            case BlockBuilderStatuses.START:
                // This means the initial bundle has not even kicked off yet. In this
                // case we just recurse.
                break;

            default:
                throw new Error(
                    `Unknown ${(blockBuilderStateData.status: empty)} value for BuilderStatuses`,
                );
        }

        // During the async gap, another bundling process may have kicked off, so
        // we recurse here to check. If the bundle is ready, the recursive call
        // will return immediately.
        await this._ensureBundleIsReadyAsync();
    }
    _ensureBundleIsReadyMiddleware(): Middleware {
        return (req: $Request, res: $Response, next: NextFunction) => {
            Promise.race([
                this._ensureBundleIsReadyAsync(),
                new Promise((resolve, reject) => {
                    setTimeout(() => resolve(), BUNDLE_TIMEOUT_MS);
                }),
            ]).then(() => {
                const {blockBuilderStateData} = this._blockBuilder;
                switch (blockBuilderStateData.status) {
                    case BlockBuilderStatuses.READY:
                        next();
                        break;

                    case BlockBuilderStatuses.ERROR:
                        res.sendStatus(422);
                        break;

                    case BlockBuilderStatuses.START:
                    case BlockBuilderStatuses.BUILDING:
                        // If we're still bundling, this is a timeout due to our Promise.race setup.
                        res.sendStatus(408);
                        break;

                    default:
                        throw new Error(
                            `Unknown ${(blockBuilderStateData.status: empty)} value for BuilderStatuses`,
                        );
                }
            });
        };
    }
    _setUpRunFrameRoutes(): void {
        const runFrameRoutes = express.Router();

        // Use body parser for JSON payloads.
        runFrameRoutes.use(
            bodyParser.json({limit: blockCliConfigSettings.BLOCK_REQUEST_BODY_LIMIT}),
        );

        // Serve the bundle file if ready.
        runFrameRoutes.get(
            '/bundle.js',
            this._ensureBundleIsReadyMiddleware(),
            (req: $Request, res: $Response) => {
                res.sendFile(blockCliConfigSettings.BUNDLE_FILE_NAME, {
                    root: this._blockBuilder.outputBuildArtifactsDirPath,
                });
            },
        );

        /**
         * This endpoint is used by the block frame for two reasons:
         * 1. For connection error checks to make sure the local block server is running
         * 2. To fetch and display any relevant bundle errors. This information is served
         *    by a separate endpoint instead of putting it in the `GET /bundle.js` response
         *    because the block frame loads the `GET /bundle.js` info via a <script> tag,
         *    which doesn't allow us to peek into the HTTP response of the script load request.
         */
        runFrameRoutes.get('/bundleStatus', (req: $Request, res: $Response) => {
            const {blockBuilderStateData} = this._blockBuilder;
            let stack;
            if (blockBuilderStateData.status === BlockBuilderStatuses.ERROR) {
                const blockBuilderError = BlockBuilder.getBlockBuilderError(blockBuilderStateData);
                stack = stripAnsi(blockBuilderError.message);
            }

            res.status(200).send({
                status: blockBuilderStateData.status,
                ...(stack ? {error: {stack}} : {}),
            });
        });

        // Serve the polling script for live reload
        runFrameRoutes.get('/poll_script.js', (req: $Request, res: $Response) => {
            res.set('Content-Type', 'text/javascript');
            invariant(this._blockServerUrlIfExists, 'this._blockServerUrlIfExists');
            res.send(generatePollForLiveReloadCode(this._blockServerUrlIfExists));
        });

        runFrameRoutes.options(
            '/registerBlockInstallationMetadata',
            (req: $Request, res: $Response) => {
                res.set({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers': 'Content-Type',
                })
                    .status(200)
                    .end();
            },
        );

        runFrameRoutes.post(
            '/registerBlockInstallationMetadata',
            (req: $Request, res: $Response) => {
                if (
                    !req.body ||
                    !req.body.applicationId ||
                    !req.body.blockId ||
                    !req.body.blockInstallationId
                ) {
                    res.status(400).send({
                        error: 'BAD_REQUEST',
                        message: 'Invalid request body',
                    });
                } else if (
                    !this._shouldBypassSameBaseAndBlockChecks &&
                    req.body.applicationId !== this._remoteJson.baseId
                ) {
                    res.status(403).send({
                        error: 'FORBIDDEN',
                        message:
                            'You can only run your development block in the original base where it was created.',
                    });
                } else if (
                    !this._shouldBypassSameBaseAndBlockChecks &&
                    req.body.blockId !== this._remoteJson.blockId
                ) {
                    res.status(403).send({
                        error: 'FORBIDDEN',
                        message:
                            'You can only run your development block in the original block where it was created.',
                    });
                } else {
                    if (
                        !this._apiClient ||
                        this._apiClient.blockInstallationId !== req.body.blockInstallationId
                    ) {
                        console.log('Switched to a new block installation.');
                    }
                    invariant(
                        typeof req.body.applicationId === 'string',
                        'expects req.body.applicationId to be a string',
                    );
                    invariant(
                        typeof req.body.blockInstallationId === 'string',
                        'req.body.blockInstallationId to be a string',
                    );
                    this._apiClient = new ApiClient({
                        apiBaseUrl: this._remoteJson.server,
                        applicationId: req.body.applicationId,
                        blockInstallationId: req.body.blockInstallationId,
                        apiKey: this._apiKey,
                    });
                    res.status(200).send({userAgent: blockCliConfigSettings.USER_AGENT});
                }
            },
        );

        /**
         * This endpoint is used by the block frame to check if the
         * local block server is responding or not.
         */
        runFrameRoutes.head('/ping', (req: $Request, res: $Response) => {
            res.sendStatus(200);
        });

        runFrameRoutes.get(
            '/poll',
            (req: RequestWithRequestId, res: $Response, next: NextFunction) => {
                // This promise will resolve whenever the bundle we're serving changes.
                const bundleChangePromise = new Promise((resolve, reject) => {
                    this._pendingLongPollResolveRejectByRequestId.set(req.requestId, {
                        resolve,
                        reject,
                    });
                });
                // After the LONG_POLL_TIMEOUT_MS, send a request timeout to tell the client to retry.
                const timeoutPromise = new Promise((resolve, reject) =>
                    setTimeout(() => resolve('timeout'), LONG_POLL_TIMEOUT_MS),
                );

                Promise.race([bundleChangePromise, timeoutPromise])
                    .then(result => {
                        const statusCode = result === 'timeout' ? 304 : 200;
                        res.sendStatus(statusCode);
                    })
                    .catch(err => {
                        if (
                            err.code === ErrorCodes.BUNDLE_ERROR ||
                            err.code === ErrorCodes.BABEL_PARSE_ERROR
                        ) {
                            // Send 200 to reload the window on bundle errors.
                            // The reloading mechanism will allow the block frame to
                            // retrieve the error information when it tries to re-fetch
                            // the bundle.js file.
                            res.sendStatus(200);
                        } else {
                            next(err);
                        }
                    })
                    .finally(() => {
                        this._pendingLongPollResolveRejectByRequestId.delete(req.requestId);
                    });
            },
        );

        runFrameRoutes.get('/ping.gif', (req: $Request, res: $Response) => {
            // This is used by the web client to detect if blocks-cli is running,
            // and if HTTPS is being blocked. An image can get around CORS, since
            // we can't make an XHR request to HTTP.
            const img = Buffer.from(
                'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                'base64',
            );
            res.writeHead(200, {
                'Content-Type': 'image/gif',
                'Content-Length': `${img.length}`,
            });
            res.end(img);
        });

        this._expressApp.use('/__runFrame', runFrameRoutes);
    }
    _setUpBackendRoutes() {
        const textBodyParser = bodyParser.text({
            type: () => true,
            limit: blockCliConfigSettings.BLOCK_REQUEST_BODY_LIMIT,
        });
        const isTesting = this._environment === Environments.TESTING;
        const indexMarkup = isTesting
            ? `
            <!doctype html>
            <head>
                <script src="__runFrame/bundle.js"></script>
            </head>
            <body>
                <script>${blockCliConfigSettings.GLOBAL_RUN_BLOCK_FUNCTION_NAME}();</script>
            </body>
            `
            : `
            <!doctype html>
            <body>
                <style>
                body {
                    font-family: system-ui;
                    padding: 24px;
                    font-size: 18px;
                }
                </style>
                <div style="font-size: 36px; margin: 0">🎉</div>
                <p>Your block is running!</p>
                <p>Go to your <a href="https://airtable.com/${this._remoteJson.baseId}">Airtable base</a> to build your block.</p>
            </body>
            `;
        // TODO(richsinn): Add URL to instructions or docs?
        this._expressApp.get(
            '/',
            textBodyParser,
            this._backenedProcessManager.tryForwardRequestToBackendProcessMiddleware(),
            // In testing environments, delay responses until the JavaScript
            // bundle is ready. This allows consumers to use the availability
            // of the index page as a signal to initiate automated tests.
            ...(isTesting ? [this._ensureBundleIsReadyMiddleware()] : []),
            (req: $Request, res: $Response) => res.send(indexMarkup),
        );
        this._expressApp.all(
            '*',
            textBodyParser,
            this._backenedProcessManager.tryForwardRequestToBackendProcessMiddleware(),
        );
    }
    _validateBlockDirectory() {
        const entryAttr =
            this._environment === Environments.TESTING ? 'frontendTestingEntry' : 'frontendEntry';
        const blockDirPath = this._blockDirPath;

        // Check if the node_modules directory exists.
        const nodeModulesDirPath = path.join(blockDirPath, 'node_modules');
        const nodeModulesDirExists = fs.existsSync(nodeModulesDirPath);
        if (!nodeModulesDirExists) {
            console.warn(
                `node_modules not detected. If you have dependencies, run 'npm install' in ${blockDirPath} to install packages before running`,
            );
            // Don't exit since there are some legitimate cases where blocks don't need node_modules (e.g. dependencies
            // installed in a parent dir)
        }
        // Get the block entry point filepath.
        if (!(entryAttr in this._blockJson)) {
            console.log(
                `The '${entryAttr}' property is required by ${this._environment} environments, but it is not present in ${blockCliConfigSettings.BLOCK_FILE_NAME}`,
            );
        }
        const entryFileName = this._blockJson[entryAttr];
        invariant(
            entryFileName,
            `The ${entryAttr} attribute must be specified for ${this._environment} environments`,
        );
        const frontendEntryFilePath = path.join(blockDirPath, entryFileName);

        // Check if frontendEntryModule exists.
        const frontendEntryFileExists = fs.existsSync(frontendEntryFilePath);
        if (!frontendEntryFileExists) {
            console.log(
                `The '${entryAttr}' file at ${frontendEntryFilePath} does not exist. Please check your '${entryAttr}' attribute in ${blockCliConfigSettings.BLOCK_FILE_NAME}`,
            );
            process.exit(1);
        }
    }
    setEnvironmentVariablesForBundle(publicBaseUrl: string): void {
        this._blockBuilder.browserify.transform(
            // 'global' is required in order to process node_modules files
            {global: true},
            envify({
                // Use process.env to provide the base URL in client wrapper code.
                BLOCK_BASE_URL: publicBaseUrl,
            }),
        );
    }
    async startAsync(port: number, opts: {useHttp: boolean}): Promise<void> {
        const url = await this.startLocalAsync(port, opts);
        this._blockServerUrlIfExists = url;
        this.setEnvironmentVariablesForBundle(url);

        // Listen for events from the BlockBuilder to resolve the polling
        // Promises and restart backend process.
        this._blockBuilder.blockBuilderJobQueue.on('buildComplete', () => {
            this._resolveLongPollPromises(this._blockBuilder.blockBuilderStateData);
            // TODO(Chuan): The backend process only depends on transpiled code,
            // not on the frontend bundle. Consider triggering a restart on
            // transpile complete instead.
            this._backenedProcessManager.scheduleRestartAsync();
        });
        this._blockBuilder.blockBuilderJobQueue.on('error', err => {
            throw err;
        });
        await this._blockBuilder.buildAndWatchAsync(this._environment);
        await this._backenedProcessManager.waitForRestartsAsync();

        console.log(chalk.bold(`\n✅ Your block is running locally at ${url} `));
        try {
            await clipboardy.write(url);
            console.log(`${url} has been copied to your clipboard`);
        } catch (err) {
            // This can fail, especially on Linux. If it does, we don't really care.
        }
    }
    async startLocalAsync(port: number, opts: {useHttp: boolean}): Promise<string> {
        // Read certs
        const [key, cert] = await Promise.all([
            fsUtils.readFileAsync(
                path.join(getBlocksCliProjectRootPath(), 'keys', 'server.key'),
                'utf8',
            ),
            fsUtils.readFileAsync(
                path.join(getBlocksCliProjectRootPath(), 'keys', 'server.crt'),
                'utf8',
            ),
        ]);

        // We use either an HTTPS (default) or HTTP server for local block development,
        // depending on the presence of the --http arg.

        // When developing against HTTPS, we also need to spin up a secondary http server at
        // (PORT + 1). This is exclusively used for differentiating between connection
        // failures caused by an untrusted cert vs. server not running at all. We don't need
        // to spin this up if the user has opted into HTTP.
        let mainServer;
        let secondaryServer;
        if (opts.useHttp) {
            mainServer = http.createServer(this._expressApp);
        } else {
            // flow-disable-next-line because flow confuses Socket types for createServer
            mainServer = https.createServer({cert, key}, this._expressApp);
            secondaryServer = http.createServer(this._expressApp);
        }
        const stopServer = () => {
            if (mainServer.listening) {
                mainServer.close();
            }
            if (secondaryServer && secondaryServer.listening) {
                secondaryServer.close();
            }
        };

        await new Promise((resolve, reject) => {
            mainServer
                .listen(port)
                .on('error', err => {
                    stopServer();
                    reject(err);
                })
                .on('listening', resolve);
        });
        await new Promise((resolve, reject) => {
            if (secondaryServer) {
                secondaryServer
                    .listen(port + 1)
                    .on('error', err => {
                        stopServer();
                        reject(err);
                    })
                    .on('listening', resolve);
            } else {
                resolve();
            }
        });

        return `http${opts.useHttp ? '' : 's'}://localhost:${port}`;
    }
    _resolveLongPollPromises(blockBuilderStateData: BlockBuilderStateData): void {
        switch (blockBuilderStateData.status) {
            case BlockBuilderStatuses.READY:
                // Resolve any long poll promises that were listening for bundle changes.
                for (const {
                    resolve: longPollResolve,
                } of this._pendingLongPollResolveRejectByRequestId.values()) {
                    longPollResolve();
                }
                break;

            case BlockBuilderStatuses.ERROR:
                // Reject any long poll promises that were listening for bundle changes.
                for (const {
                    reject: longPollReject,
                } of this._pendingLongPollResolveRejectByRequestId.values()) {
                    const blockBuilderError = BlockBuilder.getBlockBuilderError(
                        blockBuilderStateData,
                    );
                    longPollReject(blockBuilderError);
                }
                break;

            case BlockBuilderStatuses.START:
            case BlockBuilderStatuses.BUILDING:
                // This is an exceptional case. We should only be resolving the long poll promise
                // on READY or ERROR states.
                throw new Error('Bundling should be finished');

            default:
                throw new Error(
                    `Unknown ${(blockBuilderStateData.status: empty)} value for BuilderStatuses`,
                );
        }
    }
}

module.exports = BlockServer;
