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
const fsUtils = require('./fs_utils');

const events = require('events');
const bundleMessageBus = new events.EventEmitter();

// minimal transpilation - the closer the result is to the source, the easier
// debugging is, even with source maps.
const developmentBrowsers = [
    'last 6 chrome versions', // far enough to work in the desktop (electron) app
    'last 2 firefox versions',
    'last 1 safari version',
    'last 1 edge version',
];

// from https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable-
const allSupportedBrowsers = ['firefox >= 29', 'chrome >= 32', 'safari >= 9', 'edge >= 13'];

class BlockBundleServer {
    constructor({transpileAll = false} = {}) {
        this._pendingLongPollResponsesByRequestId = {};
        this._expressApp = express();
        this._shouldTranspileAll = transpileAll;

        this._setUpExpressRoutes();

        this._setUpBlockSdkAndWrapper();

        this._setUpBundler();

        this._nextRequestId = 0;

        bundleMessageBus.on('bundleUpdated', () => {
            // Whenever the bundle gets updated, return 200 to all the pending
            // long poll requests
            Object.keys(this._pendingLongPollResponsesByRequestId).forEach(requestId => {
                const res = this._pendingLongPollResponsesByRequestId[requestId];
                res.sendStatus(200);
                delete this._pendingLongPollResponsesByRequestId[requestId];
            });
        });
    }

    _setUpExpressRoutes() {
        // Set Access-Control-Allow-Origin on all requests
        this._expressApp.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next(null, req, res, next);
        });

        // Set a requestId on each request
        this._expressApp.use((req, res, next) => {
            req.requestId = this._nextRequestId;
            this._nextRequestId++;
            next(null, req, res, next);
        });

        const blockDirPath = process.cwd();
        // Serve the bundle file
        this._expressApp.get('/bundle', (req, res) => {
            res.sendFile(blocksConfigSettings.BUNDLE_FILE_NAME, {
                root: blockDirPath,
            });
        });

        this._expressApp.get('/longPoll', (req, res) => {
            // After 30 sec, send a request timeout to tell the client to retry
            res.setTimeout(30000, () => {
                delete this._pendingLongPollResponsesByRequestId[req.requestId];
                res.sendStatus(408);
            });
            this._pendingLongPollResponsesByRequestId[req.requestId] = res;
        });

        // Any request other than for the bundle should 404
        this._expressApp.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err, req, res);
        });

        // Error handler
        this._expressApp.use((err, req, res, next) => {
            // eslint-disable-line
            res.status(err.status || 500);
            res.send(err.message || 'Unknown error');
        });
    }
    _setUpBlockSdkAndWrapper() {
        const blockDirPath = process.cwd();

        // Check if react and react-dom are listed in package.json
        const packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'));
        const dependencies = JSON.parse(packageJson).dependencies;
        const dependenciesList = Object.keys(dependencies);
        if (!_.includes(dependenciesList, 'react') || !_.includes(dependenciesList, 'react-dom')) {
            console.log(
                'Please ensure that react and react-dom packages are installed and listed in package.json',
            );
            process.exit(1);
        }

        // Check if the node_modules directory exists
        const nodeModulesDirPath = path.join(blockDirPath, 'node_modules');
        const nodeModulesDirExists = fs.existsSync(nodeModulesDirPath);
        if (!nodeModulesDirExists) {
            console.log(`Must run yarn in ${blockDirPath} first to install modules`);
            process.exit(1);
        }
        // Get the block entry point
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

        // Check if frontendEntryModule exists
        const frontendEntryModuleExists = fs.existsSync(frontendEntryModulePath);
        if (!frontendEntryModuleExists) {
            console.log(
                `The entry module at ${frontendEntryModulePath} does not exist. If you changed the entry module, please run 'block rename-entry <newName>'`,
            );
            process.exit(1);
        }

        // Drop in the block SDK stub if it isn't already there
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

        // Write the client wrapper file
        const clientWrapperFilepath = path.join(
            blockDirPath,
            blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME,
        );
        const clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath);
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
    setPublicUrlForLongPoll(basePublicUrl) {
        // Provide the long poll endpoint URL via process.env so the generated
        // bundle can poll for changes and automatically reload the page.
        this._bundler.transform(
            envify({
                BLOCK_LONG_POLL_URL: `${basePublicUrl}/longPoll`,
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
