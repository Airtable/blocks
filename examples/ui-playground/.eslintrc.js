const path = require('path');

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        babelOptions: {
            configFile: path.join(__dirname, 'babel.config.js'),
        },
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@airtable/blocks', 'react', 'flowtype', 'react-hooks'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        'flowtype/array-style-complex-type': 'error',
        'flowtype/array-style-simple-type': 'error',
        'flowtype/define-flow-type': 'error',
        'flowtype/no-primitive-constructor-types': 'error',
        'flowtype/no-weak-types': 'warn',
        'flowtype/require-valid-file-annotation': ['error', 'always'],
        'flowtype/type-import-style': ['error', 'identifier', {ignoreTypeDefault: true}],
        'flowtype/use-flow-type': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
