'use strict';

const fs = require('fs');
const path = require('path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const writeFilesFromApiResponseAsync = require('./write_files_from_api_response');
const APIClient = require('./api_client');
const fsUtils = require('./fs_utils');
const devDependencies = require('./dev_dependencies');
const setUpDevToolsIfNeededSync = require('./set_up_dev_tools_if_needed_sync');

module.exports = function blockCloneAsync(
    environment,
    applicationId,
    blockId,
    blockDirPath,
    apiKey,
) {
    // Lets validate that the given blockDir exists and that it doesn't already
    // have a block in it.
    // NOTE: We are wrapping the validation in a promise so that the errors work
    // with the caller's catch block.
    const blockDirValidationPromise = new Promise((resolve, reject) => {
        const blockDirExists = fs.existsSync(blockDirPath);
        if (!blockDirExists) {
            fs.mkdirSync(blockDirPath);
        } else {
            const anotherBlockExistsInDir = fs.existsSync(
                path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
            );
            if (anotherBlockExistsInDir) {
                reject(new Error(`A block already exists in ${blockDirPath}`));
            }
        }
        resolve();
    });

    return blockDirValidationPromise
        .then(() => {
            const apiClient = new APIClient({
                environment,
                applicationId,
                blockId,
                apiKey,
            });
            return apiClient.fetchBlockAsync();
        })
        .then(response => {
            const packageVersionByName = response.packageVersionByName;

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
                    {
                        dependencies: packageVersionByName,
                        devDependencies: devDependencies,
                    },
                    null,
                    4,
                ),
            );

            setUpDevToolsIfNeededSync(blockDirPath);

            // Create a .gitignore file.
            const gitignoreContents = [
                'node_modules',
                blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME,
                blocksConfigSettings.CLIENT_WRAPPER_FILE_NAME,
                blocksConfigSettings.BUNDLE_FILE_NAME,
            ];
            const writeGitignoreFilePromise = fsUtils.writeFileAsync(
                path.join(blockDirPath, '.gitignore'),
                gitignoreContents.join('\n'),
            );

            return Promise.all([
                writeBlockFilesFromApiResponsePromise,
                writePackageJsonPromise,
                writeAirtableApiKeyFilePromise,
                writeGitignoreFilePromise,
            ]);
        });
};
