const pathToRegexp = require('path-to-regexp');
const fsUtils = require('./fs_utils');
const path = require('path');
const BlockBackendMessageTypes = require('./block_backend_message_types');
const blocksConfigSettings = require('../config/block_cli_config_settings.js');
const Babel = require('babel-standalone');
const blockBabelConfig = require('./block_babel_config');
const chalk = require('chalk');

function getFormattedProjectPath(folder, name) {
    return chalk.bold(`${path.join(folder, name)}.js`);
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

async function callUserCodeForEventAsync(event, routes) {
    const blockDirPath = process.cwd();

    // If an OPTIONS request is sent, send back the necessary cors headers.
    if (event.method.toUpperCase() === 'OPTIONS') {
        return {
            statusCode: 200,
            body: '',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Max-Age': 86400,
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }

    const routeAndParams = getRouteAndParamsForEvent(event, routes);
    if (routeAndParams === null) {
        // No matching route, so treat this as a 404.
        return {
            statusCode: 404,
            body: 'NOT_FOUND',
        };
    }
    const {route, params} = routeAndParams;

    try {
        const routeHandlerModule = require(path.join(blockDirPath, blocksConfigSettings.BUILD_DIR, 'backendRoute', route.metadata.name));
        if (!routeHandlerModule || typeof routeHandlerModule !== 'object' || typeof routeHandlerModule.default !== 'function') {
            const errorMessage = `${getFormattedProjectPath('backendRoute', route.metadata.name)} does not export a default function!`;
            console.warn(errorMessage);
            return {
                statusCode: 500,
                body: {
                    err: errorMessage,
                    message: 'SERVER_ERROR',
                },
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
            body: {
                err: err.toString(),
                stack: err.stack,
                message: 'SERVER_ERROR',
            },
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
    const blockDirPath = process.cwd();
    const buildDirPath = path.join(blockDirPath, blocksConfigSettings.BUILD_DIR);
    const folderNames = ['backendRoute', 'shared'];
    for (const folderName of folderNames) {
        const folderPath = path.join(buildDirPath, folderName);
        const nodeModulesPath = path.join(blockDirPath, 'node_modules', folderName);
        fsUtils.symlinkIfNeededAsync(folderPath, nodeModulesPath);
    }
}

async function transpileFileAsync(moduleName, moduleType, srcDirPath, destDirPath) {
    const srcFilePath = path.join(srcDirPath, moduleType, moduleName + '.js');
    const destFilePath = path.join(destDirPath, moduleType, moduleName + '.js');

    // Re-transpile if the file changed in the last minute, which helps
    // unbreak things if transpiling gets into a bad state and you restart.
    const srcFileStat = await fsUtils.statIfExistsAsync(srcFilePath);
    const destFileStat = await fsUtils.statIfExistsAsync(destFilePath);
    const slop = 1 * 60 * 1000; // 1 min
    if (destFileStat && (!srcFileStat || destFileStat.mtimeMs > srcFileStat.mtimeMs + slop)) {
        return;
    }

    const code = await fsUtils.readFileAsync(srcFilePath, 'utf8');
    const transpiledCode = Babel.transform(code, blockBabelConfig).code;
    await fsUtils.writeFileAsync(destFilePath, transpiledCode);
}

async function transpileBackendAndSharedCodeAsync(modules) {
    const modulesToTranspile = modules.filter(module => (
        module.metadata.type === 'backendRoute' ||
        module.metadata.type === 'shared'
    ));
    const blockDirPath = process.cwd();
    const buildDirPath = path.join(blockDirPath, blocksConfigSettings.BUILD_DIR);
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(buildDirPath);
    const backendBuildDirPath = path.join(buildDirPath, 'backendRoute');
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(backendBuildDirPath);
    const sharedBuildDirPath = path.join(buildDirPath, 'shared');
    await fsUtils.mkdirIfDoesntAlreadyExistAsync(sharedBuildDirPath);

    const transpilationPromises = [];
    for (const module of modulesToTranspile) {
        const transpilationPromise = transpileFileAsync(module.metadata.name, module.metadata.type, blockDirPath, buildDirPath);
        transpilationPromises.push(transpilationPromise);
    }
    await Promise.all(transpilationPromises);
}

async function setUpBackend() {
    // Parse block.json.
    const blockDirPath = process.cwd();
    const blockJson = await fsUtils.readFileAsync(path.join(blockDirPath, 'block.json'));
    const modules = JSON.parse(blockJson).modules;
    // Transpile all backend modules.
    await transpileBackendAndSharedCodeAsync(modules);
    // Symlink our backend and shared folders into node_modules so that
    // absolute paths will work for imports/requires.
    await symlinkBackendAndSharedFoldersAsync();
    // Create a routes object to store our backend modules so we can call
    // their handlers when we receive a request.
    const routes = await generateRoutesObjectFromModulesAsync(modules);

    // When we receive a request, call user code and send back the response.
    process.on('message', async event => {
        const response = await callUserCodeForEventAsync(event, routes);
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
