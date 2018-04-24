'use strict';
const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = function blockFormat(blockDirPath) {
    let prettier;
    try {
        prettier = require(path.join(blockDirPath, 'node_modules', 'prettier'));
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            throw new Error('prettier not found. Please run `yarn` and try again');
        } else {
            throw err;
        }
    }

    const config = require(path.join(blockDirPath, '.prettierrc.json'));
    const files = glob.sync(path.join(blockDirPath, 'frontend', '**/*.js'));

    files.forEach(fileName => {
        const originalSource = fs.readFileSync(fileName, 'utf-8');
        const formattedSource = prettier.format(originalSource, config);

        if (originalSource !== formattedSource) {
            fs.writeFileSync(fileName, formattedSource, 'utf-8');
        }
    });
};
