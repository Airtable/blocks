'use  strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = function updateEntryModuleName(newName) {
    // User might or might not have added the .js extension, so add it if they didn't
    if (!newName.endsWith('.js')) {
        newName = `${newName}.js`;
    }
    const newNameWithoutExtension = newName.replace(/\.js$/, '');

    const blockFileJson = fs.readFileSync('block.json');
    const blockFile = JSON.parse(blockFileJson);
    const oldName = blockFile.frontendEntryModuleName;
    const oldNameWithoutExtension = oldName.replace(/\.js$/, '');

    blockFile.frontendEntryModuleName = newName;
    _.find(blockFile.modules, module => module.metadata.name === oldNameWithoutExtension).metadata.name = newNameWithoutExtension;

    // Rename the actual file
    try {
        fs.renameSync(path.join('frontend', oldName), path.join('frontend', newName));
    } catch (err) {
        // If we get ENOENT error, that means the user already change the file
        // manually. Throw any other errors
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    fs.writeFileSync('block.json', JSON.stringify(blockFile, null, 4));
}
