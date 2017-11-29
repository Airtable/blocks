'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const babelPresetEs2015 = require('babel-preset-es2015');
const babelPresetReact = require('babel-preset-react');
const stage2BabelPreset = require('babel-preset-stage-2');
const blocksConfigSettings = require('../config/blocks_settings.js');
const generateBlockClientWrapperCode = require('./generate_block_client_wrapper.js');

class BlockBuilderServer {
    constructor(port) {
        this._port = port;
        this._expressApp = express();

        this._setupExpressRoutes();

        this._setupBlockSdkAndWrapper();

        this._setupBundler();

        // The user might have made changes when the server wasn't running, so
        // bundle here to ensure we are serving the latest package
        this._bundle();
    }
    _setupExpressRoutes() {
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
    _setupBlockSdkAndWrapper() {
        const blockDirPath = process.cwd();
        // Get the block entry point
        let entryModulePath;
        try {
            const blockMetadataJSON = fs.readFileSync(path.join(blockDirPath,'.blocks'));
            const blockMetadata = JSON.parse(blockMetadataJSON);
            entryModulePath = path.join(blockDirPath, 'frontend', blockMetadata.entryModuleName);
        } catch (err) {
            if (err.code == 'ENOENT') {
                console.log('This directory does not contain a block');
            } else {
                console.log(err.message);
            }
            process.exit(1);
        }

        // Drop in the block SDK stub if it isn't already there
        const blockSdkDirPath = path.join(blockDirPath, 'node_modules', blocksConfigSettings.SDK_PACKAGE_NAME);
        const blockSdkExists = fs.existsSync(blockSdkDirPath);
        if (!blockSdkExists) {
            fs.mkdirSync(blockSdkDirPath);
            fs.writeFileSync(path.join(blockSdkDirPath, 'index.js'), `module.exports = window['${blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];`);
        }

        // Write the client wrapper file if not already there
        const clientWrapperFilepath = path.join(blockDirPath, blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME);
        const clientWrapperFileExists = fs.existsSync(clientWrapperFilepath);
        if (!clientWrapperFileExists) {
            const clientWrapperCode = generateBlockClientWrapperCode(entryModulePath);
            fs.writeFileSync(clientWrapperFilepath, clientWrapperCode);
        }
    }
    _setupBundler() {
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

        this._bundler.on('update', this._bundle.bind(this));
        this._bundler.on('bundle', () => console.log('Updaing bundle...'));
        //this._bundler.on('file', file => console.log(file));
    }
    start() {
        this._expressApp.listen(this._port);
    }
    _bundle() {
        var fsStream = fs.createWriteStream('bundle.js');
        fsStream.on('finish', function() {
            if (fsStream.bytesWritten > 0) {
                console.log('Bundle updated');
            }
        });
        this._bundler.bundle()
            .on('error', function (err) {
                //console.log(err);
                console.error(err.message);
                if (err.codeFrame) {
                    console.error(err.codeFrame);
                }
                this.emit('end');
            })
            .pipe(fsStream);
    }
}

module.exports = BlockBuilderServer;
