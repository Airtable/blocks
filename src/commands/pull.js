const path = require('path');
const getBlockDirPath = require('../get_block_dir_path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const writeFilesFromApiResponseAsync = require('../write_files_from_api_response');
const writeDeveloperCredentialsFromApiResponseAsync = require('../write_developer_credentials_from_api_response_async');
const APIClient = require('../api_client');
const fsUtils = require('../fs_utils');
const getApiKeySync = require('../get_api_key_sync');

async function pullBlockAsync() {
    const blockDirPath = getBlockDirPath();
    const blockFileDataJson = await fsUtils.readFileAsync(
        path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
    );
    const blockFileData = JSON.parse(blockFileDataJson);

    const apiKey = getApiKeySync(blockDirPath);

    const apiClient = new APIClient({
        environment: blockFileData.environment,
        applicationId: blockFileData.applicationId,
        blockId: blockFileData.blockId,
        apiKey,
    });
    const response = await apiClient.fetchBlockAsync();

    // Write source code files.
    const writeBlockFilesFromApiResponsePromise = writeFilesFromApiResponseAsync(
        response,
        blockDirPath,
        {
            applicationId: blockFileData.applicationId,
            blockId: blockFileData.blockId,
            environment: blockFileData.environment,
        },
    );

    // Write package.json
    const packageJsonPath = path.join(blockDirPath, 'package.json');
    const packageJson = await fsUtils.readFileAsync(packageJsonPath, 'utf-8');
    const packageJsonParsed = JSON.parse(packageJson);
    packageJsonParsed.dependencies = response.packageVersionByName;
    const writePackageJsonPromise = fsUtils.writeFileAsync(
        packageJsonPath,
        JSON.stringify(packageJsonParsed, null, 4),
    );

    // Write developer credential file
    const writeBlockDeveloperCredentialsFromApiResponseAsync = writeDeveloperCredentialsFromApiResponseAsync(
        response.developerCredentialsEncrypted,
        blockDirPath,
    );

    await Promise.all([
        writeBlockFilesFromApiResponsePromise,
        writePackageJsonPromise,
        writeBlockDeveloperCredentialsFromApiResponseAsync,
    ]);
    console.log('Local block updated');
}

async function runCommandAsync(argv) {
    await pullBlockAsync();
}

module.exports = {runCommandAsync};
