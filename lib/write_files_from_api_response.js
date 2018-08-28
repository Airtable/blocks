const _ = require('lodash');
const path = require('path');
const prettier = require('prettier');
const fsUtils = require('./fs_utils');
const blocksConfigSettings = require('../config/block_cli_config_settings');

const prettierConfig = require('../.prettierrc.json');

const formatCode = (code, filePath) => {
    try {
        return prettier.format(code, Object.assign({}, prettierConfig, {filepath: filePath}));
    } catch (e) {
        return code;
    }
};

module.exports = function writeFilesFromApiResponseAsync(response, blockDirPath, blockMetadata) {
    const modules = response.modules;
    const frontendEntryModuleId = response.frontendEntryModuleId;
    // Create sub dirs.
    const subDirs = _.uniq(modules.map(module => module.metadata.type));
    const createSubDirsPromises = subDirs.map(subDir =>
        fsUtils.mkdirIfDoesntAlreadyExistAsync(path.join(blockDirPath, subDir)),
    );

    return Promise.all(createSubDirsPromises).then(() => {
        // Write files.
        const writeFilesPromises = modules.map(module => {
            const metadata = module.metadata;
            // Add .js extension to all files so they work nicely with local tools like text editors, etc.
            const filePath = path.join(blockDirPath, metadata.type, `${metadata.name}.js`);
            return fsUtils.writeFileAsync(filePath, formatCode(module.code, filePath));
        });

        const modulesWithoutCode = modules.map(module => {
            return _.omit(module, 'code');
        });

        const frontendEntryModule = _.find(modules, module => module.id === frontendEntryModuleId);
        const frontendEntryModuleName = `${frontendEntryModule.metadata.name}.js`;

        const writeBlockFilePromise = fsUtils.writeFileAsync(
            path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
            JSON.stringify(
                {
                    frontendEntryModuleName,
                    environment: blockMetadata.environment,
                    applicationId: blockMetadata.applicationId,
                    blockId: blockMetadata.blockId,
                    modules: modulesWithoutCode,
                },
                null,
                4,
            ),
        );

        return Promise.all(_.concat(writeFilesPromises, writeBlockFilePromise));
    });
};
