'use strict'

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const promisify = require('es6-promisify');

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const putRequestAsync = promisify(request.put);

module.exports = function blockPush(shouldForceUpdate) {
    const findBlockBaseDirAsync = new Promise((resolve, reject) => {
        let currentDirPath = process.cwd();
        while (currentDirPath !== '/') {
            const currentDirFiles = fs.readdirSync(currentDirPath);
            if (_.includes(currentDirFiles, '.block')) {
                resolve(currentDirPath);
            }
            // Traverse up one level
            currentDirPath = path.dirname(currentDirPath);
        }
        reject(new Error('Could not find a block directory'));
    });
    let blockFileData;
    let blockDirPath;
    let dependencies;
    return findBlockBaseDirAsync.then(blockBaseDirPath => {
        blockDirPath = blockBaseDirPath;
        // We read metadata from the block file
        const blockFileDataJson = fs.readFileSync(path.join(blockDirPath, '.block'));
        blockFileData = JSON.parse(blockFileDataJson);
        const modules = blockFileData.modules;

        const packageJson = fs.readFileSync(path.join(blockDirPath, 'package.json'));
        dependencies = JSON.parse(packageJson).dependencies;

        const existingModulesByName = _.keyBy(modules, module => module.metadata.name);
        const dirsToRead = _.uniq(_.map(modules, module => module.metadata.type));

        return Promise.all(_.map(dirsToRead, dir => {
            return readDirAsync(path.join(blockDirPath, dir)).then(files => {
                return Promise.all(_.map(files, file => {
                    return readFileAsync(path.join(blockDirPath, dir, file), 'utf-8').then((code) => {
                        const fileNameWithoutExtension = file.replace(/\.[^/.]+$/, '');
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
                            if (!shouldForceUpdate) {
                                retVal.revision = existingModule.revision;
                            }
                            return retVal;
                        }
                    });
                }));
            });
        }));
    }).then(modules => {
        return _.flattenDeep(modules);
    }).then(modules => {
        const putData = {packageVersionByName: dependencies, modules};
        const options = {
            url: `https://api.airtable.com/v2/meta/${blockFileData.applicationId}/blocks/${blockFileData.blockId}`,
            headers: {
                'Authorization': `Bearer ${blockFileData.apiKey}`,
            },
            body: putData,
            json: true,
        }
        return putRequestAsync(options);
    }).then(response => {
        const body = response.body;
        const statusCode = response.statusCode;
        if (statusCode !== 200) {
            throw new Error(body.error);
        }

        const createdModules = body.createdModules;
        const moduleRevisionById = body.moduleRevisionById;

        // add any new modules
        for (const createdModule of createdModules) {
            blockFileData.modules.push(createdModule);
        }
        // udpdate revision number of all modules
        for (const module of blockFileData.modules) {
            module.revision = moduleRevisionById[module.id];
        }

        return writeFileAsync(path.join(blockDirPath, '.block'), JSON.stringify(blockFileData));
    });
}
