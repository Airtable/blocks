module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'react/prop-types': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
