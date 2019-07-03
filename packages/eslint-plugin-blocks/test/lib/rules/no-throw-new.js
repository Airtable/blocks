const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-throw-new');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: '2017',
    },
});

ruleTester.run('no-throw-new', rule, {
    valid: ['throw myError;', 'throw spawnError();'],
    invalid: [
        {
            code: 'throw new Error()',
            errors: [
                {
                    message: 'Unexpected throw new, use throw spawnError() instead',
                    type: 'ThrowStatement',
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            code: 'throw new TypeError()',
            errors: [
                {
                    message: 'Unexpected throw new, use throw spawnError() instead',
                    type: 'ThrowStatement',
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            code: 'throw new Whatever',
            errors: [
                {
                    message: 'Unexpected throw new, use throw spawnError() instead',
                    type: 'ThrowStatement',
                    line: 1,
                    column: 1,
                },
            ],
        },
    ],
});
