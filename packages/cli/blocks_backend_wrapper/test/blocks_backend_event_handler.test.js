// @flow

const assert = require('assert');
const sinon = require('sinon');
const BlocksBackendEventHandler = require('../blocks_backend_event_handler');
const {
    BlocksBackendExecutionStatuses,
    getBlocksBackendExecutionStatus,
} = require('../blocks_backend_execution_status');
const {normalizeBackendRouteResponse} = require('../normalize_backend_route_response');

import type {BackendRoute, BlockJson} from '../types/block_json_type';
import type {BackendRouteHandler, BackendRouteResponse} from '../types/backend_route_types';
import type {LambdaEvent} from '../types/lambda_event_type';

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
    region: 'us-east-1',
});

/** Creates a BlocksBackendEventHandler that routes all requests to the provided handler. */
function createBlocksBackendEventHandlerForTesting(
    backendBlockSdkWrapperInstanceMock: any, // eslint-disable-line flowtype/no-weak-types
    routes: Array<BackendRoute>,
    backendRouteHandler: BackendRouteHandler,
    developerCredentialByNameIfExists: {[string]: string} | null,
): BlocksBackendEventHandler {
    const blockJson: BlockJson = {
        version: '1.0',
        frontendEntry: 'dummy',
        routes,
    };
    return new BlocksBackendEventHandler({
        blockJson,
        backendBlockSdkWrapperInstance: backendBlockSdkWrapperInstanceMock,
        // TODO(Chuan): Add tests for logs upload.
        enableUploadLogsToS3: false,
        developerCredentialByNameIfExists,
        resolveBackendRouteHandler() {
            return backendRouteHandler;
        },
    });
}

describe('BlocksBackendEventHandler', function() {
    let sinonSandbox;
    let backendBlockSdkWrapperInstanceStub;
    beforeEach(async function() {
        sinonSandbox = sinon.createSandbox();
        backendBlockSdkWrapperInstanceStub = sinonSandbox.stub({
            __initializeSdkForEventAsync: function() {},
        });
    });
    afterEach(async function() {
        sinonSandbox.restore();
    });
    describe('developer credentials', function() {
        it('calls __initializeSdkForEventAsync with provided credentials', async function() {
            const developerCredentialByName = {
                superSecret: 'super secret value',
            };
            const eventHandler = createBlocksBackendEventHandlerForTesting(
                backendBlockSdkWrapperInstanceStub,
                [
                    {
                        urlPath: '/bar',
                        handler: 'bar',
                        methods: ['get'],
                    },
                ],
                sinonSandbox.fake.returns({}),
                developerCredentialByName,
            );

            await eventHandler.handleEventAsync({
                ...EVENT_TEMPLATE,
                method: 'get',
                path: '/bar',
            });

            assert(
                backendBlockSdkWrapperInstanceStub.__initializeSdkForEventAsync.calledOnceWith(
                    {
                        ...EVENT_TEMPLATE,
                        method: 'get',
                        path: '/bar',
                    },
                    {
                        superSecret: 'super secret value',
                    },
                ),
            );
        });

        it('if null credentials provided, calls __initializeSdkForEventAsync with an empty object for credentials', async function() {
            const eventHandler = createBlocksBackendEventHandlerForTesting(
                backendBlockSdkWrapperInstanceStub,
                [
                    {
                        urlPath: '/bar',
                        handler: 'bar',
                        methods: ['get'],
                    },
                ],
                sinonSandbox.fake.returns({}),
                null,
            );

            await eventHandler.handleEventAsync({
                ...EVENT_TEMPLATE,
                method: 'get',
                path: '/bar',
            });

            assert(
                backendBlockSdkWrapperInstanceStub.__initializeSdkForEventAsync.calledOnceWith(
                    {
                        ...EVENT_TEMPLATE,
                        method: 'get',
                        path: '/bar',
                    },
                    {},
                ),
            );
        });
    });

    for (const [testName, path, method] of [
        ['path does not match', '/baz', 'get'],
        ['method does not match', '/bar', 'put'],
        ['extra characters in path', '/barbar', 'get'],
        ['missing params', '/foo/bar', 'post'],
        ['missing param', '/foo/123/bar', 'post'],
    ]) {
        describe('returns 404 if no routes match', function() {
            let backendRouteHandler;
            let eventHandler: BlocksBackendEventHandler;
            beforeEach(async function() {
                backendRouteHandler = sinonSandbox.fake();
                eventHandler = createBlocksBackendEventHandlerForTesting(
                    backendBlockSdkWrapperInstanceStub,
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
                    null,
                );
            });

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
        });
    }

    describe('returns 500 if user code throws', function() {
        const ERROR_MESSAGE = '123456789asdf';
        let backendRouteHandler;
        let eventHandler: BlocksBackendEventHandler;
        beforeEach(async function() {
            backendRouteHandler = sinonSandbox.fake.throws(new Error(ERROR_MESSAGE));
            eventHandler = createBlocksBackendEventHandlerForTesting(
                backendBlockSdkWrapperInstanceStub,
                [
                    {
                        urlPath: '/foo',
                        handler: 'foo',
                        methods: ['post'],
                    },
                ],
                backendRouteHandler,
                null,
            );
        });

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
        describe(`executes user handler correctly: ${testName}`, function() {
            let backendRouteHandler;
            let eventHandler: BlocksBackendEventHandler;
            beforeEach(async function() {
                backendRouteHandler = sinonSandbox.fake.returns(backendRouteResponse);
                eventHandler = createBlocksBackendEventHandlerForTesting(
                    backendBlockSdkWrapperInstanceStub,
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
                    null,
                );
            });

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
                        region: event.region,
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
            });
        });
    }
    // TODO(Chuan): Add more tests.
});
