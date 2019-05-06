/* eslint-disable no-console */
require('@babel/polyfill');
const pathToRegexp = require('path-to-regexp');
const fsUtils = require('./fs_utils');
const path = require('path');
const BlockBackendMessageTypes = require('./block_backend_message_types');
const blocksConfigSettings = require('./config/block_cli_config_settings');
const Babel = require('@babel/core');
const generateBlockBabelConfig = require('./generate_block_babel_config');
const chalk = require('chalk');
const generateResponseBodyBase64 = require('./generate_response_body_base64');
const getBlockDirPath = require('./get_block_dir_path');
const Environments = require('./types/environments');
const promisify = require('es6-promisify');
const request = require('request');
request.getAsync = promisify(request.get);

function getFormattedProjectPath(folder, name, extension='.js') {
    return chalk.bold(`${path.join(folder, name)}${extension}`);
}
function getRouteAndParamsForEvent(event, routes) {
    let matchedRouteIdAndParams = null;
    for (const routeId of Object.keys(routes)) {
        const route = routes[routeId];
        if (route.metadata.method.toLowerCase() === event.method.toLowerCase()) {
            const keys = [];
            const re = pathToRegexp(route.metadata.urlPath, keys);
            const match = re.exec(event.path);
            if (match) {
                const params = keys.reduce((result, key, index) => {
                    const param = match[index + 1];
                    result[key.name] = param;
                    return result;
                }, {});
                matchedRouteIdAndParams = {
                    routeId,
                    params,
                };
                break;
            }
        }
    }
    if (!matchedRouteIdAndParams) {
        return null;
    }
    const route = routes[matchedRouteIdAndParams.routeId];
    return {
        route,
        params: matchedRouteIdAndParams.params,
    };
}

async function callUserCodeForEventAsync(event, routes, developerCredentialByName) {
    // If an OPTIONS request is sent, send back the necessary cors headers.
    // This is necessary since the block frame is currently served from a different
    // origin than the backend code. Requests get treated like CORS requests, even
    // though, when using the editor, the frontend and backend are served from the
    // same origin.
    // TODO: when registering a block installation, also send the frame's origin and
    // only handle OPTIONS requests if the origins match. Right now, we're being *more*
    // lenient than the block router.
    if (event.method.toUpperCase() === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: [
                'access-control-allow-origin', '*',
                'access-control-allow-methods', '*',
                'access-control-max-age', '86400',
                'access-control-allow-headers', '*',
            ],
        };
    }

    const routeAndParams = getRouteAndParamsForEvent(event, routes);
    if (routeAndParams === null) {
        // No matching route, so treat this as a 404.
        return {
            statusCode: 404,
            ...generateResponseBodyBase64('NOT_FOUND'),
        };
    }
    const {route, params} = routeAndParams;

    try {
        const sdkWrapperInstance = global[blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME];
        if (!sdkWrapperInstance) {
            throw new Error('SDK not set on global');
        }

        await sdkWrapperInstance.__initializeSdkForEventAsync(event, developerCredentialByName);

        const blockDirPath = getBlockDirPath();
        const routeHandlerModule = require(path.join(blockDirPath, blocksConfigSettings.BUILD_DIR, 'backendRoute', route.metadata.name));
        if (!routeHandlerModule || typeof routeHandlerModule !== 'object' || typeof routeHandlerModule.default !== 'function') {
            const errorMessage = `${getFormattedProjectPath('backendRoute', route.metadata.name)} does not export a default function!`;
            console.warn(errorMessage);
            return {
                statusCode: 500,
                ...generateResponseBodyBase64({
                        err: errorMessage,
                        message: 'SERVER_ERROR',
                    }
                ),
            };
        }

        const handler = routeHandlerModule.default;

        const requestObj = {
            method: event.method,
            query: event.query,
            params,
            path: event.path,
            body: event.body,
            headers: event.headers,

            // Private fields for SDK consumption:
            _apiAccessPolicyString: event.apiAccessPolicyString,
            _applicationId: event.applicationId,
            _blockInstallationId: event.blockInstallationId,
            _kvValuesByKey: event.kvValuesByKey,
        };

        // A backend route handler function may return a promise or a non-promise
        // value. For consistency, let's always convert it to a promise so that we
        // can handle both formats the same.
        const responsePromise = Promise.resolve(handler(requestObj));

        const response = await responsePromise;
        return response;
    } catch (err) {
        // Their handler threw an error, so treat this as a 500.
        console.warn(chalk.red(err.stack));
        return {
            statusCode: 500,
            ...generateResponseBodyBase64({
                err: err.toString(),
                stack: err.stack,
                message: 'SERVER_ERROR',
            }),
        };
    }
}

