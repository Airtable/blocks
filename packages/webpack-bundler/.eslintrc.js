const path = require('path');

module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: [
            path.join(__dirname, './tsconfig.json'),
            path.join(__dirname, './test/tsconfig.json'),
        ],
        sourceType: 'module',
    },
    rules: {
        'no-console': 'warn',
    },
};
