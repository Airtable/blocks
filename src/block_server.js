// @flow
/* eslint-disable no-console */
const _ = require('lodash');
const invariant = require('invariant');
const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const envify = require('envify/custom');
const babelify = require('babelify');
const watchify = require('watchify');
const AnsiToHtmlConverter = require('ansi-to-html');
const ErrorCodes = require('./types/error_codes');
const generateBlockBabelConfig = require('./generate_block_babel_config');
const blockCliConfigSettings = require('./config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('./generate_block_client_wrapper');
const APIClient = require('./api_client');
const fsUtils = require('./fs_utils');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const getBlockDirPath = require('./get_block_dir_path');
const getBlocksCliProjectRootPath = require('./helpers/get_blocks_cli_project_root_path');
const clipboardy = require('clipboardy');

import type {
    $Application,
    $Request,
    $Response,
    Middleware,
    NextFunction,
} from 'express';
import type {BlockJsonNew} from './types/block_json_new_type';
import type {RemoteJson} from './types/remote_json_type';

type RequestWithRequestId = $Request & {
    requestId: number,
};

// NOTE(richsinn): These type definitions are for the `resolve` and `reject` functions
//   from the "executor" parameter of the `Promise` constructor. They are NOT the
//   type definitions for the "static" Promise.resolve and Promise.reject functions.
type PromiseResolveFunction = <R>(Promise<R> | R) => void;
type PromiseRejectFunction = (error: any) => void; // eslint-disable-line flowtype/no-weak-types

// Minimal transpilation - the closer the result is to the source, the easier
// debugging is, even with source maps.
const developmentBrowsers = [
    'chrome 61', // Desktop (electron) app.
    'last 2 chrome versions',
    'last 2 firefox versions',
    'last 1 safari version',
    'last 1 edge version',
];

// From https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable.
const allSupportedBrowsers = ['firefox >= 29', 'chrome >= 32', 'safari >= 9', 'edge >= 13'];

const BUNDLE_TIMEOUT_MS = 10000; // 10 seconds
const LONG_POLL_TIMEOUT_MS = 30000; // 30 seconds

class BlockServer {
    _pendingLongPollResolveRejectByRequestId: Map<number, {
        resolve: PromiseResolveFunction,
        reject: PromiseRejectFunction,
    }>;
    _expressApp: $Application;
    _shouldTranspileAll: boolean;
    _nextRequestId: number;
    _apiKey: string;
    _bundlePromiseIfExists: Promise<void> | null;
    _blockJson: BlockJsonNew;
    _remoteJson: RemoteJson;
    _apiClient: APIClient;
    _bundler: browserify;

    constructor(args: {
        transpileAll: boolean,
        apiKey: string,
        blockJson: BlockJsonNew,
        remoteJson: RemoteJson,
    }) {
        const {
            transpileAll = false,
            apiKey,
            blockJson,
            remoteJson,
        } = args;

        this._pendingLongPollResolveRejectByRequestId = new Map();
        this._expressApp = express();
        this._shouldTranspileAll = transpileAll;
        this._nextRequestId = 0;
        this._apiKey = apiKey;
        this._bundlePromiseIfExists = null;
        this._blockJson = blockJson;
        this._remoteJson = remoteJson;

        this._setUpExpressRoutes();
        this._setUpRunFrameRoutes();
        this._setUpBlockSdkAndWrapper();
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
    }
    async _ensureBundleIsReadyAsync(): Promise<void> {
        if (this._bundlePromiseIfExists === null) {
            // Bundle already ready.
            return;
        }

        await this._bundlePromiseIfExists;

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
                    setTimeout(
                        () => resolve('timeout _ensureBundleIsReadyAsync'),
                        BUNDLE_TIMEOUT_MS,
                    );
                }),
            ]).then((value) => {
                if (value === 'timeout _ensureBundleIsReadyAsync') {
                    res.sendStatus(408);
                    return;
                }
                next();
            });
        };
    }
    _setUpRunFrameRoutes(): void {
        const blockDirPath = getBlockDirPath();
        const runFrameRoutes = express.Router();

        // Use body parser for JSON payloads.
        runFrameRoutes.use(bodyParser.json({limit: blockCliConfigSettings.BLOCK_REQUEST_BODY_LIMIT}));

        // Serve the bundle file if ready.
        runFrameRoutes.get('/bundle.js', this._ensureBundleIsReadyMiddleware(), (req: $Request, res: $Response) => {
            res.sendFile(blockCliConfigSettings.BUNDLE_FILE_NAME, {
                root: path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR),
            });
        });

        runFrameRoutes.options('/registerBlockInstallationMetadata', (req: $Request, res: $Response) => {
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Headers': 'Content-Type',
            }).status(200).end();
        });

        runFrameRoutes.post('/registerBlockInstallationMetadata', (req: $Request, res: $Response) => {
            if (!req.body || !req.body.applicationId || !req.body.blockInstallationId) {
                res.status(400).send({
                    error: 'BAD_REQUEST',
                    message: 'Must include applicationId and blockInstallationId in request body',
                });
            } else {
                if (!this._apiClient || this._apiClient.blockInstallationId !== req.body.blockInstallationId) {
                    console.log('Switched to a new block installation.');
                }
                invariant(typeof req.body.applicationId === 'string', 'expects req.body.applicationId to be a string');
                invariant(typeof req.body.blockInstallationId === 'string', 'req.body.blockInstallationId to be a string');
                this._apiClient = new APIClient({
                    apiBaseUrl: this._remoteJson.server,
                    applicationId: req.body.applicationId,
                    blockInstallationId: req.body.blockInstallationId,
                    apiKey: this._apiKey,
                });
                res.sendStatus(200);
            }
        });

        /**
         * This endpoint is used by the block frame to check if the
         * local block server is responding or not.
         */
        runFrameRoutes.head('/ping', (req: $Request, res: $Response) => {
            res.sendStatus(200);
        });

        runFrameRoutes.get('/poll', (req: RequestWithRequestId, res: $Response, next: NextFunction) => {
            // This promise will resolve whenever the bundle we're serving changes.
            const bundleChangePromise = new Promise((resolve, reject) => {
                this._pendingLongPollResolveRejectByRequestId.set(req.requestId, {resolve, reject});
            });
            // After the LONG_POLL_TIMEOUT_MS, send a request timeout to tell the client to retry.
            const timeoutPromise = new Promise((resolve, reject) => setTimeout(() => resolve('timeout'), LONG_POLL_TIMEOUT_MS));

            Promise.race([
                bundleChangePromise,
                timeoutPromise,
            ]).then(result => {
                const statusCode = result === 'timeout' ? 408 : 200;
                res.sendStatus(statusCode);
            }).catch((err) => {
                if (err.code === ErrorCodes.BUNDLE_ERROR) {
                    const ansiToHtmlConverter = new AnsiToHtmlConverter();
                    const errHtml = `<pre>
${ansiToHtmlConverter.toHtml(err.message)}
</pre>
`;
                    res.set('Content-Type', 'application/json');
                    // TODO(richsinn): Handle the error overlay and polling logic for syntax
                    //   errors in the iframe itself, instead of the block_client_wrapper code.
                    // NOTE: There exists logic in the block_client_wrapper code to keep the
                    //   polling connection alive for errors with'BUNDLE_ERROR' error code.
                    res.status(500).send({code: err.code, errStackHtml: errHtml});
                } else {
                    next(err);
                }
            }).finally(() => {
                this._pendingLongPollResolveRejectByRequestId.delete(req.requestId);
            });
        });

        this._expressApp.use('/__runFrame', runFrameRoutes);
    }
    _setUpBlockSdkAndWrapper() {
        const blockDirPath = getBlockDirPath();

        // Check if react and react-dom are listed in package.json.
        const packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'), 'utf8');
        const dependencies = JSON.parse(packageJson).dependencies;
        const dependenciesList = Object.keys(dependencies);
        if (!_.includes(dependenciesList, 'react') || !_.includes(dependenciesList, 'react-dom')) {
            console.log(
                'Please ensure that react and react-dom packages are installed and listed in package.json',
            );
            process.exit(1);
        }

        // Check if the node_modules directory exists.
        const nodeModulesDirPath = path.join(blockDirPath, 'node_modules');
        const nodeModulesDirExists = fs.existsSync(nodeModulesDirPath);
        if (!nodeModulesDirExists) {
            console.log(`Must run yarn in ${blockDirPath} first to install modules`);
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

        // Drop in the block SDK stub if it isn't already there.
        const blockSdkDirPath = path.join(
            blockDirPath,
            'node_modules',
            blockCliConfigSettings.SDK_PACKAGE_NAME,
        );
        const blockSdkExists = fs.existsSync(blockSdkDirPath);
        if (!blockSdkExists) {
            fs.mkdirSync(blockSdkDirPath);
            fs.writeFileSync(
                path.join(blockSdkDirPath, 'index.js'),
                `module.exports = (typeof window !== 'undefined' ? window : global)['${blockCliConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];`,
            );
        }

        // Write the client wrapper file.
        const buildDirPath = path.join(blockDirPath, blockCliConfigSettings.BUILD_DIR);
        if (!fs.existsSync(buildDirPath)) {
            fs.mkdirSync(buildDirPath);
        }
        const clientWrapperFilepath = path.join(buildDirPath, blockCliConfigSettings.CLIENT_WRAPPER_FILE_NAME);
        const isDevelopment = true;
        const clientWrapperCode = generateBlockClientWrapperCode(frontendEntryFilePath, isDevelopment);
        fs.writeFileSync(clientWrapperFilepath, clientWrapperCode);
    }
    _setUpBundler() {
        const blockDirPath = getBlockDirPath();

        const browsers = this._shouldTranspileAll ? allSupportedBrowsers : developmentBrowsers;
        console.log('Transpiling code for the following browsers');
        browsers.forEach(browser => console.log(`  - ${browser}`));
        if (this._shouldTranspileAll) {
            console.log('These are all the browsers that Airtable supports.');
        } else {
            console.log('These are recent browsers that support many modern JS features, which makes');
            console.log('debugging easier even with source maps. To transpile code for all the browsers');
            console.log('that Airtable supports, use --transpile-all');
        }
        console.log('');

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
                    babelify.configure(generateBlockBabelConfig({
                        browsers: this._shouldTranspileAll
                            ? allSupportedBrowsers
                            : developmentBrowsers,
                    })),
                ],
            },
        );

        this._bundler.on('update', this.bundleAsync.bind(this));
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
    async startAsync(port: number, ngrok: boolean): Promise<void> {
        const url = ngrok ?
            await this.startNgrokAsync(port) :
            await this.startLocalAsync(port);
        this.setPublicBaseUrl(url);
        await this.bundleAsync(null);
        console.log(chalk.white.bgBlue.bold(` Serving block at ${url} `));
        try {
            await clipboardy.write(url);
            console.log('Block URL has been copied to your clipboard');
        } catch (err) {
            // This can fail, especially on Linux. If it does, we don't really care.
        }
    }
    async startNgrokAsync(port: number): Promise<string> {
        // Start our express server.
        await new Promise((resolve, reject) => {
            const expressServer = this._expressApp.listen(port);
            invariant(expressServer, 'expressServer');
            expressServer
                .on('error', reject)
                .on('listening', resolve);
        });
        // Connect ngrok.
        return await new Promise((resolve, reject) => {
            require('ngrok').connect(port, (err, url) => {
                if (err) {
                    reject(err);
                }
                resolve(url);
            });
        });
    }
    async startLocalAsync(port: number): Promise<string> {
        // Read certs
        const [key, cert] = await Promise.all([
            fsUtils.readFileAsync(path.join(getBlocksCliProjectRootPath(), 'keys', 'server.key'), 'utf8'),
            fsUtils.readFileAsync(path.join(getBlocksCliProjectRootPath(), 'keys', 'server.crt'), 'utf8'),
        ]);
        // Start the local server using those certs
        await new Promise((resolve, reject) => {
            // flow-disable-next-line because flow confuses Socket types for createServer
            const server = https.createServer({cert, key}, this._expressApp);
            server
                .listen(port)
                .on('error', reject)
                .on('listening', resolve);
        });
        const url = `https://localhost:${port}`;
        console.log('Local mode: serving self-signed https on localhost');
        console.log(
            "If this is the first time you're running this command in local mode, you need to do some extra setup in your browser:",
        );
        console.log(`  - Firefox: go to https://localhost:${port} and add an ssl exception`);
        console.log(
            `  - Safari: go to https://localhost:${port}, click show details > visit this website, and log in`,
        );
        console.log(
            '  - Chrome: go to chrome://flags/#allow-insecure-localhost and click enable. Restart your browser',
        );
        console.log('');
        return url;
    }
    bundleAsync(files: Array<string> | null): Promise<void> {
        if (files && files.findIndex(file => file.includes('package.json')) !== -1) {
            // When yarn adds or removes packages, it deletes the symlinks
            // and SDK stub we add to node_modules. As a temporary fix, we
            // quit and ask the user to restart the CLI. Note that we can't
            // easily regenerate the symlinks and stub at this point because
            // package.json updates before yarn deletes our files.
            console.log('package.json changed, please run again.');
            process.exit(0);
        }

        let resolve;
        let reject;
        const bundlePromise = new Promise((resolveInner, rejectInner) => {
            resolve = resolveInner;
            reject = rejectInner;
        });
        // NOTE: In the case where `bundleAsync` is triggered multiple times,
        // this assignment to the `this._bundlePromiseIfExists` instance variable
        // will be the latest Promise. This mechanism allows us to serve the
        // most recently updated bundle.js file.
        this._bundlePromiseIfExists = bundlePromise;

        const blockDirPath = getBlockDirPath();
        const fsStream = fs.createWriteStream(path.join(
            blockDirPath,
            blockCliConfigSettings.BUILD_DIR,
            blockCliConfigSettings.BUNDLE_FILE_NAME,
        ));
        fsStream.on('finish', () => {
            console.log('Bundle updated');
            // NOTE: A null value for the `this._bundlePromiseIfExists`
            // instance variable means the bundle is ready to serve.
            // If `bundleAsync` is quickly triggered multiple times:
            //   1) It's possible the earlier Promises have not resolved yet.
            //   2) We only want to serve the bundle for the latest Promise.
            // Because the instance variable always stores the latest Promise, we
            // check the local Promise against the instance variable to determine
            // if this is the latest Promise and the bundle is ready.
            if (this._bundlePromiseIfExists === bundlePromise) {
                this._bundlePromiseIfExists = null;
            }
            // Resolve any long poll promises that were listening for bundle changes.
            for (const {resolve: longPollResolve} of this._pendingLongPollResolveRejectByRequestId.values()) {
                longPollResolve();
            }
            // Resolve our primary bundle promise.
            resolve();
        }).on('error', (err) => {
            // Reject our primary bundle promise.
            reject(err);
        });

        const bundleStream = this._bundler.bundle();
        bundleStream
            .on('error', (err) => {
                // Append a custom error code here. The error code will be used
                // to signal that the HTTP connection to block_server should be
                // kept alive via long polling.
                err.code = ErrorCodes.BUNDLE_ERROR;

                console.error(err.message);
                if (err.codeFrame) {
                    console.error(err.codeFrame);
                }
                if (this._bundlePromiseIfExists === bundlePromise) {
                    this._bundlePromiseIfExists = null;
                }
                bundleStream.unpipe(fsStream);
                fsStream.destroy(err);
            })
            .pipe(fsStream);

        return bundlePromise.catch((err) => {
            // Reject any long poll promises that were listening for bundle changes.
            for (const {reject: longPollReject} of this._pendingLongPollResolveRejectByRequestId.values()) {
                longPollReject(err);
            }
        });
    }
}

module.exports = BlockServer;
