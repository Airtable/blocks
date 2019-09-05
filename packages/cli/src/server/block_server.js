// @flow
/* eslint-disable no-console */
const _ = require('lodash');
const invariant = require('invariant');
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const envify = require('envify/custom');
const stripAnsi = require('strip-ansi');
const ErrorCodes = require('../types/error_codes');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const generatePollForLiveReloadCode = require('../generate_poll_for_live_reload');
const ApiClient = require('../api_client');
const fsUtils = require('../fs_utils');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const BlockBuilder = require('../builder/block_builder');
const {BlockBuilderStatuses} = require('../types/block_builder_state_data_types');
const getBlocksCliProjectRootPath = require('../helpers/get_blocks_cli_project_root_path');
const setRequestIdMiddleware = require('./set_request_id_middleware');
const clipboardy = require('clipboardy');

import type {$Application, $Request, $Response, Middleware, NextFunction} from 'express';
import type {BlockJson} from '../types/block_json_type';
import type {RemoteJson} from '../types/remote_json_type';
import type {BlockBuilderStateData} from '../types/block_builder_state_data_types';
import type {PromiseResolveFunction, PromiseRejectFunction} from '../types/promise_types';
import type {RequestId, RequestWithRequestId} from './set_request_id_middleware';

const BUNDLE_TIMEOUT_MS = 10000; // 10 seconds
const LONG_POLL_TIMEOUT_MS = 30000; // 30 seconds

class BlockServer {
    _pendingLongPollResolveRejectByRequestId: Map<
        RequestId,
        {
            resolve: PromiseResolveFunction,
            reject: PromiseRejectFunction,
        },
    >;
    _expressApp: $Application;
    _apiKey: string;
    _blockJson: BlockJson;
    _remoteJson: RemoteJson;
    _blockDirPath: string;
    _blockServerUrlIfExists: string | null;
    _apiClient: ApiClient;
    _blockBuilder: BlockBuilder;

    constructor(args: {blockBuilder: BlockBuilder, apiKey: string, remoteJson: RemoteJson}) {
        const {blockBuilder, apiKey, remoteJson} = args;

        this._pendingLongPollResolveRejectByRequestId = new Map();
        this._expressApp = express();
        this._blockBuilder = blockBuilder;
        this._apiKey = apiKey;
        this._remoteJson = remoteJson;
        this._blockJson = this._blockBuilder.blockJson;
        this._blockDirPath = this._blockBuilder.blockDirPath;
        this._blockServerUrlIfExists = null;

        this._setUpExpressRoutes();
        this._setUpRunFrameRoutes();
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

        // TODO(richsinn): Add URL to instructions or docs?
        // TODO(richsinn): We'll need to figure out how to avoid conflicts when
        //   implementing backend blocks routes
        this._expressApp.get('/', (req: $Request, res: $Response) => {
            res.send(
                `
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
                `,
            );
        });
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
                } else if (req.body.applicationId !== this._remoteJson.baseId) {
                    res.status(403).send({
                        error: 'FORBIDDEN',
                        message:
                            'You can only run your development block in the original base where it was created.',
                    });
                } else if (req.body.blockId !== this._remoteJson.blockId) {
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
                    res.sendStatus(200);
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
    _validateBlockDirectory() {
        const blockDirPath = this._blockDirPath;

        // Check if react and react-dom are listed in package.json.
        const packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'), 'utf8');
        const dependencies = JSON.parse(packageJson).dependencies;
        if (!dependencies.hasOwnProperty('react') || !dependencies.hasOwnProperty('react-dom')) {
            console.log(
                'Please ensure that react and react-dom packages are installed and listed in package.json',
            );
            process.exit(1);
        }

        // Check if the node_modules directory exists.
        const nodeModulesDirPath = path.join(blockDirPath, 'node_modules');
        const nodeModulesDirExists = fs.existsSync(nodeModulesDirPath);
        if (!nodeModulesDirExists) {
            console.log(`Must run npm in ${blockDirPath} first to install modules`);
            process.exit(1);
        }
        // Get the block entry point filepath.
        const frontendEntryFilePath = path.join(blockDirPath, this._blockJson.frontendEntry);

        // Check if frontendEntryModule exists.
        const frontendEntryFileExists = fs.existsSync(frontendEntryFilePath);
        if (!frontendEntryFileExists) {
            console.log(
                `The 'frontendEntry' file at ${frontendEntryFilePath} does not exist. Please check your 'frontendEntry' attribute in ${blockCliConfigSettings.BLOCK_FILE_NAME}`,
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
    async startAsync(port: number): Promise<void> {
        const url = await this.startLocalAsync(port);
        this._blockServerUrlIfExists = url;
        this.setEnvironmentVariablesForBundle(url);

        // Listen for events from the BlockBuilder to resolve the polling Promises.
        this._blockBuilder.blockBuilderJobQueue.on('buildComplete', () => {
            this._resolveLongPollPromises(this._blockBuilder.blockBuilderStateData);
        });
        this._blockBuilder.blockBuilderJobQueue.on('error', err => {
            throw err;
        });
        await this._blockBuilder.buildAndWatchAsync();

        console.log(chalk.bold(`\n✅ Your block is running locally at ${url} `));
        try {
            await clipboardy.write(url);
            console.log(`${url} has been copied to your clipboard`);
        } catch (err) {
            // This can fail, especially on Linux. If it does, we don't really care.
        }
    }
    async startLocalAsync(port: number): Promise<string> {
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

        // We create both an HTTP and an HTTPS server. The web client will try
        // loading /__runFrame/ping.gif on both http and https.
        // This lets it detect if localhost certs are blocked so
        // we can show a helpful error message.
        // TODO: maybe don't expose other routes on http?
        // flow-disable-next-line because flow confuses Socket types for createServer
        const httpsServer = https.createServer({cert, key}, this._expressApp);
        const httpServer = http.createServer(this._expressApp);
        const stopServers = () => {
            if (httpsServer.listening) {
                httpsServer.close();
            }
            if (httpServer.listening) {
                httpServer.close();
            }
        };

        await new Promise((resolve, reject) => {
            httpServer
                .listen(port + 1)
                .on('error', err => {
                    stopServers();
                    reject(err);
                })
                .on('listening', resolve);
        });

        await new Promise((resolve, reject) => {
            httpsServer
                .listen(port)
                .on('error', err => {
                    stopServers();
                    reject(err);
                })
                .on('listening', resolve);
        });

        return `https://localhost:${port}`;
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
