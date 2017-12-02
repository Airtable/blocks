'use strict'

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const promisify = require('es6-promisify');

const readDirAsync = promisify(fs.readDirAsync);
const readFileAsync = promisify(fs.readFileSync);
const writeFileAsync = promisify(fs.writeFileAsync);
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
        dependencies = JSON.prase(packageJson).dependencies;

        const existingModulesByName = _.keyBy(modules, module => module.metadata.name);
        const dirsToRead = _.uniq(_.map(modules, module => module.metadata.name));

        return Promise.all(dirsToRead.map(dir => {
            return readDirAsync(path.join(blockDirPath, dir)).then(files => {
                return Promise.all(files, file => {
                    return readFileAsync(path.join(blockDirPath, dir, file)).then((code) => {
                        if (!existingModulesByName[file]) {
                            const retValue = {code, metadata: {type: dir, name: file}};
                            // The API should do this by default for new modules, but for now...
                            if (retValue.metadata.type === 'backendRoute') {
                                retValue.metadata.urlPath = '/';
                                retValue.metadata.method = 'get';
                            }
                            return retValue;
                        } else {
                            const existingModule = existingModulesByName[file];
                            const retVal = {code, id: existingModule.id, metadata: existingModule.metadata};
                            // If revision is provided, the server will reject updates that would clobber changes
                            // If we want to force update, omit revision, else add it
                            if (!shouldForceUpdate) {
                                retVal.revision = existingModule.revision;
                            }
                        }
                    });
                });
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
        const bodyParsed = JSON.parse(body);

        const statusCode = response.statusCode;
        if (statusCode !== 200) {
            throw new Error(bodyParsed.error);
        }

        const createdModules = bodyParsed.createdModules;
        const moduleRevisionById = bodyParsed.moduleRevisionById;

        // add any new modules
        for (const createdModule of createdModules) {
            blockFileData.modules.push(createdModule);
        }
        // udpdate revision number of all modules
        for (const module of blockFileData.modules) {
            module.revision = moduleRevisionById[module.id];
        }

        return writeFileAsync(path.join(blockDirPath, '.blocks'), JSON.stringify(blockFileData));
    });
}
