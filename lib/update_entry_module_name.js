'use  strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = function updateEntryModuleName(newNamePath) {
    // Ensure that newName is in the frontend directory
    const dirName = path.dirname(newNamePath);
    if (!(dirName === '.' || dirName.endsWith('frontend'))) {
        throw new Error('entry module should always be in frontend/');
    }

    // Get the file name path
    const newName = path.basename(newNamePath, '.js');

    const blockFileJson = fs.readFileSync('block.json');
    const blockFile = JSON.parse(blockFileJson);
    const oldName = blockFile.frontendEntryModuleName;
    const oldNameWithoutExtension = oldName.replace(/\.js$/, '');

    blockFile.frontendEntryModuleName = `${newName}.js`;
    _.find(
        blockFile.modules,
        module => module.metadata.name === oldNameWithoutExtension,
    ).metadata.name = newName;

    // Rename the actual file
    try {
        fs.renameSync(path.join('frontend', oldName), path.join('frontend', `${newName}.js`));
    } catch (err) {
        // If we get ENOENT error, that means the user already change the file
        // manually. Throw any other errors
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
    fs.writeFileSync('block.json', JSON.stringify(blockFile, null, 4));
};
