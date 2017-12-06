'use strict';

const _ = require('lodash');
const express = require('express');
const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const babelPresetEs2015 = require('babel-preset-es2015');
const babelPresetReact = require('babel-preset-react');
const stage2BabelPreset = require('babel-preset-stage-2');
const blocksConfigSettings = require('../config/block_cli_config_settings.js');
const generateBlockClientWrapperCode = require('./generate_block_client_wrapper.js');

class BlockBundleServer {
    constructor() {
        this._expressApp = express();

        this._setUpExpressRoutes();

        this._setUpBlockSdkAndWrapper();

        this._setUpBundler();
    }

    _setUpExpressRoutes() {
        const blockDirPath = process.cwd();
        // Serve the bundle file
        this._expressApp.get('/bundle', (req, res, next) => {
            res.sendFile('bundle.js', {
                root: blockDirPath,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
        });

        // Any request other than for the bundle should 404
        this._expressApp.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err, req, res);
        });

        // Error handler
        this._expressApp.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.send(err.message || 'Unknown error');
        });
    }
    _setUpBlockSdkAndWrapper() {
        const blockDirPath = process.cwd();
        // Ensure a node_modules directory exists
        const nodeModulesDirPath = path.join(blockDirPath, 'node_modules');
        const nodeModulesDirExists = fs.existsSync(nodeModulesDirPath);
        if (!nodeModulesDirExists) {
            console.log(`Must run npm install in ${blockDirPath} first`);
            process.exit(1);
        }
        // Get the block entry point
        let frontendEntryModulePath;
        try {
            const blockMetadataJson = fs.readFileSync(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME));
            const blockMetadata = JSON.parse(blockMetadataJson);
            frontendEntryModulePath = path.join(blockDirPath, 'frontend', blockMetadata.frontendEntryModuleName);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('This directory does not contain a block');
            } else {
                console.log(err.message);
            }
            process.exit(1);
        }

        // Check if react and react-dom exist in node_modules
        const nodeModules = fs.readdirSync(path.join(blockDirPath, 'node_modules'));
        if (!_.includes(nodeModules, 'react') || !_.includes(nodeModules, 'react-dom')) {
            console.log('Please ensure react and react-dom packages are installed');
            process.exit(1);
        }

        // Check if frontendEntryModule exists
        const frontendEntryModuleExists = fs.existsSync(frontendEntryModulePath);
        if (!frontendEntryModuleExists) {
            console.log(`The entry module at ${frontendEntryModulePath} does not exist. If you changed the entry module, please run 'block updateEntryModuleName <newName>'`);
            process.exit(1);
        }

        // Drop in the block SDK stub if it isn't already there
        const blockSdkDirPath = path.join(blockDirPath, 'node_modules', blocksConfigSettings.SDK_PACKAGE_NAME);
        const blockSdkExists = fs.existsSync(blockSdkDirPath);
        if (!blockSdkExists) {
            fs.mkdirSync(blockSdkDirPath);
            fs.writeFileSync(path.join(blockSdkDirPath, 'index.js'), `module.exports = window['${blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];`);
        }

        // Write the client wrapper file
        const clientWrapperFilepath = path.join(blockDirPath, blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME);
        const clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath);
        fs.writeFileSync(clientWrapperFilepath, clientWrapperCode);
    }
    _setUpBundler() {
        const blockDirPath = process.cwd();
        this._bundler = browserify(path.join(blockDirPath, blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME), {
            cache: {},
            packageCache: {},
            plugin: [watchify],
            paths: [blockDirPath],
            transform: [babelify.configure({
                presets: [
                    babelPresetEs2015,
                    babelPresetReact,
                    stage2BabelPreset,
                ],
            })],
        });

        this._bundler.on('update', this.bundle.bind(this));
        this._bundler.on('bundle', () => console.log('Updating bundle...'));
    }
    startAsync(port, handler) {
        return new Promise((resolve, reject) => {
            this._expressApp.listen(port).on('error', reject).on('listening', resolve);
        });
    }
    bundle(files, callback) {
        var fsStream = fs.createWriteStream('bundle.js');
        fsStream.on('finish', function() {
            if (fsStream.bytesWritten > 0) {
                console.log('Bundle updated');
                if (callback) {
                    callback();
                }
            }
        });
        this._bundler.bundle()
            .on('error', function (err) {
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
