// @flow
/* eslint-disable no-console */
const BlockModuleTypes = require('../types/block_module_types');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const parseBlockIdentifier = require('../helpers/parse_block_identifier');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');
const Environments = require('../types/environments');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const path = require('path');
const invariant = require('invariant');
const {camelCase, upperFirst} = require('lodash');

import type {Argv} from 'yargs';
import type {Environment} from '../types/environments';

const DEFAULT_FRONTEND_ENTRY_MODULE_NAME = 'index';
const DEFAULT_FRONTEND_ENTRY_MODULE_METADATA = {
    type: BlockModuleTypes.FRONTEND,
    name: DEFAULT_FRONTEND_ENTRY_MODULE_NAME,
};

function getDefaultFrontendCode(blockDirPath: string): string {
    let componentName = upperFirst(camelCase(path.basename(blockDirPath)));
    if (!componentName.includes('Block')) {
        componentName = `${componentName}Block`;
    }

    return `import {UI} from '@airtable/blocks';
import React from 'react';

function ${componentName}() {
    // YOUR CODE GOES HERE
    return (
        <div>Hello world 🚀</div>
    );
}

UI.initializeBlock(() => <${componentName} />);
`;
}

async function writeDefaultFilesAsync(blockDirPath: string): Promise<void> {
    const frontendDirPath = path.join(blockDirPath, BlockModuleTypes.FRONTEND);
    await fsUtils.mkdirAsync(frontendDirPath);
    await fsUtils.writeFileAsync(
        path.join(frontendDirPath, `${DEFAULT_FRONTEND_ENTRY_MODULE_NAME}.js`),
        getDefaultFrontendCode(blockDirPath),
    );
}

async function initBlockAsync(
    baseId: string,
    blockId: string,
    blockDirPath: string,
    apiKey: string,
    environment: string,
): Promise<void> {
    // Make a new directory for the block.
    await fsUtils.mkdirAsync(blockDirPath);

    // Create the block.json file.
    const blockJson = {
        frontendEntryModuleName: `${DEFAULT_FRONTEND_ENTRY_MODULE_NAME}.js`,
        applicationId: baseId,
        blockId,
        ...(environment === Environments.PRODUCTION ? {} : {environment}),
        modules: [
            {revision: 0, metadata: DEFAULT_FRONTEND_ENTRY_MODULE_METADATA},
        ],
    };
    const writeBlockJsonPromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
        JSON.stringify(blockJson, null, 4),
    );

    const writeDefaultFilesPromise = writeDefaultFilesAsync(blockDirPath);

    // Write the API key to the file system.
    const writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
        apiKey,
    );

    // Create a minimal package json so the user can yarn install.
    const defaultDependencies = {
        '@airtable/blocks': '^0.0.5',
        react: '^16.8.0',
        'react-dom': '^16.8.0',
    };
    const writePackageJsonPromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, 'package.json'),
        JSON.stringify(
            {
                private: true,
                dependencies: defaultDependencies,
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
        blockCliConfigSettings.DEVELOPER_CREDENTIALS_FILE_NAME,
    ];
    const writeGitignoreFilePromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, '.gitignore'),
        gitignoreContents.join('\n'),
    );

    await Promise.all([
        writeBlockJsonPromise,
        writeDefaultFilesPromise,
        writePackageJsonPromise,
        writeGitignoreFilePromise,
        writeAirtableApiKeyFilePromise,
    ]);
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
        environment,
    );
    console.log('Your block is ready!');
}

module.exports = {runCommandAsync};
