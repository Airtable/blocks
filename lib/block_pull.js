'use scrict';

const fs = require('fs');
const path = require('path');
const findBlockBaseDirAsync = require('./find_block_base_dir');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const APIClient = require('./api_client');
const fsUtils = require('./fs_utils');

module.exports = function blockPullAsync(opts) {
    let blockDirPath;
    return findBlockBaseDirAsync().then(blockBaseDirPath => {
        blockDirPath = blockBaseDirPath;
        const blockFileDataJson = fs.readFileSync(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME));
        const blockFileData = JSON.parse(blockFileDataJson);

        const apiKey = fs.readFileSync(path.join(blockDirPath, blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME));

        const apiClient = new APIClient({
            applicationId: blockFileData.applicationId,
            blockId: blockFileData.blockId,
            apiKey,
        });
        return apiClient.fetchBlockAsync();
    }).then(response => {
        const modules = response.modules;
        const frontendEntryModuleId = response.frontendEntryModuleId;
        const packageVersionByName = response.packageVersionByName;

        const subDirs = _.uniq(modules.map(module => module.metadata.type));
        const createSubDirsPromises = subDirs.map(subDir => fsUtils.mkdirIfDoesntAlreadyExistAsync(blockDirPath, path.join(subDir)));

        return Promise.all(createSubDirsPromises);
    }).then(() => {

    });
}
