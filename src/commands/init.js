// @flow
/* eslint-disable no-console */
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const nodeModulesCommandHelpers = require('../helpers/node_modules_command_helpers');
const parseBlockIdentifier = require('../helpers/parse_block_identifier');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');
const SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
const chalk = require('chalk');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const path = require('path');
const invariant = require('invariant');
const {camelCase, upperFirst} = require('lodash');

import type {Argv} from 'yargs';
import type {Environment} from '../types/environments';
import type {BlockJson} from '../types/block_json_type';
import type {RemoteJson} from '../types/remote_json_type';

const DEFAULT_FRONTEND_ENTRY_NAME = 'index';

function getDefaultFrontendCode(blockDirPath: string): string {
    let componentName = upperFirst(camelCase(path.basename(blockDirPath)));
    if (!componentName.includes('Block')) {
        componentName = `${componentName}Block`;
    }

    return `import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';

function ${componentName}() {
    // YOUR CODE GOES HERE
    return (
        <div>Hello world 🚀</div>
    );
}

initializeBlock(() => <${componentName} />);
`;
}

function getDefaultEslintConfig(): string {
    // `eslint --init` is interactive and requires several selections + manual editing of the eslint
    // file to configure plugins, so we use a hardcoded default config here instead.
    // These are the default settings for a React project, plus the default settings for react-hooks
    return `module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    }
};`;
}

async function _writeDefaultFrontendFilesAsync(blockDirPath: string): Promise<void> {
    const frontendDirPath = path.join(blockDirPath, SupportedTopLevelDirectoryNames.FRONTEND);
    await fsUtils.mkdirAsync(frontendDirPath);
    await fsUtils.writeFileAsync(
        path.join(frontendDirPath, `${DEFAULT_FRONTEND_ENTRY_NAME}.js`),
        getDefaultFrontendCode(blockDirPath),
    );
}

async function initBlockAsync(
    baseId: string,
    blockId: string,
    blockDirPath: string,
    apiKey: string,
): Promise<void> {
    // Make a new directory for the block.
    await fsUtils.mkdirAsync(blockDirPath);

    // Create the block.json file.
    // TODO(richsinn): Add workflow to scaffold 'backend' routes with default files here.
    const blockJson: BlockJson = {
        frontendEntry: `./${SupportedTopLevelDirectoryNames.FRONTEND}/${DEFAULT_FRONTEND_ENTRY_NAME}.js`,
    };
    const writeBlockJsonPromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
        JSON.stringify(blockJson, null, 4),
    );

    const writeDefaultFrontendFilesPromise = _writeDefaultFrontendFilesAsync(blockDirPath);

    // Create the .block/remote.json file.
    const remoteJson: RemoteJson = {
        blockId,
        baseId,
    };
    const blockConfigDirPath = path.join(blockDirPath, blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME);
    await fsUtils.mkdirPathAsync(blockConfigDirPath);
    const writeRemoteJsonPromise = fsUtils.writeFileAsync(
        path.join(blockConfigDirPath, blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH),
        JSON.stringify(remoteJson, null, 4),
    );

    // Write the API key to the file system.
    const writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
        apiKey,
    );

    // Create a package json so the user can `yarn add`.
    // Dependencies are specified as part of the `yarn add` to install the latest versions: this
    // file is created first so that the dependencies are saved in the correct folder.
    const writePackageJsonPromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, 'package.json'),
        JSON.stringify(
            {
                private: true,
                scripts: {
                    lint: 'eslint frontend',
                },
            },
            null,
            4,
        ),
    );

    // Create a .gitignore file.
    const gitignoreContents = [
        'node_modules',
        blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
        blockCliConfigSettings.BUILD_DIR,
    ];
    const writeGitignoreFilePromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, '.gitignore'),
        gitignoreContents.join('\n'),
    );

    // Create a .eslintrc.js file.
    const writeEslintFilePromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, '.eslintrc.js'),
        getDefaultEslintConfig(),
    );

    await Promise.all([
        writeBlockJsonPromise,
        writeRemoteJsonPromise,
        writeDefaultFrontendFilesPromise,
        writePackageJsonPromise,
        writeGitignoreFilePromise,
        writeAirtableApiKeyFilePromise,
        writeEslintFilePromise,
    ]);

    // TODO: consider not piping `yarn add` output so that `block init` is less verbose.
    await nodeModulesCommandHelpers.yarnInstallAsync(blockDirPath, ['add', '@airtable/blocks', 'react', 'react-dom', '--non-interactive']);
    await nodeModulesCommandHelpers.yarnInstallAsync(blockDirPath, ['add', 'eslint', 'eslint-plugin-react', 'eslint-plugin-react-hooks', '--dev', '--non-interactive']);
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const {blockIdentifier, blockDirPath, environment} = argv;
    invariant(typeof blockIdentifier === 'string', 'expects blockIdentifier to be a string');
    invariant(typeof blockDirPath === 'string', 'expects blockDirPath to be a string');
    invariant(typeof environment === 'string', 'expects environment to be a string');
    const blockIdentifierParseResult = parseBlockIdentifier(blockIdentifier);
    if (!blockIdentifierParseResult.success) {
        throw blockIdentifierParseResult.error;
    }
    const {baseId, blockId} = blockIdentifierParseResult.value;

    // Lets validate that the given blockDir doesn't already have something in it.
    const doesBlockDirExist = fs.existsSync(blockDirPath);
    if (doesBlockDirExist) {
        throw new Error(`A directory already exists at ${blockDirPath}`);
    }

    // Prompt for apiKey.
    const apiKey = await promptForApiKeyAsync(
        ((environment: any): Environment), // eslint-disable-line flowtype/no-weak-types
    );

    console.log('Initializing block');
    await initBlockAsync(
        baseId,
        blockId,
        blockDirPath,
        apiKey,
    );
    console.log(`✅ Your block is ready! ${chalk.bold('cd ' + blockDirPath + ' && block run')} to start developing, and ${chalk.bold('yarn lint')} to lint.`);
}

module.exports = {runCommandAsync};
