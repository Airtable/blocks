const fs = require('fs');
const path = require('path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const writeFilesFromApiResponseAsync = require('../write_files_from_api_response');
const APIClient = require('../api_client');
const fsUtils = require('../fs_utils');
const cliHelpers = require('../helpers/cli_helpers');

const domainByEnvironment = {
    production: 'airtable.com',
    staging: 'staging.airtable.com',
    local: 'hyperbasedev.com:3000',
};

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
        path.join(blockDirPath, blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME),
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

    // Create a .gitignore file.
    const gitignoreContents = [
        'node_modules',
        blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
        blocksConfigSettings.BUILD_DIR,
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
    ]);
}

async function runCommandAsync(config) {
    const {blockIdentifier, blockDirPath} = config;
    const blockIdentifierSplit = blockIdentifier.split('/');
    if (
        blockIdentifierSplit.length !== 2 ||
        !blockIdentifierSplit[0].startsWith('app') ||
        !blockIdentifierSplit[1].startsWith('blk')
    ) {
        throw new Error('Block identifier must be of format <applicationId>/<blockId>');
    }
    const [appId, blockId] = blockIdentifierSplit;

    // Lets validate that the given blockDir doesn't already have something in it.
    const doesBlockDirExist = fs.existsSync(blockDirPath);
    if (doesBlockDirExist) {
        throw new Error(`A directory already exists at ${blockDirPath}`);
    }

    const environment = config.environment;
    const domain = domainByEnvironment[environment];
    // Prompt for apiKey.
    const result = await cliHelpers.promptAsync({
        name: 'apiKey',
        description: `Please enter your API key. You can generate one at https://${domain}/account`,
    });
    await cloneBlockAsync(
        environment,
        appId,
        blockId,
        blockDirPath,
        result.apiKey,
    );
    console.log(`Block cloned in ${config.blockDirPath}`);
}

module.exports = {runCommandAsync};