async function generateRoutesObjectFromModulesAsync(modules) {
    const backendModules = modules.filter(module => module.metadata.type === 'backendRoute');
    const routes = {};
    for (const backendModule of backendModules) {
        routes[backendModule.id] = backendModule;
    }
    return routes;
}

async function symlinkBackendAndSharedFoldersAsync() {
    const blockDirPath = getBlockDirPath();
    const buildDirPath = path.join(blockDirPath, blocksConfigSettings.BUILD_DIR);
    const folderNames = ['backendRoute', 'shared'];
    for (const folderName of folderNames) {
        const folderPath = path.join(buildDirPath, folderName);
        const nodeModulesPath = path.join(blockDirPath, 'node_modules', folderName);
        fsUtils.symlinkIfNeededAsync(folderPath, nodeModulesPath);
    }
}

async function transpileFileIfNeededAsync(fileName, moduleType, srcDirPath, destDirPath) {
    const srcFilePath = path.join(srcDirPath, moduleType, fileName);
    const destFilePath = path.join(destDirPath, moduleType, fileName);

    // Re-transpile if the file changed in the last minute, which helps
    // unbreak things if transpiling gets into a bad state and you restart.
    const srcFileStat = await fsUtils.statIfExistsAsync(srcFilePath);
    const destFileStat = await fsUtils.statIfExistsAsync(destFilePath);
    const slop = 1 * 60 * 1000; // 1 min
    if (destFileStat && (!srcFileStat || destFileStat.mtimeMs > srcFileStat.mtimeMs + slop)) {
        return;
    }

    const code = await fsUtils.readFileAsync(srcFilePath, 'utf8');
    const transpiledCode = Babel.transform(code, generateBlockBabelConfig({
        node: blocksConfigSettings.BLOCK_NODE_VERSION,
    })).code;
    await fsUtils.writeFileAsync(destFilePath, transpiledCode);
}

async function transpileBackendAndSharedCodeAsync() {
    const blockDirPath = getBlockDirPath();
    const sharedFiles = await fsUtils.readDirIfExistsAsync(path.join(blockDirPath, 'shared'));
    const backendRouteFiles = await fsUtils.readDirIfExistsAsync(path.join(blockDirPath, 'backendRoute'));

    const filesByModuleType = {
        shared: sharedFiles,
        backendRoute: backendRouteFiles,
    };

    const buildDirPath = path.join(blockDirPath, blocksConfigSettings.BUILD_DIR);
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(buildDirPath);
    const backendBuildDirPath = path.join(buildDirPath, 'backendRoute');
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(backendBuildDirPath);
    const sharedBuildDirPath = path.join(buildDirPath, 'shared');
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(sharedBuildDirPath);

    const transpilationPromises = [];
    const jsRegex = /\.js$/;
    for (const moduleType of Object.keys(filesByModuleType)) {
        const files = filesByModuleType[moduleType] || [];
        for (const file of files) {
            if (jsRegex.test(file)) {
                const transpilationPromise = transpileFileIfNeededAsync(file, moduleType, blockDirPath, buildDirPath);
                transpilationPromises.push(transpilationPromise);
            }
        }
    }
    await Promise.all(transpilationPromises);
}

async function checkIfBackendRoutesExistInBlockJson(modules) {
    const blockDirPath = getBlockDirPath();

    const blockJsonBackendRouteFiles = new Set();
    modules.forEach(module => {
        if (module.metadata.type === 'backendRoute') {
            blockJsonBackendRouteFiles.add(`${module.metadata.name}.js`);
        }
    });

    const backendRouteFiles = await fsUtils.readDirAsync(path.join(blockDirPath, 'backendRoute'));
    const jsRegex = /\.js$/;
    backendRouteFiles.forEach(file => {
        if (jsRegex.test(file) && !blockJsonBackendRouteFiles.has(file)) {
            const formattedFileName = getFormattedProjectPath('backendRoute', file, '');
            console.warn(`${formattedFileName} is being ignored since this file could not be found in block.json.`);
            console.warn(`Please add an entry for ${formattedFileName} to block.json to resolve this error.`);
        }
    });
}

// Copied from https://stackoverflow.com/questions/17581830/load-node-js-module-from-string-in-memory
function requireFromString(src) {
    const Module = module.constructor;
    const m = new Module();
    m._compile(src, '');
    return m.exports;
}

