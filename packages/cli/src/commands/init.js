// @flow
/* eslint-disable no-console */
const os = require('os');
const CommandNames = require('./command_names');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const configHelpers = require('../helpers/config_helpers');
const {ConfigLocations} = require('../types/config_helpers_type');
const nodeModulesCommandHelpers = require('../helpers/node_modules_command_helpers');
const parseBlockIdentifier = require('../helpers/parse_block_identifier');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');
const SupportedTopLevelDirectoryNames = require('../types/supported_top_level_directory_names');
const chalk = require('chalk');
const fs = require('fs');
const fsUtils = require('../helpers/fs_utils');
const path = require('path');
const invariant = require('invariant');
const {camelCase, upperFirst} = require('lodash');
const initCommandHelpers = require('../helpers/init_command_helpers');

import type {Argv} from 'yargs';
import type {BlockJson} from '../types/block_json_type';
import type {RemoteJson} from '../types/remote_json_type';

const DEFAULT_FRONTEND_ENTRY_NAME = 'index';
const VALID_TEMPLATE_NAME_REGEX = /^@airtable\/.+/;

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
        "react/prop-types": 0,
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

function isHelloWorldTemplate(template: string): boolean {
    return template === blockCliConfigSettings.HELLO_WORLD_TEMPLATE;
}

function getTemplateDescription(template: string): string {
    if (isHelloWorldTemplate(template)) {
        return 'Hello world';
    }

    return template;
}

