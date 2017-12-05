'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const APIClient = require('./api_client');
const fsUtils = require('./fs_utils');

module.exports = function blockCloneAsync(applicationId, blockId, blockDirPath, apiKey) {
    // Lets validate that the given blockDir exists and that it doesn't already
    // have a block in it
    // NOTE: Wrapping the validation in a promise so that the errors work with
    // the caller's catch block
    const blockDirValidationPromise = new Promise((resolve, reject) => {
        const blockDirExists = fs.existsSync(blockDirPath);
        if (!blockDirExists) {
            fs.mkdirSync(blockDirPath);
        } else {
            const anotherBlockExistsInDir = fs.existsSync(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME));
            if (anotherBlockExistsInDir) {
                reject(new Error(`A block already exists in ${blockDirPath}`));
            }
        }
        resolve();
    });

    let modules;
    let frontendEntryModuleId;
    let packageVersionByName;
    return blockDirValidationPromise.then(() => {
        const apiClient = new APIClient({
            applicationId,
            blockId,
            apiKey,
        });
        return apiClient.fetchBlockAsync();
    }).then(response => {
        modules = response.modules;
        frontendEntryModuleId = response.frontendEntryModuleId;
        packageVersionByName = response.packageVersionByName;

        // Create sub dirs
        const subDirs = _.uniq(modules.map(module => module.metadata.type));
        const createSubDirsPromises = subDirs.map(subDir => fsUtils.mkdirAsync(path.join(blockDirPath, subDir)));

        return Promise.all(createSubDirsPromises);
    }).then(() => {
        // Write files
        const writeFilesPromises = modules.map(module => {
            const metadata = module.metadata;
            // Add .js extension to all files so they work nicely with local tools like text editors, etc.
            return fsUtils.writeFileAsync(path.join(blockDirPath, metadata.type, `${metadata.name}.js`), module.code);
        });

        const modulesWithoutCode = modules.map(module => {
            return _.omit(module, 'code');
        });

        const frontendEntryModule = _.find(modules, module => module.id === frontendEntryModuleId);
        const frontendEntryModuleName = `${frontendEntryModule.metadata.name}.js`;

        const writeBlockFilePromise = fsUtils.writeFileAsync(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME), JSON.stringify({
            applicationId,
            blockId,
            frontendEntryModuleName,
            modules: modulesWithoutCode,
        }, null, 4));

        const writeAirtableApiKeyFilePromise = fsUtils.writeFileAsync(path.join(blockDirPath, blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME), apiKey);

        // Create a minimal package json so the user can npm install
        const createPackageJsonPromise = fsUtils.writeFileAsync(path.join(blockDirPath, 'package.json'), JSON.stringify({
            dependencies: packageVersionByName,
        }, null, 4));

        return Promise.all(_.concat(writeFilesPromises, writeBlockFilePromise, createPackageJsonPromise, writeAirtableApiKeyFilePromise));
    });
}
