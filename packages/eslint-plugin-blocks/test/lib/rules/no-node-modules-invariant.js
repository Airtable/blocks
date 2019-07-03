const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-node-modules-invariant');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: '2017',
        sourceType: 'module',
    },
});

ruleTester.run('no-node-modules-invariant', rule, {
    valid: ['require("./invariant")', 'import invariant from "./invariant";'],
    invalid: [
        {
            code: 'require("invariant")',
            errors: [
                {
                    message:
                        'Cannot require "invariant" from node_modules - use our custom invariant instead',
                    type: 'CallExpression',
                    line: 1,
                    column: 1,
                },
            ],
        },
        {
            code: 'import invariant from "invariant";',
            errors: [
                {
                    message:
                        'Cannot require "invariant" from node_modules - use our custom invariant instead',
                    type: 'ImportDeclaration',
                    line: 1,
                    column: 1,
                },
            ],
        },
    ],
});
