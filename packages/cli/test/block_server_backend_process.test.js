// @flow

const assert = require('assert');
const express = require('express');
const invariant = require('invariant');
const path = require('path');
const blockCliConfigSettings = require('../src/config/block_cli_config_settings');
const childProcessHelpers = require('../src/helpers/child_process_helpers');
const {BackendProcessResponseTypes} = require('../src/types/block_server_backend_process_types');

import type {ChildProcess} from 'child_process';
import type {$Request, $Response} from 'express';
import type {Server} from 'http';
import type {
    BackendProcessOptions,
    BackendProcessRequest,
    BackendProcessEventResponse,
    BackendProcessReadyResponse,
    BackendProcessResponse,
} from '../src/types/block_server_backend_process_types';

// TODO(Chuan): Use mock and add tests when we integrate backend SDK wrapper.
const BACKEND_SDK_STRING = `
class DummyBackendBlockSdkWrapper {
    __initializeSdkForEventAsync() {}
}
module.exports = DummyBackendBlockSdkWrapper;
`;

// Construct an Express app that serves the backend SDK wrapper code.
const backendSdkApp = express();
backendSdkApp.get(blockCliConfigSettings.BACKEND_SDK_URL_PATH, (req: $Request, res: $Response) => {
    res.send(BACKEND_SDK_STRING);
});

/** Creates a block server backend process. */
function createBackendProcessForTesting(backendSdkServerPort: number) {
    // Create backend process.
    const backendProcessModulePath = path.join(
        __dirname,
        '..',
        'transpiled',
        'src',
        'block_server_backend_process',
    );
    const backendProcessOptions: BackendProcessOptions = {
        blockJson: {
            version: '1.0',
            frontendEntry: 'dummy',
            routes: [
                {urlPath: '/echo', handler: 'echo', methods: ['get']},
                {urlPath: '/throw', handler: 'throw', methods: ['post']},
                {urlPath: '/invalid', handler: 'this_handler_does_not_exist', methods: ['post']},
                {urlPath: '/check-backend-sdk', handler: 'check_backend_sdk', methods: ['post']},
            ],
        },
        blockDirPath: path.join(__dirname, '..', 'transpiled', 'test', 'handlers'),
        backendSdkBaseUrl: `http://localhost:${backendSdkServerPort}`,
    };
    const backendProcess = childProcessHelpers.fork(backendProcessModulePath, [
        JSON.stringify(backendProcessOptions),
    ]);

    // Set up a function that yields the next message from the backend process.
    let resolveNextResponse: BackendProcessResponse => void;
    let nextResponsePromise: Promise<BackendProcessResponse> = new Promise(resolve => {
        resolveNextResponse = resolve;
    });
    backendProcess.on('message', (message: BackendProcessResponse) => {
        invariant(resolveNextResponse, 'resolveNextResponse');
        resolveNextResponse(message);
        nextResponsePromise = new Promise(resolve => {
            resolveNextResponse = resolve;
        });
    });
    return {backendProcess, nextResponse: () => nextResponsePromise};
}

const BACKEND_PROCESS_REQUEST_TEMPLATE: BackendProcessRequest = Object.freeze({
    requestId: 'req123456',
    method: 'GET',
    query: {},
    path: 'dummy',
    body: 'dummy',
    headers: {},
    presignedS3UploadUrl: 'dummy',
    logKey: 'dummy',
    blockInvocationId: 'dummy',
    // kvValuesByKey will be void if the kv data couldn't fit into the request
    // due to payload limits.
    kvValuesByKey: {},
    apiAccessPolicyString: 'dummy',
    applicationId: 'app123456',
    blockInstallationId: 'bli123456',
    apiBaseUrl: 'http://dummy',
});

describe('Block server backend process', function() {
    let backendSdkServer: Server;
    let backendProcess: ChildProcess;
    let nextResponse: () => Promise<BackendProcessResponse>;

    beforeEach(async function() {
        const error = await new Promise<?Error>(resolve => {
            const serverOrUndefined = backendSdkApp.listen(0, 'localhost', resolve);
            invariant(serverOrUndefined, 'serverOrUndefined');
            backendSdkServer = serverOrUndefined;
        });
        if (error) {
            throw error;
        }
        ({backendProcess, nextResponse} = createBackendProcessForTesting(
            backendSdkServer.address().port,
        ));
    });

    afterEach(function() {
        backendProcess.disconnect();
        return new Promise(resolve => {
            backendSdkServer.close(resolve);
        });
    });

    it('initializes correctly', async function() {
        // eslint-disable-next-line flowtype/no-weak-types
        const resp: BackendProcessReadyResponse = (await nextResponse(): any);
        assert.strictEqual(resp.messageType, BackendProcessResponseTypes.READY);
        assert.notEqual(resp.pid, 0);
    });

    it('processes requests correctly', async function() {
        // Skip initial ready message.
        await nextResponse();

        const req: BackendProcessRequest = {
            ...BACKEND_PROCESS_REQUEST_TEMPLATE,
            method: 'GET',
            path: '/echo',
            body: 'foo bar baz',
        };
        backendProcess.send(req);
        // eslint-disable-next-line flowtype/no-weak-types
        const resp: BackendProcessEventResponse = (await nextResponse(): any);
        assert.strictEqual(resp.messageType, BackendProcessResponseTypes.EVENT_RESPONSE);
        assert.strictEqual(resp.requestId, req.requestId);
        assert.strictEqual(resp.statusCode, 200);
        assert.strictEqual(resp.body, req.body);
    });

    it('should not crash if user code throws exception', async function() {
        // Skip initial ready message.
        await nextResponse();

        const req: BackendProcessRequest = {
            ...BACKEND_PROCESS_REQUEST_TEMPLATE,
            method: 'POST',
            path: '/throw',
        };
        backendProcess.send(req);
        // eslint-disable-next-line flowtype/no-weak-types
        const resp: BackendProcessEventResponse = (await nextResponse(): any);
        assert.strictEqual(resp.messageType, BackendProcessResponseTypes.EVENT_RESPONSE);
        assert.strictEqual(resp.requestId, req.requestId);
        assert.strictEqual(resp.statusCode, 500);
    });

    it('should not crash if handler does not exist', async function() {
        // Skip initial ready message.
        await nextResponse();

        const req: BackendProcessRequest = {
            ...BACKEND_PROCESS_REQUEST_TEMPLATE,
            method: 'POST',
            path: '/invalid',
        };
        backendProcess.send(req);
        // eslint-disable-next-line flowtype/no-weak-types
        const resp: BackendProcessEventResponse = (await nextResponse(): any);
        assert.strictEqual(resp.messageType, BackendProcessResponseTypes.EVENT_RESPONSE);
        assert.strictEqual(resp.requestId, req.requestId);
        assert.strictEqual(resp.statusCode, 500);
    });

    it('injects backend SDK', async function() {
        // Skip initial ready message.
        await nextResponse();

        const req: BackendProcessRequest = {
            ...BACKEND_PROCESS_REQUEST_TEMPLATE,
            method: 'POST',
            path: '/check-backend-sdk',
            body: 'foo bar baz',
        };
        backendProcess.send(req);
        // eslint-disable-next-line flowtype/no-weak-types
        const resp: BackendProcessEventResponse = (await nextResponse(): any);
        assert.strictEqual(resp.messageType, BackendProcessResponseTypes.EVENT_RESPONSE);
        assert.strictEqual(resp.requestId, req.requestId);
        assert.strictEqual(resp.statusCode, 200);
        assert.strictEqual(resp.body, 'DummyBackendBlockSdkWrapper');
    });
});
