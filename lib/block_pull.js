'use strict';

const fs = require('fs');
const path = require('path');
const findBlockDirPathAsync = require('./find_block_dir_path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const writeFilesFromApiResponseAsync = require('./write_files_from_api_response');
const APIClient = require('./api_client');
const fsUtils = require('./fs_utils');
const getApiKeySync = require('./get_api_key_sync');

module.exports = function blockPullAsync() {
    let blockDirPath;
    let blockFileData;
    return findBlockDirPathAsync()
        .then(blockDirPathInner => {
            blockDirPath = blockDirPathInner;
            const blockFileDataJson = fs.readFileSync(
                path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
            );
            blockFileData = JSON.parse(blockFileDataJson);

            const apiKey = getApiKeySync(blockDirPath);

            const apiClient = new APIClient({
                environment: blockFileData.environment,
                applicationId: blockFileData.applicationId,
                blockId: blockFileData.blockId,
                apiKey,
            });
            return apiClient.fetchBlockAsync();
        })
        .then(response => {
            const packageJsonPath = path.join(blockDirPath, 'package.json');
            const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
            const packageJsonParsed = JSON.parse(packageJson);
            packageJsonParsed.dependencies = response.packageVersionByName;

            const writeBlockFilesFromApiResponsePromise = writeFilesFromApiResponseAsync(
                response,
                blockDirPath,
                {
                    applicationId: blockFileData.applicationId,
                    blockId: blockFileData.blockId,
                    environment: blockFileData.environment,
                },
            );
            const writePackageJsonPromise = fsUtils.writeFileAsync(
                packageJsonPath,
                JSON.stringify(packageJsonParsed, null, 4),
            );

            return Promise.all([writeBlockFilesFromApiResponsePromise, writePackageJsonPromise]);
        });
};
