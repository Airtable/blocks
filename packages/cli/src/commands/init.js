// @flow
/* eslint-disable no-console */
const os = require('os');
const CommandNames = require('./command_names');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const configHelpers = require('../helpers/config_helpers');
const {ConfigLocations} = require('../types/config_helpers_type');
const parseBlockIdentifier = require('../helpers/parse_block_identifier');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');
const chalk = require('chalk');
const fs = require('fs');
const fsUtils = require('../helpers/fs_utils');
const path = require('path');
const invariant = require('invariant');
const {pick} = require('lodash');
const initCommandHelpers = require('../helpers/init_command_helpers');

import type {Argv} from 'yargs';
import type {RemoteJson} from '../types/remote_json_type';

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

    console.log(`Initializing block using ${template} template`);

    // Make a new directory for the block.
    await fsUtils.mkdirAsync(blockDirPath);

    try {
        await setupRemoteTemplateBlockAsync(blockDirPath, blockId, baseId, template);
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

function assertDirectorySeemsToBeATemplate(blockDirPath: string, template: string): void {
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

    assertDirectorySeemsToBeATemplate(templatePath, template);

    // Put the contents of the template into the new block directory
    await fsUtils.copyAsync(templatePath, blockDirPath);

    // Delete the downloaded template
    await initCommandHelpers.cleanUpDownloadedTemplateAsync(blockDirPath);
}

async function dereferenceBlockSdkVersionVersionAsync(
    blockDirPath: string,
    rawVersion: string,
): Promise<string> {
    if (rawVersion === 'latest') {
        const sdkPackageJsonPath = path.join(
            blockDirPath,
            'node_modules',
            '@airtable',
            'blocks',
            'package.json',
        );
        const sdkPackageJson: {[string]: mixed} = await fsUtils.readJsonIfExistsAsync(
            sdkPackageJsonPath,
        );
        // The deserialised json will use primitive strings.
        if (!sdkPackageJson.version || typeof sdkPackageJson.version !== 'string') {
            throw new Error('Installed @airtable/blocks dependency has no version.');
        }
        return sdkPackageJson.version;
    }
    return rawVersion;
}

function whitelistKeysInPackageJson(packageJson: {[string]: mixed}): {[string]: mixed} {
    // We explicitly only retain a small subset of keys in the package.json that are
    // directly relevant to the block author. The author is expected to fill in the
    // rest of the fields like `name` and `version` to suit their needs.
    // The set of fields here reflects what is specified in the hand-crafted
    // hello-world template.
    const whitelist = ['dependencies', 'devDependencies', 'private', 'scripts'];
    return pick(packageJson, whitelist);
}

async function rewritePackageJsonAsync(blockDirPath: string, template: string): Promise<void> {
    const packageJsonPath = path.join(blockDirPath, 'package.json');
    const packageJson = await fsUtils.readJsonIfExistsAsync(packageJsonPath);
    // We consider it acceptable for a template to lack a package.json.
    if (packageJson instanceof Object) {
        if (packageJson.dependencies instanceof Object) {
            const rawVersion = packageJson.dependencies[blockCliConfigSettings.SDK_PACKAGE_NAME];
            packageJson.dependencies[
                blockCliConfigSettings.SDK_PACKAGE_NAME
            ] = await dereferenceBlockSdkVersionVersionAsync(blockDirPath, rawVersion);
        }
        const rewrittenPackageJson = whitelistKeysInPackageJson(packageJson);
        await fsUtils.outputJsonAsync(packageJsonPath, rewrittenPackageJson);
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

    // Rewrite the package.json from the verbatim original in npm
    await rewritePackageJsonAsync(blockDirPath, template);

    // Create the .block/remote.json file
    await createRemoteJsonFileAsync(blockDirPath, blockId, baseId);
}

module.exports = {
    runCommandAsync,
};
