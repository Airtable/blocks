// @flow
const normalizeUserResponse = require('../src/normalize_user_response');
const assert = require('assert');

describe('normalizeUserResponse', () => {
	function assertUnsuccessful(value) {
        assert.deepStrictEqual(Object.keys(value), ['statusCode', 'headers', 'body']);
        assert.strictEqual(value.statusCode, 500);
        assert.deepStrictEqual(value.headers, {
            'Content-Type': ['application/json; charset=utf-8'],
        });
        assert(value.body instanceof Buffer);
        const parsedBody = JSON.parse(value.body);
        assert.deepStrictEqual(Object.keys(parsedBody), ['error', 'message']);
        assert.strictEqual(parsedBody.error, 'SERVER_ERROR');
        assert.strictEqual(typeof parsedBody.message, 'string');
    }

    it('normalizes an empty object', function() {
        assert.deepStrictEqual(normalizeUserResponse({}), {
            statusCode: 200,
            headers: {},
            body: Buffer.alloc(0),
        });
    });

    it('normalizes a legal status code', function() {
        for (let statusCode = 100; statusCode <= 599; statusCode++) {
            assert.deepStrictEqual(normalizeUserResponse({statusCode}), {
                statusCode,
                headers: {},
                body: Buffer.alloc(0),
            });
        }
    });

    it('fails when passed a totally invalid status code', function() {
        assertUnsuccessful(normalizeUserResponse({statusCode: undefined}));
        assertUnsuccessful(normalizeUserResponse({statusCode: null}));
        assertUnsuccessful(normalizeUserResponse({statusCode: ''}));
        assertUnsuccessful(normalizeUserResponse({statusCode: '200'}));
        assertUnsuccessful(normalizeUserResponse({statusCode: NaN}));
        assertUnsuccessful(normalizeUserResponse({statusCode: Infinity}));
    });

	it('fails when passed an illegal status code', function() {
        assertUnsuccessful(normalizeUserResponse({statusCode: -200}));
        assertUnsuccessful(normalizeUserResponse({statusCode: 0}));
        assertUnsuccessful(normalizeUserResponse({statusCode: 99}));
        assertUnsuccessful(normalizeUserResponse({statusCode: 600}));
	});

    it('normalizes headers in the new format', function() {
        const headers = [
            'X-Empty', '',
            'X-Twice', 'wow',
            'X-Once', 'good',
            'X-Twice', 'really',
        ];
        assert.deepStrictEqual(normalizeUserResponse({headers}), {
            statusCode: 200,
            headers: {
                'X-Empty': [''],
                'X-Twice': ['wow', 'really'],
                'X-Once': ['good'],
            },
            body: Buffer.alloc(0),
        });
    });

    it('fails when passed an odd number of headers', function() {
        assertUnsuccessful(normalizeUserResponse({headers: ['X-Foo']}));
        assertUnsuccessful(normalizeUserResponse({headers: ['X-Foo', '', 'X-Bad']}));
    });

    it('fails when passed non-string header names or values', function() {
        assertUnsuccessful(normalizeUserResponse({headers: ['X-Foo', 123]}));
        assertUnsuccessful(normalizeUserResponse({headers: [123, 'value']}));
        assertUnsuccessful(normalizeUserResponse({headers: ['X-Foo', undefined]}));
        assertUnsuccessful(normalizeUserResponse({headers: ['X-Foo', ['boo']]}));
    });

    it('fails when passed non-array headers', function() {
        assertUnsuccessful(normalizeUserResponse({headers: undefined}));
        assertUnsuccessful(normalizeUserResponse({headers: null}));
        assertUnsuccessful(normalizeUserResponse({headers: 'X-Foo'}));
        assertUnsuccessful(normalizeUserResponse({
            headers: {'X-Foo': 'boo'},
        }));
    });

    it('fails when header names are banned', function() {
        assertUnsuccessful(normalizeUserResponse({headers: ['conNection', 'banned']}));
        assertUnsuccessful(normalizeUserResponse({headers: ['Date', 'banned']}));
        assertUnsuccessful(normalizeUserResponse({headers: ['via', 'banned']}));
    });

    it('normalizes base64-encoded bodies', function() {
        assert.deepStrictEqual(normalizeUserResponse({
            bodyFormat: 'base64',
            body: '',
        }), {
            statusCode: 200,
            headers: {},
            body: Buffer.alloc(0),
        });
        assert.deepStrictEqual(normalizeUserResponse({
            bodyFormat: 'base64',
            body: Buffer.from('hello').toString('base64'),
        }), {
            statusCode: 200,
            headers: {},
            body: Buffer.from('hello'),
        });
    });

    it("fails when bodyFormat isn't 'base64' (if there is a body)", function() {
        assertUnsuccessful(normalizeUserResponse({
            body: '',
        }));
        assertUnsuccessful(normalizeUserResponse({
            body: 'something',
        }));
        assertUnsuccessful(normalizeUserResponse({
            bodyFormat: '',
            body: 'something',
        }));
        assertUnsuccessful(normalizeUserResponse({
            bodyFormat: 'BASE64',
            body: 'something',
        }));
    });

    it("fails when the body isn't a string", function() {
        assertUnsuccessful(normalizeUserResponse({
            bodyFormat: 'base64',
            body: undefined,
        }));
        assertUnsuccessful(normalizeUserResponse({
            bodyFormat: 'base64',
            body: null,
        }));
        assertUnsuccessful(normalizeUserResponse({
            bodyFormat: 'base64',
            body: {oh: 'we bad'},
        }));
    });

    it('fails when the body is obviously not base64-encoded', function() {
        assertUnsuccessful(normalizeUserResponse({
            bodyFormat: 'base64',
            body: '{"oh": "no"}',
        }));
    });
});
