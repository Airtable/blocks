// @flow

const assert = require('assert');
const sinon = require('sinon');
const BlocksBackendEventHandler = require('../blocks_backend_event_handler');
const {
    BlocksBackendExecutionStatuses,
    getBlocksBackendExecutionStatus,
} = require('../blocks_backend_execution_status');
const normalizeBackendRouteResponse = require('../normalize_backend_route_response');

import type {BackendRoute, BlockJson} from '../types/block_json_type';
import type {BackendRouteHandler, BackendRouteResponse} from '../types/backend_route_types';
import type {LambdaEvent} from '../types/lambda_event_type';

// TODO(Chuan): Use mock and add tests when we integrate backend SDK wrapper.
const backendBlockSdkWrapperInstance = {
    __initializeSdkForEventAsync() {},
};

const EVENT_TEMPLATE: LambdaEvent = Object.freeze({
    method: '',
    query: {query: 'queryValue'},
    params: {param: 'paramValue'},
    path: '',
    body: 'body:1111111111111',
    headers: {'User-Agent': 'Test'},
    presignedS3UploadUrl: 'https://s3-upload/11111111',
    logKey: 'lk00000000000',
    blockInvocationId: 'bii11111111',
    kvValuesByKey: {},
    apiAccessPolicyString: 'aap22222222',
    applicationId: 'app333333333',
    blockInstallationId: 'bli444444444',
    apiBaseUrl: 'htts://test.com/api/',
});

/** Creates a BlocksBackendEventHandler that routes all requests to the provided handler. */
function createBlocksBackendEventHandlerForTesting(
    routes: Array<BackendRoute>,
    backendRouteHandler: BackendRouteHandler,
) {
    const blockJson: BlockJson = {
        version: '1.0',
        frontendEntry: 'dummy',
        routes,
    };
    return new BlocksBackendEventHandler({
        blockJson,
        backendBlockSdkWrapperInstance,
        // TODO(Chuan): Add tests for logs upload.
        enableUploadLogsToS3: false,
        resolveBackendRouteHandler() {
            return backendRouteHandler;
        },
    });
}

describe('BlocksBackendEventHandler', function() {
    describe('returns 404 if no routes match', function() {
        const backendRouteHandler = sinon.fake();
        const eventHandler = createBlocksBackendEventHandlerForTesting(
            [
                {
                    urlPath: '/foo/:fooId/bar/:barId',
                    handler: 'foo',
                    methods: ['post'],
                },
                {
                    urlPath: '/bar',
                    handler: 'bar',
                    methods: ['get'],
                },
            ],
            backendRouteHandler,
        );

        for (const [testName, path, method] of [
            ['path does not match', '/baz', 'get'],
            ['method does not match', '/bar', 'put'],
            ['extra characters in path', '/barbar', 'get'],
            ['missing params', '/foo/bar', 'post'],
            ['missing param', '/foo/123/bar', 'post'],
        ]) {
            it(`passes when ${testName}`, async function() {
                const resp = await eventHandler.handleEventAsync({...EVENT_TEMPLATE, path, method});
                assert.strictEqual(resp.statusCode, 404);
                assert(resp.body);
                assert(backendRouteHandler.notCalled);
                assert.strictEqual(
                    getBlocksBackendExecutionStatus(resp.headers),
                    BlocksBackendExecutionStatuses.NO_MATCHING_ROUTES,
                );
            });
        }
    });

    describe('returns 500 if user code throws', function() {
        const ERROR_MESSAGE = '123456789asdf';
        const backendRouteHandler = sinon.fake.throws(new Error(ERROR_MESSAGE));
        const eventHandler = createBlocksBackendEventHandlerForTesting(
            [
                {
                    urlPath: '/foo',
                    handler: 'foo',
                    methods: ['post'],
                },
            ],
            backendRouteHandler,
        );
        it('passes when user code throws Error', async function() {
            const resp = await eventHandler.handleEventAsync({
                ...EVENT_TEMPLATE,
                method: 'post',
                path: '/foo',
            });
            assert.strictEqual(resp.statusCode, 500);
            assert(resp.body);
            assert(resp.errorData);
            // flow-disable-next-line because we expect errorData to be populated.
            assert.strictEqual(resp.errorData.message, ERROR_MESSAGE);
            assert(backendRouteHandler.calledOnce);
            assert.strictEqual(
                getBlocksBackendExecutionStatus(resp.headers),
                BlocksBackendExecutionStatuses.HANDLER_EXECUTION_ERROR,
            );
        });
    });

    describe('executes user handler correctly', function() {
        for (const [
            testName: string,
            event: LambdaEvent,
            params: {[string]: string},
            backendRouteResponse: BackendRouteResponse,
        ] of [
            [
                'exact URL match and empty response',
                {...EVENT_TEMPLATE, path: '/bar', method: 'get'},
                {},
                {},
            ],
            [
                'parameterized URL match and empty response',
                {...EVENT_TEMPLATE, path: '/foo/123/bar/456', method: 'post'},
                {fooId: '123', barId: '456'},
                {},
            ],
            // TODO(Chuan): Add more tests.
        ]) {
            const backendRouteHandler = sinon.fake.returns(backendRouteResponse);
            const eventHandler = createBlocksBackendEventHandlerForTesting(
                [
                    {
                        urlPath: '/foo/:fooId/bar/:barId',
                        handler: 'foo',
                        methods: ['post'],
                    },
                    {
                        urlPath: '/bar',
                        handler: 'bar',
                        methods: ['get'],
                    },
                ],
                backendRouteHandler,
            );
            it(`passes with ${testName}`, async function() {
                const actualResponse = await eventHandler.handleEventAsync(event);
                assert(backendRouteHandler.calledOnce);
                assert(
                    backendRouteHandler.calledWithMatch({
                        method: event.method,
                        query: event.query,
                        params,
                        path: event.path,
                        body: event.body,
                        headers: event.headers,
                        _apiBaseUrl: event.apiBaseUrl,
                        _apiAccessPolicyString: event.apiAccessPolicyString,
                        _applicationId: event.applicationId,
                        _blockInstallationId: event.blockInstallationId,
                        _blockInvocationId: event.blockInvocationId,
                        _kvValuesByKey: event.kvValuesByKey,
                    }),
                );
                const expectedResponse = normalizeBackendRouteResponse(
                    backendRouteResponse,
                    BlocksBackendExecutionStatuses.SUCCESS,
                );
                assert.strictEqual(actualResponse.statusCode, expectedResponse.statusCode);
                assert.deepStrictEqual(actualResponse.body, expectedResponse.body);
                assert.strictEqual(
                    getBlocksBackendExecutionStatus(actualResponse.headers),
                    BlocksBackendExecutionStatuses.SUCCESS,
                );
                backendRouteHandler.resetHistory();
            });
        }
    });
    // TODO(Chuan): Add more tests.
});
