/* eslint-disable no-console */
const _ = require('lodash');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const path = require('path');

async function renameEntryModuleAsync(newNamePath) {
    // Ensure that newName is in the frontend directory.
    const dirName = path.dirname(newNamePath);
    if (dirName !== '.' && !dirName.endsWith('frontend')) {
        throw new Error('entry module should always be in frontend/');
    }

    // Get the file name path.
    const newFileName = path.basename(newNamePath, '.js');

    const blockFileJson = await fsUtils.readFileAsync('block.json');
    const blockFile = JSON.parse(blockFileJson);
    const oldName = blockFile.frontendEntryModuleName;
    const oldNameWithoutExtension = oldName.replace(/\.js$/, '');

    const newFilePath = path.join('frontend', `${newFileName}.js`);
    const doesModuleExistWithNewName = fs.existsSync(newFilePath);

    // Set the frontendEntryModuleName.
    blockFile.frontendEntryModuleName = `${newFileName}.js`;

    // If a module doesn't exist with the new name, then we'll update the current
    // entry module's name to the new one and update the block module's metadata.
    // If a module *does* exist with the new name, then we'll simply update block.json
    // to point frontendEntryModuleName to the other file.
    if (!doesModuleExistWithNewName) {
        // Set the module's name in our modules array.
        const blockModule = _.find(
            blockFile.modules,
            o => o.metadata.name === oldNameWithoutExtension,
        );
        blockModule.metadata.name = newFileName;

        // Rename the actual file.
        await fsUtils.renameAsync(path.join('frontend', oldName), path.join('frontend', `${newFileName}.js`));
    }

    // Update block.json
    await fsUtils.writeFileAsync('block.json', JSON.stringify(blockFile, null, 4));
    console.log('Entry module name updated');
}

async function runCommandAsync(argv) {
    await renameEntryModuleAsync(argv.newName);
}

module.exports = {runCommandAsync};
