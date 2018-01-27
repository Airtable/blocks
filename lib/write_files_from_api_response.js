const _ = require('lodash');
const path = require('path');
const fsUtils = require('./fs_utils');
const blocksConfigSettings = require('../config/block_cli_config_settings');

module.exports = function writeFilesFromApiResponseAsync(response, blockDirPath, blockMetadata) {
    const modules = response.modules;
    const frontendEntryModuleId = response.frontendEntryModuleId;
    // Create sub dirs
    const subDirs = _.uniq(modules.map(module => module.metadata.type));
    const createSubDirsPromises = subDirs.map(subDir => fsUtils.mkdirIfDoesntAlreadyExistAsync(path.join(blockDirPath, subDir)));

    return Promise.all(createSubDirsPromises).then(() => {
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
            frontendEntryModuleName,
            applicationId: blockMetadata.applicationId,
            blockId: blockMetadata.blockId,
            modules: modulesWithoutCode,
        }, null, 4));

        return Promise.all(_.concat(writeFilesPromises, writeBlockFilePromise));
    });
};
