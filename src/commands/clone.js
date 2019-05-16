/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const writeFilesFromApiResponseAsync = require('../write_files_from_api_response');
const writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');
const APIClient = require('../api_client');
const fsUtils = require('../fs_utils');
const parseBlockIdentifier = require('../helpers/parse_block_identifier');
const promptForApiKeyAsync = require('../helpers/prompt_for_api_key_async');

async function cloneBlockAsync(
    environment,
    applicationId,
    blockId,
    blockDirPath,
    apiKey,
) {
    // Make a new directory for the block.
    await fsUtils.mkdirAsync(blockDirPath);

    // Fetch the block from the server.
    const apiClient = new APIClient({
        environment,
        applicationId,
        blockId,
        apiKey,
    });
    const response = await apiClient.fetchBlockAsync();

    // Write the block to the file system.
    const writeBlockFilesFromApiResponsePromise = writeFilesFromApiResponseAsync(
        response,
        blockDirPath,
        {environment, applicationId, blockId},
    );

    const writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, blockCliConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
        apiKey,
    );

    // Create a minimal package json so the user can yarn install.
    const writePackageJsonPromise = fsUtils.writeFileAsync(
        path.join(blockDirPath, 'package.json'),
        JSON.stringify(
            {dependencies: response.packageVersionByName},
            null,
            4,
        ),
    );

    // Create a developer credentials json file.
    const writeBlockDeveloperCredentialsFromApiResponseAsync = await writeDeveloperCredentialsFromApiResponseAsync(
        response.developerCredentialsEncrypted,
        blockDirPath,
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
        writeBlockFilesFromApiResponsePromise,
        writePackageJsonPromise,
        writeAirtableApiKeyFilePromise,
        writeGitignoreFilePromise,
        writeBlockDeveloperCredentialsFromApiResponseAsync,
    ]);
}

async function runCommandAsync(argv) {
    const {blockIdentifier, blockDirPath} = argv;
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

    const environment = argv.environment;
    const apiKey = await promptForApiKeyAsync(environment);
    await cloneBlockAsync(
        environment,
        baseId,
        blockId,
        blockDirPath,
        apiKey,
    );
    console.log(`Block cloned in ${argv.blockDirPath}`);
}

module.exports = {runCommandAsync};