// TODO(richsinn): Add workflow to scaffold 'backend' routes with default files here.
async function runCommandAsync(argv: Argv): Promise<void> {
    const {blockIdentifier, template, blockDirPath} = argv;
    invariant(typeof blockIdentifier === 'string', 'expects blockIdentifier to be a string');
    invariant(typeof template === 'string', 'expects template to be a string');
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
    const userConfigPath = configHelpers.getConfigPath(ConfigLocations.USER);
    const doesUserConfigApiKeyExist = await configHelpers.hasApiKeyAsync(
        ConfigLocations.USER,
        null, // For'init', use the "default" apiKeyName for API Key lookup.
    );
    if (doesUserConfigApiKeyExist) {
        console.log(`Using your existing API key from ${userConfigPath}`);
    } else {
        const apiKey = await promptForApiKeyAsync();
        await configHelpers.setApiKeyAsync(ConfigLocations.USER, apiKey, null);
        console.log(
            `API key saved to ${userConfigPath}. To update it, use 'block ${CommandNames.SET_API_KEY}'`,
        );
    }

    // Require that block template is hosted in the `@airtable` org on NPM or is a github repo
    if (!VALID_TEMPLATE_NAME_REGEX.test(template) && !initCommandHelpers.isGitTemplate(template)) {
        throw new Error(
            'Block templates must be official Airtable example blocks (@airtable/name_of_template) or links to valid git repositories',
        );
    }

    console.log(`Initializing block using ${getTemplateDescription(template)} template`);

    // Make a new directory for the block.
    await fsUtils.mkdirAsync(blockDirPath);

    try {
        if (isHelloWorldTemplate(template)) {
            // Using default hello world block directory structure.
            // Derived praogramatically. This is so that any unanticipated
            // problems with the templating approach won't stop users
            // building blocks. Once we feel confident in the
            // template download mechanism, we can replace the custom
            // hello world installation with a template. Then, we can
            // delete the programmatic hello world code path.
            await setupHelloWorldBlockAsync(blockDirPath, blockId, baseId);
        } else {
            await setupRemoteTemplateBlockAsync(blockDirPath, blockId, baseId, template);
        }
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

function assertNpmPackageSeemsToBeATemplate(blockDirPath: string, template: string): void {
    // Main indicator is that template contains a `block.json`.  Not
    // checking for other indicators (e.g. `package.json`) because
    // they are not totally necessary.
    if (fs.existsSync(path.join(blockDirPath, 'block.json'))) {
        return;
    }

    throw new Error(`${template} does not seem to be a block template`);
}

function assertTemplateSuccessfullyDownloaded(templatePath: string, template: string): void {
    // The most likely problem is that the template doesn't exist on
    // NPM. This is hard to determine robustly, so we just check for the
    // template dir existing.
    if (fs.existsSync(templatePath)) {
        return;
    }

    throw new Error(
        `Could not get template ${template} - please check you entered the name correctly`,
    );
}

async function populateBlockDirectoryWithTemplateContentAsync(
    blockDirPath: string,
    template: string,
): Promise<void> {
    // Download the template to a tmp directory using npm install
    const templatePath = await initCommandHelpers.downloadTemplateAsync(blockDirPath, template);

    assertTemplateSuccessfullyDownloaded(templatePath, template);

    assertNpmPackageSeemsToBeATemplate(templatePath, template);

    // The template is downloaded with `npm install`.  When this
    // happens, `npm` doesn't include `.gitignore` in the downloaded
    // package.  To get around this, the template repo symlinks its
    // `.gitignore` file to `__gitignore`.  The code below then moves
    // `__gitignore` to `.gitignore` in the downloaded template.  It
    // will be copied over with the rest of the template to the new
    // block directory.
    try {
        await fsUtils.renameAsync(
            path.join(templatePath, '__gitignore'),
            path.join(templatePath, '.gitignore'),
        );
    } catch {
        // Do nothing since not having a gitignore isn't a big deal and some repo's may not have one
    }

    // Put the contents of the template into the new block directory
    await fsUtils.copyAsync(templatePath, blockDirPath);

    // Delete the downloaded template
    await initCommandHelpers.cleanUpDownloadedTemplateAsync(blockDirPath);
}

async function rewriteBlockSdkVersionFromLatestToCurrentVersionAsync(
    blockDirPath: string,
): Promise<void> {
    const packageJsonPath = path.join(blockDirPath, 'package.json');
    // flow-disable-next-line
    const packageJson = await fsUtils.readJsonIfExistsAsync(packageJsonPath);
    if (
        packageJson &&
        packageJson.dependencies &&
        packageJson.dependencies[blockCliConfigSettings.SDK_PACKAGE_NAME] === 'latest'
    ) {
        const sdkPackageJsonPath = path.join(
            blockDirPath,
            'node_modules',
            '@airtable',
            'blocks',
            'package.json',
        );
        // flow-disable-next-line
        const sdkPackageJson = await fsUtils.readJsonIfExistsAsync(sdkPackageJsonPath);
        packageJson.dependencies[blockCliConfigSettings.SDK_PACKAGE_NAME] = sdkPackageJson.version;
        await fsUtils.outputJsonAsync(packageJsonPath, packageJson);
    }
}

async function createRemoteJsonFileAsync(
    blockDirPath: string,
    blockId: string,
    baseId: string,
): Promise<void> {
    const remoteJson: RemoteJson = {
        blockId,
        baseId,
    };
    const blockConfigDirPath = path.join(
        blockDirPath,
        blockCliConfigSettings.BLOCK_CONFIG_DIR_NAME,
    );
    await fsUtils.mkdirPathAsync(blockConfigDirPath);
    await fsUtils.writeFileAsync(
        path.join(blockConfigDirPath, blockCliConfigSettings.REMOTE_JSON_BASE_FILE_PATH),
        JSON.stringify(remoteJson, null, 4) + '\n',
    );
}

async function setupHelloWorldBlockAsync(
    blockDirPath: string,
    blockId: string,
    baseId: string,
): Promise<void> {
    // Create the block.json file.
    const blockJson: BlockJson = {
        version: '1.0',
        frontendEntry: `./${SupportedTopLevelDirectoryNames.FRONTEND}/${DEFAULT_FRONTEND_ENTRY_NAME}.js`,
    };
    const writeBlockJsonPromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME),
        JSON.stringify(blockJson, null, 4) + '\n',
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
        JSON.stringify(remoteJson, null, 4) + '\n',
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
        ) + '\n',
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

async function setupRemoteTemplateBlockAsync(
    blockDirPath: string,
    blockId: string,
    baseId: string,
    template: string,
): Promise<void> {
    // Download the template and copy its contents to the new block directory
    await populateBlockDirectoryWithTemplateContentAsync(blockDirPath, template);

    // Install the dependencies in the new block's package.json
    await initCommandHelpers.installBlockDependenciesAsync(blockDirPath);

    // Rewrite the blocks sdk version to the installed version if it was set to latest
    await rewriteBlockSdkVersionFromLatestToCurrentVersionAsync(blockDirPath);

    // Create the .block/remote.json file
    await createRemoteJsonFileAsync(blockDirPath, blockId, baseId);
}

module.exports = {
    runCommandAsync,
    _test: {
        _getComponentName,
    },
};
