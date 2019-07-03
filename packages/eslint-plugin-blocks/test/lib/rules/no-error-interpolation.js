const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-error-interpolation');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: '2017',
    },
});

const options = [
    {
        spawnError: 0,
        invariant: 1,
    },
];

ruleTester.run('no-error-interpolation', rule, {
    valid: [
        {code: 'invariant(null, "hello world")', options},
        {code: 'invariant(null, "hello %s", "world")', options},
        {code: 'spawnError("hello world")', options},
        {code: 'spawnError("hello %s", ["world"])', options},
        {code: 'someNamespace.invariant(null, "hello world")', options},
        {code: 'someNamespace.invariant(null, "hello %s", "world")', options},
        {code: 'someNamespace.spawnError("hello world")', options},
        {code: 'someNamespace.spawnError("hello %s", ["world"])', options},
    ],
    invalid: [
        {
            code: 'invariant(null, `hello, ${world}`)',
            errors: [
                {
                    message:
                        'Unexpected string interpolation in error message, use %s placeholders to interpolate instead',
                    type: 'CallExpression',
                    line: 1,
                    column: 1,
                },
            ],
            options,
        },
        {
            code: 'spawnError(`hello, ${world}`)',
            errors: [
                {
                    message:
                        'Unexpected string interpolation in error message, use %s placeholders to interpolate instead',
                    type: 'CallExpression',
                    line: 1,
                    column: 1,
                },
            ],
            options,
        },
        {
            code: 'someNamespace.invariant(null, `hello, ${world}`)',
            errors: [
                {
                    message:
                        'Unexpected string interpolation in error message, use %s placeholders to interpolate instead',
                    type: 'CallExpression',
                    line: 1,
                    column: 1,
                },
            ],
            options,
        },
        {
            code: 'someNamespace.spawnError(`hello, ${world}`)',
            errors: [
                {
                    message:
                        'Unexpected string interpolation in error message, use %s placeholders to interpolate instead',
                    type: 'CallExpression',
                    line: 1,
                    column: 1,
                },
            ],
            options,
        },
    ],
});
