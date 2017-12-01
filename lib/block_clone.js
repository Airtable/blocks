const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const promisify = require('es6-promisify');

const getRequestAsync = promisify(request.get);
const mkdirAsync = promisify(fs.mkdir);
const writeFileAsync = promisify(fs.writeFile);

module.exports = function blockCloneAsync(applicationId, blockId, apiKey, blockDirPath) {
    // Lets validate that the given blockDir exists and that it doesn't already
    // have a block in it
    // NOTE: Wrapping the validation in a promise so that the errors work with
    // the caller's catch block
    const blockDirValidationPromise = new Promise((resolve, reject) => {
        const blockDirExists = fs.existsSync(blockDirPath);
        if (!blockDirExists) {
            reject(new Error(`${blockDirPath} does not exist`));
        }
        const anotherBlockExistsInDir = fs.existsSync(path.join(blockDirPath, '.block'));
        if (anotherBlockExistsInDir) {
            reject(new Error(`Another block already exists in ${blockDirPath}`));
        }
        resolve();
    });

    return blockDirValidationPromise.then(() => {
        const options = {
            url: `https://api.airtable.com/v2/meta/${applicationId}/blocks/${blockId}`,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        };
        return getRequestAsync(options);
    }).then(response => {
        const body = response.body;
        const bodyParsed = JSON.parse(body);

        const statusCode = response.statusCode;
        // If we got a 404, return incorrect app or block id error
        if (statusCode == 404) {
            throw new Error('Incorrect application or block id');
        }
        // If we got anything else other than 200 and 404, return whatever
        // error we got
        if (statusCode !== 200) {
            throw new Error(bodyParsed.error);
        }

        const modules = bodyParsed.modules;
        const frontendEntryModuleId = bodyParsed.frontendEntryModuleId;
        const packageVersionByName = bodyParsed.packageVersionByName;

        // Create sub dirs
        const subDirs = _.uniq(modules.map(module => module.metadata.type));
        const createSubDirsPromises = subDirs.map(subDir => mkdirAsync(path.join(blockDirPath, subDir)));

        return Promise.all(createSubDirsPromises);
    }).then(() => {
        // Write files
        const writeFilesPromises = modules.map(module => {
            const metadata = module.metadata;
            // Add .js extension to all files so they work nicely with local tools like text editors, etc.
            return writeFileAsync(path.join(blockDirPath, metadata.type, `${metadata.name}.js`), module.code);
        });

        const modulesWithoutCode = modules.map(module => {
            return _.omit(module, 'code');
        });

        const frontendEntryModule = _.find(modules, module => module.id = frontendEntryModuleId);
        const frontendEntryModuleName = `${frontendEntryModule.metadata.name}.js`;

        const writeBlockFilePromise = writeFileAsync(path.join(blockDirPath, '.block'), JSON.stringify({
            apiKey,
            applicationId,
            blockId,
            frontendEntryModuleName,
            modules: modulesWithoutCode,
        }));

        // Create a minimal package json so the user can npm install
        const createPackageJsonPromise = writeFileAsync(path.join(blockDirPath, 'package.json'), JSON.stringify({
            dependencies: packageVersionByName,
        }, null, 4));

        return Promise.all(_.concat(writeFilesPromises, writeBlockFilePromise, createPackageJsonPromise));
    });
}
