// This test does not use Flow because a large portion of the code is testing
// invoking normalizeBackendRouteResponse with type errors.
const assert = require('assert');
const {
    BlocksBackendExecutionStatuses,
    createBlocksBackendExecutionStatusHeaders,
} = require('../blocks_backend_execution_status');
const {
    normalizeBackendRouteResponse,
    DEFAULT_CONTENT_TYPES,
    BASE64_ENCODED_RESPONSE_BODY_SIZE_LIMIT_BYTES,
} = require('../normalize_backend_route_response');

describe('normalizeBackendRouteResponse', () => {
    it('normalizes an empty object', function() {
        assert.deepStrictEqual(
            normalizeBackendRouteResponse({}, BlocksBackendExecutionStatuses.SUCCESS),
            {
                statusCode: 200,
                headers: {
                    ...createBlocksBackendExecutionStatusHeaders(
                        BlocksBackendExecutionStatuses.SUCCESS,
                    ),
                    'Content-Type': [DEFAULT_CONTENT_TYPES.STRING],
                },
                body: '',
                bodyFormat: 'base64',
            },
        );
    });

    it('normalizes a legal status code', function() {
        for (let statusCode = 100; statusCode <= 599; statusCode++) {
            assert.deepStrictEqual(
                normalizeBackendRouteResponse(
                    {statusCode, body: ''},
                    BlocksBackendExecutionStatuses.SUCCESS,
                ),
                {
                    statusCode,
                    headers: {
                        ...createBlocksBackendExecutionStatusHeaders(
                            BlocksBackendExecutionStatuses.SUCCESS,
                        ),
                        'Content-Type': [DEFAULT_CONTENT_TYPES.STRING],
                    },
                    body: '',
                    bodyFormat: 'base64',
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
                    'Content-Type': [DEFAULT_CONTENT_TYPES.STRING],
                },
                body: '',
                bodyFormat: 'base64',
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

    it('rejects unknown response body types', function() {
        for (const body of [
            new Date(),
            () => {},
            1234,
            null,
            NaN,
            new Error('error'),
            /a+/,
            new Map(),
            Promise.resolve(),
        ]) {
            assert.throws(() =>
                normalizeBackendRouteResponse({body}, BlocksBackendExecutionStatuses.SUCCESS),
            );
        }
    });

    it('handles Buffer as response body', function() {
        for (const body of [Buffer.from('hello world'), Buffer.alloc(0)]) {
            assert.deepStrictEqual(
                normalizeBackendRouteResponse({body}, BlocksBackendExecutionStatuses.SUCCESS),
                {
                    statusCode: 200,
                    headers: {
                        ...createBlocksBackendExecutionStatusHeaders(
                            BlocksBackendExecutionStatuses.SUCCESS,
                        ),
                        'Content-Type': [DEFAULT_CONTENT_TYPES.BINARY],
                    },
                    body: body.toString('base64'),
                    bodyFormat: 'base64',
                },
            );
        }
    });

    it('handles string as response body', function() {
        for (const body of ['hello world', '']) {
            assert.deepStrictEqual(
                normalizeBackendRouteResponse({body}, BlocksBackendExecutionStatuses.SUCCESS),
                {
                    statusCode: 200,
                    headers: {
                        ...createBlocksBackendExecutionStatusHeaders(
                            BlocksBackendExecutionStatuses.SUCCESS,
                        ),
                        'Content-Type': [DEFAULT_CONTENT_TYPES.STRING],
                    },
                    body: Buffer.from(body).toString('base64'),
                    bodyFormat: 'base64',
                },
            );
        }
    });

    it('handles object or array as response body', function() {
        for (const body of [
            {},
            {key: 'value', key2: new Date()},
            [],
            ['hi', 'there', 1, null, new Date(), {}, {key: 'value', key2: new Date()}],
        ]) {
            assert.deepStrictEqual(
                normalizeBackendRouteResponse({body}, BlocksBackendExecutionStatuses.SUCCESS),
                {
                    statusCode: 200,
                    headers: {
                        ...createBlocksBackendExecutionStatusHeaders(
                            BlocksBackendExecutionStatuses.SUCCESS,
                        ),
                        'Content-Type': [DEFAULT_CONTENT_TYPES.JSON],
                    },
                    body: Buffer.from(JSON.stringify(body)).toString('base64'),
                    bodyFormat: 'base64',
                },
            );
        }
    });

    it('respects Content-Type header specified by handler', function() {
        for (const [contentTypeKey, contentTypeValue] of [
            ['Content-Type', 'text/plain'],
            ['content-type', ''],
            ['CONTENT-TYPE', ['image/png']],
            ['cOnTeNt-tYpE', ['asdfasdf']],
        ]) {
            assert.deepStrictEqual(
                normalizeBackendRouteResponse(
                    {headers: {[contentTypeKey]: contentTypeValue}, body: ''},
                    BlocksBackendExecutionStatuses.SUCCESS,
                ),
                {
                    statusCode: 200,
                    headers: {
                        ...createBlocksBackendExecutionStatusHeaders(
                            BlocksBackendExecutionStatuses.SUCCESS,
                        ),
                        [contentTypeKey]: Array.isArray(contentTypeValue)
                            ? contentTypeValue
                            : [contentTypeValue],
                    },
                    body: '',
                    bodyFormat: 'base64',
                },
            );
        }
    });

    it('rejects response if body is too large', function() {
        const body = Buffer.alloc(10 * 1024 * 1024 /* 10MB */);
        assert(body.toString('base64').length > BASE64_ENCODED_RESPONSE_BODY_SIZE_LIMIT_BYTES);
        assert.throws(() =>
            normalizeBackendRouteResponse({body}, BlocksBackendExecutionStatuses.SUCCESS),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {body: body.toString('base64')},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {body: {text: body.toString('base64')}},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('handles base64-encoded body', function() {
        const body = Buffer.from('hello').toString('base64');
        assert.deepStrictEqual(
            normalizeBackendRouteResponse(
                {body, bodyFormat: 'base64'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
            {
                statusCode: 200,
                headers: createBlocksBackendExecutionStatusHeaders(
                    BlocksBackendExecutionStatuses.SUCCESS,
                ),
                body,
                bodyFormat: 'base64',
            },
        );
        assert.deepStrictEqual(
            normalizeBackendRouteResponse(
                {body: '', bodyFormat: 'base64'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
            {
                statusCode: 200,
                headers: createBlocksBackendExecutionStatusHeaders(
                    BlocksBackendExecutionStatuses.SUCCESS,
                ),
                body: '',
                bodyFormat: 'base64',
            },
        );
        assert.deepStrictEqual(
            normalizeBackendRouteResponse(
                {bodyFormat: 'base64'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
            {
                statusCode: 200,
                headers: createBlocksBackendExecutionStatusHeaders(
                    BlocksBackendExecutionStatuses.SUCCESS,
                ),
                body: '',
                bodyFormat: 'base64',
            },
        );
    });

    it('rejects incorrectly base64-encoded body', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {body: '  ', bodyFormat: 'base64'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {body: '()', bodyFormat: 'base64'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('rejects incorrect bodyFormat value', function() {
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {body: '', bodyFormat: ''},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
        assert.throws(() =>
            normalizeBackendRouteResponse(
                {body: '', bodyFormat: 'asdf'},
                BlocksBackendExecutionStatuses.SUCCESS,
            ),
        );
    });

    it('is idempotent', function() {
        const normalizedResponse = normalizeBackendRouteResponse(
            {body: 'hello', headers: {'X-Key': 'Value'}},
            BlocksBackendExecutionStatuses.SUCCESS,
        );
        const doubleNormalizedResponse = normalizeBackendRouteResponse(normalizedResponse);
        const tripleNormalizedResponse = normalizeBackendRouteResponse(doubleNormalizedResponse);
        const quadrupleNormalizedResponse = normalizeBackendRouteResponse(tripleNormalizedResponse);
        assert.deepStrictEqual(normalizedResponse, doubleNormalizedResponse);
        assert.deepStrictEqual(normalizedResponse, tripleNormalizedResponse);
        assert.deepStrictEqual(normalizedResponse, quadrupleNormalizedResponse);
    });
});
