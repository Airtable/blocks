/* eslint-disable no-console */
'use strict';

const _ = require('lodash');
const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const envify = require('envify/custom');
const babelify = require('babelify');
const watchify = require('watchify');
const babelPresetEnv = require('babel-preset-env');
const babelPresetReact = require('babel-preset-react');
const stage2BabelPreset = require('babel-preset-stage-2');
const blocksConfigSettings = require('../config/block_cli_config_settings.js');
const generateBlockClientWrapperCode = require('./generate_block_client_wrapper.js');
const APIClient = require('./api_client');
const getApiKeySync = require('./get_api_key_sync');
const fsUtils = require('./fs_utils');
const childProcess = require('child_process');
const BlockBackendMessageTypes = require('./block_backend_message_types');
const bodyParser = require('body-parser');

const events = require('events');
const bundleMessageBus = new events.EventEmitter();

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

class BlockBundleServer {
    constructor({transpileAll = false} = {}) {
        const blockDirPath = process.cwd();
        this._pendingLongPollResponsesByRequestId = {};
        this._expressApp = express();
        this._shouldTranspileAll = transpileAll;
        this._nextRequestId = 0;

        this._pendingBackendResponsesByRequestId = {};
        // Restart the backend process when code changes.
        fs.watchFile(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME), this._setUpBackendProcess.bind(this));
        fs.watch(path.join(blockDirPath, 'backendRoute'), this._setUpBackendProcess.bind(this));

        this._setUpBackendProcess();

        this._setUpExpressRoutes();

        this._setUpBlockSdkAndWrapper();

        this._setUpBundler();

