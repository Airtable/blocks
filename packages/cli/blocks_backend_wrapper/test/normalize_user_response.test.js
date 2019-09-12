// This test does not use Flow because a large portion of the code is testing
// invoking normalizeBackendRouteResponse with type errors.
const assert = require('assert');
const {
    BlocksBackendExecutionStatuses,
    createBlocksBackendExecutionStatusHeaders,
} = require('../blocks_backend_execution_status');
const normalizeBackendRouteResponse = require('../normalize_backend_route_response');

describe('normalizeBackendRouteResponse', () => {
    it('normalizes an empty object', function() {
        assert.deepStrictEqual(
            normalizeBackendRouteResponse({}, BlocksBackendExecutionStatuses.SUCCESS),
            {
                statusCode: 200,
                headers: createBlocksBackendExecutionStatusHeaders(
                    BlocksBackendExecutionStatuses.SUCCESS,
                ),
                body: Buffer.alloc(0),
            },
        );
    });

    it('normalizes a legal status code', function() {
        for (let statusCode = 100; statusCode <= 599; statusCode++) {
            assert.deepStrictEqual(
                normalizeBackendRouteResponse({statusCode}, BlocksBackendExecutionStatuses.SUCCESS),
                {
                    statusCode,
                    headers: createBlocksBackendExecutionStatusHeaders(
                        BlocksBackendExecutionStatuses.SUCCESS,
                    ),
                    body: Buffer.alloc(0),
                },
            );
        }
    });

    it('fails when passed a totally invalid status code', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {statusCode: null},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse({statusCode: ''}, BlocksBackendExecutionStatuses.SUCCESS),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {statusCode: NaN},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {statusCode: Infinity},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('fails when passed an illegal status code', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {statusCode: -200},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse({statusCode: 0}, BlocksBackendExecutionStatuses.SUCCESS),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse({statusCode: 99}, BlocksBackendExecutionStatuses.SUCCESS),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {statusCode: 600},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('normalizes headers in the new format', function() {
        const headers = ['X-Empty', '', 'X-Twice', 'wow', 'X-Once', 'good', 'X-Twice', 'really'];
        assert.deepStrictEqual(
            normalizeBackendRouteResponse({headers}, BlocksBackendExecutionStatuses.SUCCESS),
            {
                statusCode: 200,
                headers: {
                    'X-Empty': [''],
                    'X-Twice': ['wow', 'really'],
                    'X-Once': ['good'],
                    ...createBlocksBackendExecutionStatusHeaders(
                        BlocksBackendExecutionStatuses.SUCCESS,
                    ),
                },
                body: Buffer.alloc(0),
            },
        );
    });

    it('fails when passed an odd number of headers', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['X-Foo']},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['X-Foo', '', 'X-Bad']},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('fails when passed non-string header names or values', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['X-Foo', 123]},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: [123, 'value']},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['X-Foo', undefined]},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['X-Foo', ['boo']]},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('fails when passed non-array headers', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse({headers: null}, BlocksBackendExecutionStatuses.SUCCESS),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: 'X-Foo'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('fails when header names are banned', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['conNection', 'banned']},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['Date', 'banned']},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {headers: ['via', 'banned']},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    // TODO(Chuan): Add tests for body values after implementing base64-encoding logic.
});
