'use strict'

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const findBlockDirPathAsync = require('./find_block_dir_path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const APIClient = require('./api_client');
const fsUitls = require('./fs_utils');

const dirsToRead = ['frontend', 'shared', 'backendRoute', 'backendEvent'];

module.exports = function blockPushAsync(opts) {
    let blockFileData;
    let blockDirPath;
    return findBlockDirPathAsync().then(blockDirPathInner => {
        blockDirPath = blockDirPathInner;
        // We read metadata from the block file
        const blockFileDataJson = fs.readFileSync(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME));
        blockFileData = JSON.parse(blockFileDataJson);
        const modules = blockFileData.modules;
        const existingModulesByName = _.keyBy(modules, module => module.metadata.name);

        return Promise.all(_.map(dirsToRead, dir => {
            return fsUitls.readDirIfExistsAsync(path.join(blockDirPath, dir)).then(files => {
                if (!files) {
                    return null;
                }
                return Promise.all(_.map(files, file => {
                    return fsUitls.readFileAsync(path.join(blockDirPath, dir, file), 'utf-8').then((code) => {
                        // Ignore non .js files
                        if (!file.match(/.+\.js$/)) {
                            return null;
                        }
                        const fileNameWithoutExtension = file.replace(/\.js$/, '');
                        if (!existingModulesByName[fileNameWithoutExtension]) {
                            const retValue = {code, metadata: {type: dir, name: fileNameWithoutExtension}};
                            // The API should do this by default for new modules, but for now...
                            if (retValue.metadata.type === 'backendRoute') {
                                retValue.metadata.urlPath = '/';
                                retValue.metadata.method = 'get';
                            }
                            return retValue;
                        } else {
                            const existingModule = existingModulesByName[fileNameWithoutExtension];
                            const retVal = {code, id: existingModule.id, metadata: existingModule.metadata};
                            // If revision is provided, the server will reject updates that would clobber changes
                            // If we want to force update, omit revision, else add it
                            if (!opts.shouldForceUpdate) {
                                retVal.revision = existingModule.revision;
                            }
                            return retVal;
                        }
                    });
                }));
            });
        }));
    }).then(modules => {
        return _.compact(_.flattenDeep(modules));
    }).then(modules => {
        const apiKey = fs.readFileSync(path.join(blockDirPath, blocksConfigSettings.AIRTABLE_API_KEY_FILE_NAME));
        const apiClient = new APIClient({
            applicationId: blockFileData.applicationId,
            blockId: blockFileData.blockId,
            apiKey,
        });
        const packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'));
        const dependencies = JSON.parse(packageJson).dependencies;

        const putData = {packageVersionByName: dependencies, modules};
        return apiClient.updateBlockAsync(putData);
    }).then(response => {
        const createdModules = response.createdModules;
        const moduleRevisionById = response.moduleRevisionById;

        // add any new modules
        for (const createdModule of createdModules) {
            blockFileData.modules.push(createdModule);
        }
        // update revision number of all modules
        for (const module of blockFileData.modules) {
            module.revision = moduleRevisionById[module.id];
        }

        return fsUitls.writeFileAsync(path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME), JSON.stringify(blockFileData, null, 4));
    });
}
