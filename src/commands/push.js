const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const getBlockDirPath = require('../get_block_dir_path');
const blocksConfigSettings = require('../config/block_cli_config_settings');
const APIClient = require('../api_client');
const fsUtils = require('../fs_utils');
const getApiKeySync = require('../get_api_key_sync');

const dirsToRead = ['frontend', 'shared', 'backendRoute', 'backendEvent'];

async function convertFileToModuleAsync(file, parentDir, existingModulesByName, config) {
    // Ignore non .js files.
    if (!file.match(/.+\.js$/)) {
        return null;
    }

    const fileNameWithoutExtension = file.replace(
        /\.js$/,
        '',
    );

    const blockDirPath = getBlockDirPath();
    const filePath = path.join(blockDirPath, parentDir, file);
    const code = await fsUtils.readFileAsync(filePath, 'utf-8');
    if (!existingModulesByName[fileNameWithoutExtension]) {
        const blockModule = {
            code,
            metadata: {
                type: parentDir,
                name: fileNameWithoutExtension,
            },
        };
        // The API should do this by default for new modules, but for now...
        if (blockModule.metadata.type === 'backendRoute') {
            blockModule.metadata.urlPath = '/';
            blockModule.metadata.method = 'get';
        }
        return blockModule;
    } else {
        const existingModule =
            existingModulesByName[fileNameWithoutExtension];
        const blockModule = {
            code,
            id: existingModule.id,
            metadata: existingModule.metadata,
        };
        // If revision is provided, the server will reject updates that would clobber changes.
        // If we want to force update, omit revision, else add it.
        if (!config.force) {
            blockModule.revision = existingModule.revision;
        }
        return blockModule;
    }
}

async function readModulesInDirectoryAsync(dir, existingModulesByName, config) {
    const blockDirPath = getBlockDirPath();
    const files = await fsUtils.readDirIfExistsAsync(path.join(blockDirPath, dir));
    if (!files) {
        return null;
    }
    const modules = await Promise.all(files.map(file =>
        convertFileToModuleAsync(file, dir, existingModulesByName, config))
    );
    return modules;
}

async function readAllModulesAsync(config, blockFileData) {
    const existingModules = blockFileData.modules;
    const existingModulesByName = _.keyBy(existingModules, module => module.metadata.name);
    const modulesForEachDir = await Promise.all(dirsToRead.map(dir =>
        readModulesInDirectoryAsync(dir, existingModulesByName, config)
    ));
    return _.compact(_.flattenDeep(modulesForEachDir));
}

async function pushBlockAsync(config) {
    const blockDirPath = getBlockDirPath();

    // We read metadata from the block file.
    const blockFileDataJson = fs.readFileSync(
        path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
    );
    const blockFileData = JSON.parse(blockFileDataJson);

    // Read all modules from disk.
    const modules = await readAllModulesAsync(config, blockFileData);

    // Try pushing the modules.
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

    let createdModules;
    let moduleRevisionById;
    try {
        const response = await apiClient.updateBlockAsync(putData);
        createdModules = response.createdModules;
        moduleRevisionById = response.moduleRevisionById;
    } catch (err) {
        console.log('Push failed!');

        // Replace module ids with names in the error message.
        if (blockFileData) {
            let message = err.message;
            for (const blockModule of blockFileData.modules) {
                message = message
                    .split(blockModule.id)
                    .join(blockModule.metadata.type + '/' + blockModule.metadata.name);
            }
            err.message = message;
        }

        throw err;
    }

    // Add any new modules.
    for (const createdModule of createdModules) {
        blockFileData.modules.push(createdModule);
    }
    // Update revision number of all modules.
    for (const blockModule of blockFileData.modules) {
        blockModule.revision = moduleRevisionById[blockModule.id];
    }

    await fsUtils.writeFileAsync(
        path.join(blockDirPath, blocksConfigSettings.BLOCK_FILE_NAME),
        JSON.stringify(blockFileData, null, 4),
    );
    console.log('Remote block updated!');
}

async function runCommandAsync(config) {
    await pushBlockAsync(config);
}

module.exports = {runCommandAsync};
