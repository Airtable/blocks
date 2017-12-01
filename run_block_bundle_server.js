#!/usr/bin/env node
'use  strict';

const _ = require('lodash');
const ngrok = require('ngrok');
const prompt = require('prompt');
const BlockBundleServer = require('./lib/block_bundle_server');

const defaultPort = 8000;

function _exitWithError(message) {
    console.log(message);
    process.exit(1);
}

const blockBundleServer = new BlockBundleServer();

function triggerInitialBundleAndStartNgrok(port) {
    // We perform an intial bundle before starting ngrok since the user might
    // have made changes since the last time the server was running or this
    // this might be the very first time they are running the server.
    // NOTE: We do this here instead of in BlockBundleServer.start so that
    // the bundler logging doesn't mess up the port prompt stuff below.
    blockBundleServer.bundle(null, () => {
        ngrok.connect(port, (err, url) => {
            if (err) {
                _exitWithError(err.message);
            }
            console.log(`Serving bundle at ${url}/bundle`);
        });
    });
}

function startBlockBundleServer(port) {
    blockBundleServer.startAsync(port).then(() => {
        triggerInitialBundleAndStartNgrok(defaultPort);
    }).catch(err => {
        // If there was an error due to the port being taken, prompt for an
        // alternative port and try again
        if (err.code == 'EADDRINUSE') {
            prompt.get({
                name: 'port',
                description: `Port ${port} is taken, please provide an alternative port to run on`,
            }, (err, result) => {
                if (err) {
                    _exitWithError(err.message);
                }
                const newPort = result.port;
                if (isNaN(newPort)) {
                    _exitWithError('Invalid port number');
                }
                startBlockBundleServer(newPort);
            });
        } else {
            _exitWithError(err.message);
        }
    });
}

startBlockBundleServer(defaultPort);
