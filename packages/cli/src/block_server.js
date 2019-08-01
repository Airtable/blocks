// @flow
/* eslint-disable no-console */
const _ = require('lodash');
const invariant = require('invariant');
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const envify = require('envify/custom');
const babelify = require('babelify');
const watchify = require('watchify');
const stripAnsi = require('strip-ansi');
const ErrorCodes = require('./types/error_codes');
const generateBlockBabelConfig = require('./generate_block_babel_config');
const blockCliConfigSettings = require('./config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('./block_client_artifacts/generate_block_client_wrapper');
const generatePollForLiveReloadCode = require('./block_client_artifacts/generate_poll_for_live_reload');
const ApiClient = require('./api_client');
const fsUtils = require('./fs_utils');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const {getBlockDirPath} = require('./get_block_dir_path');
const getBlocksCliProjectRootPath = require('./helpers/get_blocks_cli_project_root_path');
const clipboardy = require('clipboardy');

import type {$Application, $Request, $Response, Middleware, NextFunction} from 'express';
import type {BlockJson} from './types/block_json_type';
import type {RemoteJson} from './types/remote_json_type';
import type {ErrorCode} from './types/error_codes';

type RequestWithRequestId = $Request & {
    requestId: number,
};

// NOTE(richsinn): These type definitions are for the `resolve` and `reject` functions
//   from the "executor" parameter of the `Promise` constructor. They are NOT the
//   type definitions for the "static" Promise.resolve and Promise.reject functions.
type PromiseResolveFunction = <R>(Promise<R> | R) => void;
type PromiseRejectFunction = (error: any) => void; // eslint-disable-line flowtype/no-weak-types

type ErrorWithCode = Error & {
    code?: ErrorCode,
};

const BundleStatuses = {
    READY: ('ready': 'ready'),
    BUNDLING: ('bundling': 'bundling'),
    ERROR: ('error': 'error'),
};

type BundleStateReady = {|status: typeof BundleStatuses.READY|};
type BundleStateBundling = {|
    status: typeof BundleStatuses.BUNDLING,
    promise: Promise<void>,
|};
type BundleStateError = {|
    status: typeof BundleStatuses.ERROR,
    error: ErrorWithCode,
|};

type BundleStateData = BundleStateReady | BundleStateBundling | BundleStateError;

// Minimal transpilation - the closer the result is to the source, the easier
// debugging is, even with source maps.
const developmentBrowsers: Array<string> = [
    'chrome 61', // Desktop (electron) app.
    'last 2 chrome versions',
    'last 2 firefox versions',
    'last 1 safari version',
    'last 1 edge version',
];

// From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
const allSupportedBrowsers: Array<string> = [
    'firefox >= 29',
    'chrome >= 32',
    'safari >= 9',
    'edge >= 13',
];

const BUNDLE_TIMEOUT_MS = 10000; // 10 seconds
const LONG_POLL_TIMEOUT_MS = 30000; // 30 seconds

class BlockServer {
    _pendingLongPollResolveRejectByRequestId: Map<
        number,
        {
            resolve: PromiseResolveFunction,
            reject: PromiseRejectFunction,
        },
    >;
    _expressApp: $Application;
    _shouldTranspileAll: boolean;
    _nextRequestId: number;
    _apiKey: string;
    _bundleStateDataIfExists: BundleStateData | null;
    _blockJson: BlockJson;
    _remoteJson: RemoteJson;
    _blockDirPath: string;
    _blockServerUrlIfExists: string | null;
    _apiClient: ApiClient;
    _bundler: browserify;

    constructor(args: {
        transpileAll: boolean,
        apiKey: string,
        blockJson: BlockJson,
        remoteJson: RemoteJson,
    }) {
        const {transpileAll = false, apiKey, blockJson, remoteJson} = args;

        this._pendingLongPollResolveRejectByRequestId = new Map();
        this._expressApp = express();
        this._shouldTranspileAll = transpileAll;
        this._nextRequestId = 0;
        this._apiKey = apiKey;
        this._bundleStateDataIfExists = null;
        this._blockJson = blockJson;
        this._remoteJson = remoteJson;
        this._blockDirPath = getBlockDirPath();
        this._blockServerUrlIfExists = null;

        this._setUpExpressRoutes();
        this._setUpRunFrameRoutes();
        this._setUpWrapperCode();
        this._setUpBundler();
    }
    _setUpExpressRoutes(): void {
        // Set Access-Control-Allow-Origin on all requests.
        this._expressApp.use((req: $Request, res: $Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });

        // Set a requestId on each request.
        this._expressApp.use((req: $Request, res: $Response, next: NextFunction) => {
            // Flow typecasting the `req` const to be `RequestWithRequestId`
            // because all request objects after this middleware should
            // have the "requestId" attribute defined to `req`.
            ((req: any): RequestWithRequestId).requestId = this._nextRequestId; // eslint-disable-line flowtype/no-weak-types
            this._nextRequestId++;
            next();
        });

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
        invariant(this._bundleStateDataIfExists, 'this._bundleStateDataIfExists');
        const bundleStateData = this._bundleStateDataIfExists;
        switch (bundleStateData.status) {
            case BundleStatuses.READY:
            case BundleStatuses.ERROR:
                return;

            case BundleStatuses.BUNDLING:
                await bundleStateData.promise;
                break;

            default:
                throw new Error(
                    `Unknown ${(bundleStateData.status: empty)} value for BundleStatuses`,
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
                invariant(this._bundleStateDataIfExists, 'this._bundleStateDataIfExists');
                const bundleStateData = this._bundleStateDataIfExists;
                switch (bundleStateData.status) {
                    case BundleStatuses.READY:
                        next();
                        break;

                    case BundleStatuses.ERROR:
                        res.sendStatus(422);
                        break;

                    case BundleStatuses.BUNDLING:
                        // If we're still bundling, this is a timeout due to our Promise.race setup.
                        res.sendStatus(408);
                        break;

                    default:
                        throw new Error(
                            `Unknown ${(bundleStateData.status: empty)} value for BundleStatuses`,
                        );
                }
            });
        };
    }
    _setUpRunFrameRoutes(): void {
        const blockDirPath = this._blockDirPath;
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
                    root: path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR),
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
            invariant(this._bundleStateDataIfExists, 'this._bundleStateDataIfExists');
            const {status} = this._bundleStateDataIfExists;
            let stack;
            if (this._bundleStateDataIfExists.status === BundleStatuses.ERROR) {
                stack = stripAnsi(this._bundleStateDataIfExists.error.message);
            }

            res.status(200).send({
                status,
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
                        if (err.code === ErrorCodes.BUNDLE_ERROR) {
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
    _setUpWrapperCode() {
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

        // Write the client wrapper file.
        const buildDirPath = path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR);
        if (!fs.existsSync(buildDirPath)) {
            fs.mkdirSync(buildDirPath);
        }
        const clientWrapperFilepath = path.join(
            buildDirPath,
            blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME,
        );
        const isDevelopment = true;
        const clientWrapperCode = generateBlockClientWrapperCode(
            frontendEntryFilePath,
            isDevelopment,
        );
        fs.writeFileSync(clientWrapperFilepath, clientWrapperCode);
    }
    _setUpBundler() {
        const blockDirPath = this._blockDirPath;

        this._bundler = browserify(
            path.join(
                blockDirPath,
                blockCliConfigSettings.BUILD_DIR,
                blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME,
            ),
            {
                cache: {},
                debug: true,
                packageCache: {},
                plugin: [watchify],
                paths: [blockDirPath],
                transform: [
                    babelify.configure(
                        generateBlockBabelConfig({
                            browsers: this._shouldTranspileAll
                                ? allSupportedBrowsers
                                : developmentBrowsers,
                        }),
                    ),
                ],
            },
        );

        this._bundler.on('update', this.triggerBundleAsync.bind(this));
        this._bundler.on('bundle', () => console.log('Updating bundle...'));
    }
    setPublicBaseUrl(publicBaseUrl: string): void {
        // Use process.env to provide the base URL.
        this._bundler.transform(
            envify({
                BLOCK_BASE_URL: publicBaseUrl,
            }),
        );
    }
    async startAsync(port: number): Promise<void> {
        const url = await this.startLocalAsync(port);
        this._blockServerUrlIfExists = url;
        this.setPublicBaseUrl(url);
        await this.triggerBundleAsync();
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
    _bundleAsync(): Promise<BundleStateData> {
        return new Promise((resolve, reject) => {
            const blockDirPath = this._blockDirPath;
            const fsStream = fs.createWriteStream(
                path.join(
                    blockDirPath,
                    blockCliConfigSettings.BUILD_DIR,
                    blockCliConfigSettings.BUNDLE_FILE_NAME,
                ),
            );
            fsStream
                .on('finish', () => {
                    console.log('Bundle updated');
                    resolve({status: BundleStatuses.READY});
                })
                .on('error', err => {
                    resolve({status: BundleStatuses.ERROR, error: err});
                });

            const bundleStream = this._bundler.bundle();
            bundleStream
                .on('error', err => {
                    // Append a custom error code here. The error code will be used
                    // to signal that the HTTP connection to block_server should be
                    // kept alive via long polling.
                    err.code = ErrorCodes.BUNDLE_ERROR;

                    console.error(err.message);
                    if (err.codeFrame) {
                        console.error(err.codeFrame);
                    }
                    bundleStream.unpipe(fsStream);
                    fsStream.destroy(err);
                })
                .pipe(fsStream);
        });
    }
    async triggerBundleAsync(): Promise<void> {
        // 1. Create a new Promise which will be used to determine if the
        //    bundle is ready to be served via the `GET /bundle.js` endpoint.
        let bundleAndUpdateStateResolve;
        const bundleAndUpdateStatePromise = new Promise((resolveInner, rejectInner) => {
            bundleAndUpdateStateResolve = resolveInner;
        });

        // 2. Update the `this._bundleStateDataIfExists` instance variable
        //    to point to the newly created Promise in [1]. If this method is
        //    triggered multiple times in quick succession, the instance variable
        //    will always point to the latest created Promise.
        const localBundleStateData = {
            status: BundleStatuses.BUNDLING,
            promise: bundleAndUpdateStatePromise,
        };
        this._bundleStateDataIfExists = localBundleStateData;

        // 3. Generate the bundle.
        const bundleResult = await this._bundleAsync();

        // 4. To handle the async gap, we only update `this._bundleStateDataIfExists`
        //    if it equals the localBundleStateData. This means that the localBundleStateData
        //    instance is the latest bundle trigger.
        if (this._bundleStateDataIfExists === localBundleStateData) {
            this._bundleStateDataIfExists = bundleResult;
        }

        // 5. Resolve/reject any long poll Promises listening for bundle changes.
        switch (bundleResult.status) {
            case BundleStatuses.READY:
                // Resolve any long poll promises that were listening for bundle changes.
                for (const {
                    resolve: longPollResolve,
                } of this._pendingLongPollResolveRejectByRequestId.values()) {
                    longPollResolve();
                }
                break;

            case BundleStatuses.ERROR:
                // Reject any long poll promises that were listening for bundle changes.
                for (const {
                    reject: longPollReject,
                } of this._pendingLongPollResolveRejectByRequestId.values()) {
                    longPollReject(bundleResult.error);
                }
                break;

            case BundleStatuses.BUNDLING:
                // This is an exceptional case, and should not happen. By
                // awaiting the local bundleResult above, we should be in a
                // non-bundling state.
                throw new Error('Bundling should be finished');

            default:
                throw new Error(`Unknown ${bundleResult.status} value for BundleStatuses`);
        }

        invariant(bundleAndUpdateStateResolve, 'bundleAndUpdateStateResolve');
        bundleAndUpdateStateResolve();
    }
}

module.exports = BlockServer;
