'use  strict';

const _ = require('lodash');
const fs = require('fs');

module.exports = function updateEntryModuleName(newName) {
    // User might or might not have added the .js extension, so add it if they didn't
    if (!newName.endsWith('.js')) {
        newName = `${newName}.js`;
    }
    const newNameWithoutExtension = newName.replace(/\.js$/, '');

    const blockFileJson = fs.readFileSync('block.json');
    const blockFile = JSON.parse(blockFileJson);
    const oldNameWithoutExtension = blockFile.frontendEntryModuleName.replace(/\.js$/, '');

    blockFile.frontendEntryModuleName = newName;
    _.find(blockFile.modules, module => module.metadata.name === oldNameWithoutExtension).metadata.name = newNameWithoutExtension;
    fs.writeFileSync('block.json', JSON.stringify(blockFile, null, 4));
}
