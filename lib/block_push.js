/* eslint-disable no-console */
'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const findBlockDirPathAsync = require('./find_block_dir_path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const APIClient = require('./api_client');
const fsUitls = require('./fs_utils');
const getApiKeySync = require('./get_api_key_sync');
const setUpEslintIfNeededSync = require('./set_up_eslint_if_needed_sync');
const blockLint = require('./block_lint');

const dirsToRead = ['frontend', 'shared', 'backendRoute', 'backendEvent'];

module.exports = function blockPushAsync(opts) {
    let blockFileData;
    let blockDirPath;
    return findBlockDirPathAsync().then(blockDirPathInner => {
        blockDirPath = blockDirPathInner;

        const didSetUpEslint = setUpEslintIfNeededSync(blockDirPath);
        if (didSetUpEslint) {
            console.log('Dev dependencies updated. Please run `npm install` and try again.');
            process.exit(1);
        }
    }).then(() => {
        console.log('Linting...');
        const lint = blockLint(blockDirPath);
        const report = lint.report;
        console.log(lint.formatter(report.results));
        if (report.errorCount > 0) {
            console.log('Lint errors! Please fix the errors before pushing.');
            process.exit(1);
        }
    }).then(() => {
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
        const apiKey = getApiKeySync(blockDirPath);
        const apiClient = new APIClient({
            environment: blockFileData.environment,
            applicationId: blockFileData.applicationId,
            blockId: blockFileData.blockId,
            apiKey,
        });
        const packageJsonPath = path.join(blockDirPath, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
        const dependencies = packageJson.dependencies;

        const putData = {packageVersionByName: dependencies, modules};
        console.log('Pushing...');
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
    }).catch(err => {
        console.log('Push failed!');

        // Replace module ids with names in the error message.
        if (blockFileData) {
            let message = err.message;
            for (const module of blockFileData.modules) {
                message = message.split(module.id).join(module.metadata.type + '/' + module.metadata.name);
            }
            err.message = message;
        }

        throw err;
    });
};
