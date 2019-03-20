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
const blocksConfigSettings = require('./config/block_cli_config_settings');
const generateBlockClientWrapperCode = require('./generate_block_client_wrapper');
const APIClient = require('./api_client');
const fsUtils = require('./fs_utils');
const childProcess = require('child_process');
const BlockBackendMessageTypes = require('./block_backend_message_types');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const chokidar = require('chokidar');
const getBlockDirPath = require('./get_block_dir_path');
const getDeveloperCredentialsEncryptedIfExistsAsync = require('./get_developer_credentials_encrypted_if_exists_async');
const normalizeUserResponse = require('./normalize_user_response');
const semver = require('semver');

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

class BlockServer {
    constructor({transpileAll = false, apiKey} = {}) {
        this._pendingLongPollResponsesByRequestId = {};
        this._expressApp = express();
        this._shouldTranspileAll = transpileAll;
        this._nextRequestId = 0;
        this._pendingBackendResponsesByRequestId = {};
        this._apiKey = apiKey;
        this._developerCredentialPlaintextByName = null;

        this._watchBackendCode();
        this._setUpExpressRoutes();
        this._setUpRunFrameRoutes();
        this._setUpBackendRoutes();
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
    _watchBackendCode() {
        const blockDirPath = getBlockDirPath();
        const blockJsonPath = path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME);
        const backendRoutePath = path.join(blockDirPath, 'backendRoute');
        const sharedPath = path.join(blockDirPath, 'shared');
        // Unlike fs.watch, chokidar lets us watch paths that may not exist yet.
        chokidar.watch([blockJsonPath, backendRoutePath, sharedPath]).on('change', this.startBackendProcessIfNeeded.bind(this));
    }
    _setUpExpressRoutes() {
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
    }
    _setUpRunFrameRoutes() {
        const blockDirPath = getBlockDirPath();
        const runFrameRoutes = express.Router();

        // Use body parser for JSON payloads.
        runFrameRoutes.use(bodyParser.json({limit: blocksConfigSettings.BLOCK_REQUEST_BODY_LIMIT}));

        // Serve the bundle file.
        runFrameRoutes.get('/bundle.js', (req, res) => {
            res.sendFile(blocksConfigSettings.BUNDLE_FILE_NAME, {
                root: path.join(blockDirPath, blocksConfigSettings.BUILD_DIR),
            });
        });

        runFrameRoutes.options('/registerBlockInstallationMetadata', (req, res) => {
            res.set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Max-Age': 86400,
                'Access-Control-Allow-Headers': 'Content-Type',
            }).status(200).end();
        });

        runFrameRoutes.post('/registerBlockInstallationMetadata', (req, res) => {
            if (!req.body || !req.body.applicationId || !req.body.blockInstallationId) {
                res.status(400).send({
                    error: 'BAD_REQUEST',
                    message: 'Must include applicationId and blockInstallationId in request body',
                });
            } else {
                const blockData = JSON.parse(fs.readFileSync(path.join(blockDirPath, 'block.json')));

                if (!this._apiClient || this._apiClient.blockInstallationId !== req.body.blockInstallationId) {
                    console.log('Switched to a new block installation.');
                }

                this._apiClient = new APIClient({
                    environment: blockData.environment,
                    applicationId: req.body.applicationId,
                    blockInstallationId: req.body.blockInstallationId,
                    apiKey: this._apiKey,
                });
                res.sendStatus(200);
            }
        });

        runFrameRoutes.get('/poll', (req, res) => {
            // After 30 sec, send a request timeout to tell the client to retry.
            res.setTimeout(30000, () => {
                delete this._pendingLongPollResponsesByRequestId[req.requestId];
                res.sendStatus(408);
            });
            this._pendingLongPollResponsesByRequestId[req.requestId] = res;
        });

        this._expressApp.use('/__runFrame', runFrameRoutes);
    }
    _setUpBackendRoutes() {
        const backendRoutes = express.Router();
        const textBodyParser = bodyParser.text({
            type: () => true,
            limit: blocksConfigSettings.BLOCK_REQUEST_BODY_LIMIT,
        });
        backendRoutes.use(textBodyParser);

        // Send any other requests to the backend to be handled.
        backendRoutes.use((req, res) => {
            if (this._isStartingBackendProcess) {
                // If the backend process is restarting (or just starting),
                // return a 503 to all requests during this period.
                res.status(503).send({
                    error: 'SERVICE_UNAVAILABLE',
                    message: 'Deploy in progress. Try again.',
                });
            } else if (!this._doesBlockHaveBackend() || !this._backendProcess) {
                // If this block has no backend routes at all (and therefore
                // no backend process), 404 on all requests.
                res.status(404).send({
                    body: 'NOT_FOUND',
                });
            } else {
                this._fireRequestToBackend(req, res);
            }
        });

        this._expressApp.use('/', backendRoutes);
    }
    _getApiBaseUrlForEnvironment(environment) {
        switch (environment) {
            case 'local':
                return 'https://api.hyperbasedev.com:3000';
            case 'staging':
                return 'https://api-staging.airtable.com';
            case 'production':
            default:
                return 'https://api.airtable.com';
        }
    }
    _fireRequestToBackend(req, res) {
        if (!this._apiClient || !this._apiClient.applicationId || !this._apiClient.blockInstallationId) {
            console.log(chalk.bold('Did not receive block information from Airtable. Cannot fulfill backend request'));
            return;
        }

        // Fetch an access policy for this invocation, so the backend code can make requests
        // to Airtable.
        this._apiClient.fetchAccessPolicyAsync().then(accessPolicyBody => {
            const apiAccessPolicyString = accessPolicyBody.accessPolicy;

            const event = {
                requestId: req.requestId,
                method: req.method,
                query: req.query,
                path: req.path,
                body: req.body,
                headers: req.headers,
                apiAccessPolicyString: apiAccessPolicyString,
                applicationId: this._apiClient.applicationId,
                blockInstallationId: this._apiClient.blockInstallationId,
                kvValuesByKey: undefined, // SDK will fetch the kvValuesByKey.
                apiBaseUrl: this._getApiBaseUrlForEnvironment(this._apiClient.environment),
            };
            // Save the response object for when the backend process responds.
            this._pendingBackendResponsesByRequestId[req.requestId] = res;

            // Lambda invocation is approximately 300ms, so we want the cli
            // to be approximately as slow in order to simulate realistic UX.
            const lambdaSimulationDelayMs = 300;
            setTimeout(() => {
                // Send event to the process serving backend requests.
                this._backendProcess.send(event);
            }, lambdaSimulationDelayMs);
        }, err => {
            console.log(err);
        });
    }
    _setUpBlockSdkAndWrapper(url) {
        const blockDirPath = getBlockDirPath();

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
                `module.exports = (typeof window !== 'undefined' ? window : global)['${blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME}'];`,
            );
        }

        // Write the client wrapper file.
        const buildDirPath = path.join(blockDirPath, blocksConfigSettings.BUILD_DIR);
        if (!fs.existsSync(buildDirPath)) {
            fs.mkdirSync(buildDirPath);
        }
        const clientWrapperFilepath = path.join(buildDirPath, blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME);
        const clientWrapperCode = generateBlockClientWrapperCode(frontendEntryModulePath, url);
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
                blocksConfigSettings.BUILD_DIR,
                blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME
            ),
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
    _doesBlockHaveBackend() {
        const blockDirPath = getBlockDirPath();
        const backendDirPath = path.join(blockDirPath, 'backendRoute');
        return fs.existsSync(backendDirPath);
    }
    startBackendProcessIfNeeded() {
        // If our block doesn't have any backend routes, don't start the process.
        if (!this._doesBlockHaveBackend()) {
            return;
        }
        // Set a flag so our server knows not to forward requests
        // to the backend process while it is starting up.
        this._isStartingBackendProcess = true;
        // Stop our existing backend process, if we have one.
        if (this._backendProcess && this._backendProcess.connected) {
            this._backendProcess.disconnect();
        }
        console.log('Updating backend...');
        // Create a new process to run the user's backend code so errors do not propagate
        // to blocks-cli and to emulate the Lambda environment more closely.
        this._backendProcess = childProcess.fork(path.join(__dirname, 'block_backend_handler'), {
            stdio: 'pipe',
            env: this.generateEnvironmentVariablesForBackendProcess(),
            execArgv: [
                // HACK: production blocks currently run node 8.10. node 8.14
                // changed the default max http header size from 80kb to 8kb, so
                // if the user's local node version is >= 8.14, set the max http
                // header size back to 80kb. Ideally blocks-cli should actually
                // use the same version of node that the block runs in
                // production.
                semver.gte(process.versions.node, '8.14.0') ? '--max-http-header-size=80000' : null,
            ].filter(arg => !!arg),
        });
        // Pipe logs from the backend process into this one and prefix them with [backend].
        const pipeStdio = (pipe, prefix) => {
            pipe.on('data', chunk =>
                chunk
                    .toString('utf-8')
                    .replace(/\n$/, '')
                    .split('\n')
                    .forEach(line => console.log(`${prefix} ${line}`)),
            );
        };
        pipeStdio(this._backendProcess.stdout, chalk.blue('[backend]'));
        pipeStdio(this._backendProcess.stderr, chalk.yellow('[backend]'));
        // Configure the block server to handle event responses sent by the backend process.
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

                    const {statusCode, headers, body} = normalizeUserResponse(response);
                    res.writeHead(statusCode, headers);
                    res.end(body);

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

        this._backendProcess.on('error', err => {
            // Swallow any errors and log in console. This will allow for
            // recovery on next bundle update.
            console.error('ChildProcess Error:', err.message);
        });
    }
    setPublicBaseUrl(publicBaseUrl) {
        // Use process.env to provide the base URL.
        this._bundler.transform(
            envify({
                BLOCK_BASE_URL: publicBaseUrl,
            }),
        );
    }

    /**
     * 1. Read and decode the developerCredentialsEncrypted from the local file.
     * 2. Decrypt by hitting the public Decrypt CRUD route in hyperbase.
     * 3. Set decrypted values as an instance variable. The startBackendProcessIfNeeded() method
     *    will set an Environment Variable from the instance variable.
     *
     * This only considers the development credential type from the developer credentials
     * when starting the server. It ignores the release credential type.
     */
    async setDevelopmentCredentialPlaintextByNameAsync() {
        const blockData = JSON.parse(fs.readFileSync(path.join(getBlockDirPath(), blocksConfigSettings.BLOCK_FILE_NAME)));
        const developerCredentialsEncrypted = await getDeveloperCredentialsEncryptedIfExistsAsync();
        if (developerCredentialsEncrypted === null) {
            this._developerCredentialPlaintextByName = null;
            return;
        }

        const credentialsEncrypted =
            developerCredentialsEncrypted
                .filter(developerCredentialEncrypted => !!developerCredentialEncrypted.developmentCredentialValueEncrypted)
                .map(developerCredentialEncrypted => {
                    return {
                        name: developerCredentialEncrypted.name,
                        kmsDataKeyId: developerCredentialEncrypted.kmsDataKeyId,
                        credentialValueEncrypted: developerCredentialEncrypted.developmentCredentialValueEncrypted,
                    };
                });

        if (credentialsEncrypted.length === 0) {
            // No credentials with development credential type exists, so return early.
            return;
        }

        if (!this._apiClient) {
            this._apiClient = new APIClient({
                environment: blockData.environment,
                applicationId: blockData.applicationId,
                blockId: blockData.blockId,
                apiKey: this._apiKey,
            });
        }
        const credentialsPlaintext = await this._apiClient.decryptCredentialsAsync(credentialsEncrypted);

        if (credentialsPlaintext) {
            this._developerCredentialPlaintextByName =
                credentialsPlaintext.reduce((credentialPlaintextByName, credentialPlaintext) => {
                    credentialPlaintextByName[credentialPlaintext.name] = credentialPlaintext.credentialValuePlaintext;
                    return credentialPlaintextByName;
                }, {});
        } else {
            this._developerCredentialPlaintextByName = null;
        }
    }
    generateEnvironmentVariablesForBackendProcess() {
        const env = {
            FORCE_COLOR: 1,
            NODE_ENV: 'development',
        };
        if (this._developerCredentialPlaintextByName) {
            env.DEVELOPER_CREDENTIAL_BY_NAME = JSON.stringify(this._developerCredentialPlaintextByName);
        }

        return env;
    }
    async startAsync(port, local) {
        const url = local ?
            await this.startLocalAsync(port) :
            await this.startNgrokAsync(port);
        this.setPublicBaseUrl(url);
        await this.setDevelopmentCredentialPlaintextByNameAsync();
        this.startBackendProcessIfNeeded();
        this.bundle(null, () => {
            console.log(chalk.white.bgBlue.bold(` Serving block at ${url} `));
        });
    }
    async startNgrokAsync(port) {
        // Start our express server.
        await new Promise((resolve, reject) => {
            this._expressApp
                .listen(port)
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
    async startLocalAsync(port) {
        // Read certs
        const [key, cert] = await Promise.all([
            fsUtils.readFileAsync(path.join(__dirname, '../keys/server.key'), 'utf8'),
            fsUtils.readFileAsync(path.join(__dirname, '../keys/server.crt'), 'utf8'),
        ]);
        // Start the local server using those certs
        await new Promise((resolve, reject) => {
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
    bundle(files, callback) {
        if (files && files.findIndex(file => file.includes('package.json')) !== -1) {
            // When yarn adds or removes packages, it deletes the symlinks
            // and SDK stub we add to node_modules. As a temporary fix, we
            // quit and ask the user to restart the CLI. Note that we can't
            // easily regenerate the symlinks and stub at this point because
            // package.json updates before yarn deletes our files.
            console.log('package.json changed, please run again.');
            process.exit(0);
        }

        const blockDirPath = getBlockDirPath();
        var fsStream = fs.createWriteStream(path.join(
            blockDirPath,
            blocksConfigSettings.BUILD_DIR,
            blocksConfigSettings.BUNDLE_FILE_NAME
        ));
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

module.exports = BlockServer;
