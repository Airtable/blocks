import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import {defineConfig} from 'eslint/config';

export default defineConfig([
    {files: ['**/*.{js,mjs,cjs,jsx}'], plugins: {js}, extends: ['js/recommended']},
    {files: ['**/*.{js,mjs,cjs,jsx}'], languageOptions: {globals: globals.browser}},
    pluginReact.configs.flat.recommended,
    pluginReact.configs.flat['jsx-runtime'],
    pluginReactHooks.configs['recommended-latest'],
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        rules: {
            'react/prop-types': 'off',
        },
    },
]);
