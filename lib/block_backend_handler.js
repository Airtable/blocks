const pathToRegexp = require('path-to-regexp');
const fs = require('fs');
const path = require('path');
const BlockBackendMessageTypes = require('./block_backend_message_types');

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

async function callUserCodeForEvent(event, routes) {
    const blockDirPath = process.cwd();

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
        const routeHandlerModule = require(path.join(blockDirPath, 'backendRoute', route.metadata.name));
        const handler = routeHandlerModule;

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
        console.warn(err.stack);
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

function setUpBackend() {
    // Parse block.json
    const blockDirPath = process.cwd();
    const blockJson = fs.readFileSync(path.join(blockDirPath, 'block.json'));
    const modules = JSON.parse(blockJson).modules;
    const backendModules = modules.filter(module => module.metadata.type === 'backendRoute');
    // Create a routes object to store backend routes
    const routes = {};
    for (const backendModule of backendModules) {
        routes[backendModule.id] = backendModule;
    }

    process.on('message', async (event) => {
        const response = await callUserCodeForEvent(event, routes);
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