        bundleMessageBus.on('bundleUpdated', () => {
            // Whenever the bundle gets updated, return 200 to all the pending
            // long poll requests to automatically reload the page.
            Object.keys(this._pendingLongPollResponsesByRequestId).forEach(requestId => {
                const res = this._pendingLongPollResponsesByRequestId[requestId];
                res.sendStatus(200);
                delete this._pendingLongPollResponsesByRequestId[requestId];
            });
        });
    }
    _setUpBackendProcess() {
        console.log('Updating backend...');
        // Set a flag so our server knows not to forward requests
        // to the backend process while it is starting up.
        this._isStartingBackendProcess = true;
        // Stop our existing backend process, if we have one.
        if (this._backendProcess) {
            this._backendProcess.disconnect();
        }
        // Create a new process to run the user's backend code so errors do not propagate
        // to blocks-cli and to emulate the Lambda environment more closely.
        this._backendProcess = childProcess.fork(path.join(__dirname, 'block_backend_handler'));
        this._pendingBackendResponsesByRequestId = {};
        this._backendProcess.on('message', response => {
            switch (response.messageType) {
                case BlockBackendMessageTypes.EVENT_RESPONSE: {
                    // Fetch response object from when request was made.
                    const res = this._pendingBackendResponsesByRequestId[response.requestId];
                    if (!res) {
                        console.log('Response object for request cannot be found...');
                        return;
                    }

                    const {statusCode, body, headers} = response;
                    if (headers) {
                        res.set(headers);
                    }

                    // Status code defaults to 200 if the user does not include one.
                    const statusCodeToReturn = typeof statusCode === 'number' ? statusCode : 200;
                    if (body === undefined) {
                        res.status(statusCodeToReturn).end();
                    } else {
                        res.status(statusCodeToReturn).send(body);
                    }
                    break;
                }
                case BlockBackendMessageTypes.PROCESS_READY:
                    if (response.pid === this._backendProcess.pid) {
                        // If this process matches our current backend
                        // process, signal that it has finished starting
                        // up to start forwarding requests to it again.
                        this._isStartingBackendProcess = false;
                        console.log('Backend updated');
                    }
                    break;
                default:
                    // no-op
            }
        });
    }
    _setUpExpressRoutes() {
        const blockDirPath = process.cwd();

        // Use body parser for JSON payloads.
        this._expressApp.use(bodyParser.json({
            limit: '5mb',
        }));

        // Set Access-Control-Allow-Origin on all requests.
        this._expressApp.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next(null, req, res, next);
        });

        // Set a requestId on each request.
        this._expressApp.use((req, res, next) => {
            req.requestId = this._nextRequestId;
            this._nextRequestId++;
            next(null, req, res, next);
        });

        // Serve the bundle file.
        this._expressApp.get('/__runFrame', (req, res) => {
            res.sendFile(blocksConfigSettings.BUNDLE_FILE_NAME, {
                root: blockDirPath,
            });
        });

        this._expressApp.options('/__registerBlockInstallationMetadata', (req, res) => {
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Max-Age': 86400,
                'Access-Control-Allow-Headers': 'Content-Type',
            }).status(200).end();
        });

        this._expressApp.post('/__registerBlockInstallationMetadata', (req, res) => {
            if (!req.body || !req.body._applicationId || !req.body._blockInstallationId) {
                res.status(400).send({
                    error: 'BAD_REQUEST',
                    message: 'Must include _applicationId and _blockInstallationId in request body',
                });
            } else {
                const apiKey = getApiKeySync(blockDirPath);

                const blockData = JSON.parse(fs.readFileSync(path.join(blockDirPath, 'block.json')));

                this._apiClient = new APIClient({
                    environment: blockData.environment,
                    applicationId: req.body._applicationId,
                    blockInstallationId: req.body._blockInstallationId,
                    apiKey,
                });
                res.sendStatus(200);
            }
        });

        this._expressApp.get('/__runFrame/poll', (req, res) => {
            // After 30 sec, send a request timeout to tell the client to retry.
            res.setTimeout(30000, () => {
                delete this._pendingLongPollResponsesByRequestId[req.requestId];
                res.sendStatus(408);
            });
            this._pendingLongPollResponsesByRequestId[req.requestId] = res;
        });

        // Send any other requests to the backend to be handled.
        this._expressApp.use((req, res) => {
            if (this._isStartingBackendProcess) {
                // If the backend process is restarting (or just starting),
                // return a 503 to all requests during this period.
                res.status(503).send({
                    error: 'SERVICE_UNAVAILABLE',
                    message: 'Deploy in progress. Try again.',
                });
            } else {
                this._fireRequestToBackend(req, res);
            }
        });
    }
    _fireRequestToBackend(req, res) {
        if (!this._apiClient) {
            console.log('Did not receive block information from Airtable. Cannot fulfill backend request');
            return;
        }

        this._apiClient.fetchAccessPolicyAsync().then(body => {
            const apiAccessPolicyString = body.accessPolicy;

            const event = {
                requestId: req.requestId,
                method: req.method,
                query: req.query,
                path: req.path,
                body: req.body,
                headers: req.headers,

                _apiAccessPolicyString: apiAccessPolicyString,
                _applicationId: this._applicationId,
                _blockInstallationId: this._blockInstallationId,
            };
            // Save the response object for when the backend process responds.
            this._pendingBackendResponsesByRequestId[req.requestId] = res;
            // Send event to the process serving backend requests.
            this._backendProcess.send(event);
        }, err => {
            console.log(err);
        });
    }
    _setUpBlockSdkAndWrapper(url) {
        const blockDirPath = process.cwd();

        // Check if react and react-dom are listed in package.json.
        const packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'));
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
        // Get the block entry point.
        let frontendEntryModulePath;
        try {
            const blockMetadataJson = fs.readFileSync(
                path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
            );
            const blockMetadata = JSON.parse(blockMetadataJson);
            frontendEntryModulePath = path.join(
                blockDirPath,
                'frontend',
                blockMetadata.frontendEntryModuleName,
            );
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('This directory does not contain a block');
            } else {
                console.log(err.message);
            }
            process.exit(1);
        }

        // Check if frontendEntryModule exists.
        const frontendEntryModuleExists = fs.existsSync(frontendEntryModulePath);
        if (!frontendEntryModuleExists) {
            console.log(
                `The entry module at ${frontendEntryModulePath} does not exist. If you changed the entry module, please run 'block rename-entry <newName>'`,
            );
            process.exit(1);
        }

        // Drop in the block SDK stub if it isn't already there.
        const blockSdkDirPath = path.join(
            blockDirPath,
            'node_modules',
            blocksConfigSettings.SDK_PACKAGE_NAME,
        );
        const blockSdkExists = fs.existsSync(blockSdkDirPath);
        if (!blockSdkExists) {
            fs.mkdirSync(blockSdkDirPath);
            fs.writeFileSync(
                path.join(blockSdkDirPath, 'index.js'),
                `module.exports = window['${blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];`,
            );
        }

        // Write the client wrapper file.
        const clientWrapperFilepath = path.join(
            blockDirPath,
            blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME,
        );
        const clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath, url);
        fs.writeFileSync(clientWrapperFilepath, clientWrapperCode);
    }
    _setUpBundler() {
        const blockDirPath = process.cwd();

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
            path.join(blockDirPath, blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME),
            {
                cache: {},
                debug: true,
                packageCache: {},
                plugin: [watchify],
                paths: [blockDirPath],
                transform: [
                    babelify.configure({
                        presets: [
                            [
                                babelPresetEnv,
                                {
                                    targets: {
                                        browsers: this._shouldTranspileAll
                                            ? allSupportedBrowsers
                                            : developmentBrowsers,
                                    },
                                },
                            ],
                            babelPresetReact,
                            stage2BabelPreset,
                        ],
                    }),
                ],
            },
        );

        this._bundler.on('update', this.bundle.bind(this));
        this._bundler.on('bundle', () => console.log('Updating bundle...'));
    }
    setPublicBaseUrl(publicBaseUrl) {
        // Use process.env to provide the base URL.
        this._bundler.transform(
            envify({
                BLOCK_BASE_URL: publicBaseUrl,
            }),
        );
    }
    startAsync(port) {
        return new Promise((resolve, reject) => {
            this._expressApp
                .listen(port)
                .on('error', reject)
                .on('listening', resolve);
        });
    }
    startLocalAsync(port) {
        return Promise.all([
            fsUtils.readFileAsync(path.join(__dirname, '../keys/server.key'), 'utf8'),
            fsUtils.readFileAsync(path.join(__dirname, '../keys/server.crt'), 'utf8'),
        ]).then(
            ([key, cert]) =>
                new Promise((resolve, reject) => {
                    const server = https.createServer({cert, key}, this._expressApp);
                    server
                        .listen(port)
                        .on('error', reject)
                        .on('listening', resolve);
                }),
        );
    }
    bundle(files, callback) {
        var fsStream = fs.createWriteStream(blocksConfigSettings.BUNDLE_FILE_NAME);
        fsStream.on('finish', function() {
            if (fsStream.bytesWritten > 0) {
                console.log('Bundle updated');
                bundleMessageBus.emit('bundleUpdated');
                if (callback) {
                    callback();
                }
            }
        });
        this._bundler
            .bundle()
            .on('error', function(err) {
                console.error(err.message);
                if (err.codeFrame) {
                    console.error(err.codeFrame);
                }
                this.emit('end');
            })
            .pipe(fsStream);
    }
}

module.exports = BlockBundleServer;