async function downloadBackendSdkAsync(blockJson, blockDirPath) {
    let baseUrl;
    const environment = blockJson.environment || Environments.PRODUCTION;
    switch (environment) {
        case Environments.PRODUCTION:
            // NOTE: this should probably download from the cdn, but we can't do that
            // right now, since the cdn url contains the hyperbase code version. In
            // the future, we should add a public endpoint to fetch the cdn url, so
            // we could hit that endpoint and then download the sdk from the cdn.
            baseUrl = 'https://airtable.com/js/compiled';
            break;
        case Environments.STAGING:
            // NOTE: see comment above.
            baseUrl = 'https://staging.airtable.com/js/compiled';
            break;
        case Environments.LOCAL:
            baseUrl = 'https://hyperbasedev.com:3000/js/build';
            break;
        default:
            throw new Error(`Unrecognized environment: ${environment}`);
    }
    const sdkUrl = `${baseUrl}/block_backend_sdk.js`;
    const response = await request.getAsync({
        uri: sdkUrl,
    });
    if (response.statusCode !== 200) {
        throw new Error(`Failed to download backend SDK with statusCode: ${response.statusCode}`);
    }
    const backendSdkJs = response.body;

    // This is sketchy: some runtime checks for "am I running in Node" check that
    // typeof self === 'undefined', so this breaks that...
    // But whatwg-fetch references `self` so if we don't do this, the SDK doesn't
    // load. TODO(kasra): look into removing the dependency on whatwg-fetch.
    global.self = global;
    const BackendBlockSdkWrapper = requireFromString(backendSdkJs);
    return BackendBlockSdkWrapper;
}

/**
 * In hyperbase, the code to extract and decrypt developer credentials
 * is handled in the backend wrapper code. But in the blocks-cli world,
 * we're decrypting the credential values in BlockServer and passing the
 * values to this forked backend process via Environment Variables.
 *
 * Once we extract the credential values via the Environment Variable, we delete
 * the Environment Variable for a couple reasons:
 * 1. The hyperbase implementation does not have credential values in process.env.
 *    Instead credentials are accessed via a similarly named method
 *    getDeveloperCredentialByName(). In blocks_cli, by encapsulating the credential
 *    access from the Env Var here, and then immediately deleting the Env Var, we make
 *    the implementation a tiny, tad bit closer to the hyperbase implementation.
 * 2. Some libraries unwittingly leak process.env values, and deleting the Env Var
 *    helps prevent it.
 */
function getDeveloperCredentialByName() {
    let developerCredentialByName;
    if (process.env.DEVELOPER_CREDENTIAL_BY_NAME) {
        developerCredentialByName = JSON.parse(process.env.DEVELOPER_CREDENTIAL_BY_NAME);
    } else {
        developerCredentialByName = {};
    }

    delete process.env.DEVELOPER_CREDENTIAL_BY_NAME;
    return developerCredentialByName;
}

async function setUpBackend() {
    // Parse block.json.
    const blockDirPath = getBlockDirPath();
    const rawBlockJson = await fsUtils.readFileAsync(path.join(blockDirPath, 'block.json'));
    const blockJson = JSON.parse(rawBlockJson);
    const modules = blockJson.modules;
    // Check if all files in backendRoute exist in block.json, and issue
    // warnings otherwise.
    await checkIfBackendRoutesExistInBlockJson(modules);
    // Transpile all backend modules.
    await transpileBackendAndSharedCodeAsync();
    // Symlink our backend and shared folders into node_modules so that
    // absolute paths will work for imports/requires.
    await symlinkBackendAndSharedFoldersAsync();
    // Create a routes object to store our backend modules so we can call
    // their handlers when we receive a request.
    const routes = await generateRoutesObjectFromModulesAsync(modules);
    // Get the developer credential values so we can initialize the SDK with it
    const developerCredentialByName = getDeveloperCredentialByName();
    // Download the backend sdk.
    const BackendBlockSdkWrapper = await downloadBackendSdkAsync(blockJson, blockDirPath);
    const sdkWrapperInstance = new BackendBlockSdkWrapper();

    // When we receive a request, call user code and send back the response.
    process.on('message', async event => {
        if (sdkWrapperInstance) {
            // NOTE: in hyperbase, this code is inside callUserCodeForEventAsync, but
            // hyperbase doesn't have to deal with downloading the SDK, so for more
            // organizational clarity, we'll do this step here.
            if (global[blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME] !== sdkWrapperInstance) {
                // If this isn't assigned yet, or the user's code replaced it for
                // some reason in the previous invocation, set it to the SDK wrapper.
                global[blocksConfigSettings.GLOBAL_SDK_VARIABLE_NAME] = sdkWrapperInstance;
            }
        }

        const response = await callUserCodeForEventAsync(event, routes, developerCredentialByName);
        process.send({
            messageType: BlockBackendMessageTypes.EVENT_RESPONSE,
            requestId: event.requestId,
            ...response,
        });
    });

    // Signal that this process is ready to start serving requests.
    process.send({
        messageType: BlockBackendMessageTypes.PROCESS_READY,
        pid: process.pid,
    });
}

setUpBackend();
