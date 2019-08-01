// @flow
/* eslint-disable no-console */
const os = require('os');
const CommandNames = require('./command_names');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const configHelpers = require('../helpers/config_helpers');
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
import type {BlockJson} from '../types/block_json_type';
import type {RemoteJson} from '../types/remote_json_type';

const DEFAULT_FRONTEND_ENTRY_NAME = 'index';

function _getComponentName(blockDirPath: string): string {
    // Convert the input block directory path into a valid function name for the React component
    // camelCase removes invalid symbols/spaces
    let componentName = upperFirst(camelCase(path.basename(blockDirPath)));
    if (!componentName.includes('Block')) {
        componentName = `${componentName}Block`;
    }
    if (isFinite(componentName[0])) {
        // Functions can't start with a number
        componentName = `My${componentName}`;
    }
    return componentName;
}

function _getDefaultFrontendCode(blockDirPath: string): string {
    const componentName = _getComponentName(blockDirPath);

    return `import {initializeBlock} from '${blockCliConfigSettings.SDK_PACKAGE_NAME}/ui';
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
        _getDefaultFrontendCode(blockDirPath),
    );
}

function _formatBlockRunMessage(blockDirPath: string): string {
    let blockRunMessage;
    if (os.platform() === 'win32') {
        // In Windows, chaining commands differ between PowerShell and CMD.exe.
        // There is neither a canonical nor simple way to detect if this process is being run in
        // PowerShell or CMD.exe so we present a generic message for Windows.
        blockRunMessage = chalk.bold(`cd ${blockDirPath}`) + ' then ' + chalk.bold('block run');
    } else {
        blockRunMessage = chalk.bold(`cd ${blockDirPath} && block run`);
    }

    return blockRunMessage;
}

async function initBlockAsync(
    baseId: string,
    blockId: string,
    blockDirPath: string,
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
    const blockConfigDirPath = path.join(
        blockDirPath,
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
    );
    await fsUtils.mkdirPathAsync(blockConfigDirPath);
    const writeRemoteJsonPromise = fsUtils.writeFileAsync(
        path.join(blockConfigDirPath, blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH),
        JSON.stringify(remoteJson, null, 4),
    );

    // Create a package json so the user can `npm install`.
    // Dependencies are specified as part of the `npm install` step below to install the latest versions: this
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
        '/node_modules',
        '/' + blockCliConfigSettings.CONFIG_FILE_NAME,
        '/' + blockCliConfigSettings.BUILD_DIR,
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
        writeEslintFilePromise,
    ]);

    const packageDependencies = [blockCliConfigSettings.SDK_PACKAGE_NAME, 'react', 'react-dom'];
    const packageDevDependencies = ['eslint', 'eslint-plugin-react', 'eslint-plugin-react-hooks'];

    await nodeModulesCommandHelpers.npmAsync(blockDirPath, [
        'install',
        ...packageDependencies,
        '--quiet',
    ]);
    await nodeModulesCommandHelpers.npmAsync(blockDirPath, [
        'install',
        ...packageDevDependencies,
        '--save-dev',
        '--quiet',
    ]);
}

async function runCommandAsync(argv: Argv): Promise<void> {
    const {blockIdentifier, blockDirPath} = argv;
    invariant(typeof blockIdentifier === 'string', 'expects blockIdentifier to be a string');
    invariant(typeof blockDirPath === 'string', 'expects blockDirPath to be a string');
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

    // Prompt for apiKey if the user does not already have one configured at the user-config level
    const userConfigPath = configHelpers.getConfigPath(configHelpers.ConfigLocations.USER);
    const doesUserConfigApiKeyExist = await configHelpers.hasApiKeyAsync(
        configHelpers.ConfigLocations.USER,
    );
    if (doesUserConfigApiKeyExist) {
        console.log(`Using your existing API key from ${userConfigPath}`);
    } else {
        const apiKey = await promptForApiKeyAsync();
        await configHelpers.setApiKeyAsync(configHelpers.ConfigLocations.USER, apiKey);
        console.log(
            `API key saved to ${userConfigPath}. To update it, use 'block ${CommandNames.SET_API_KEY}'`,
        );
    }

    console.log('Initializing block');
    try {
        await initBlockAsync(baseId, blockId, blockDirPath);
    } catch (err) {
        const doesDirExist = await fsUtils.statIfExistsAsync(blockDirPath);
        if (doesDirExist) {
            console.log('❌ Something failed! Cleaning up...');
            await fsUtils.removeAsync(blockDirPath);
        }

        throw err;
    }

    console.log(
        `✅ Your block is ready! ${_formatBlockRunMessage(
            blockDirPath,
        )} to start developing, and ${chalk.bold('npm run lint')} to lint.`,
    );
}

module.exports = {
    runCommandAsync,
    _test: {
        _getComponentName,
    },
};
