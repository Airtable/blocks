'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const blocksConfigSettings = require('../config/block_cli_config_settings');

module.exports = function findBlockDirPath() {
    let currentDirPath = process.cwd();
    while (currentDirPath !== '/') {
        const currentDirFiles = fs.readdirSync(currentDirPath);
        if (_.includes(currentDirFiles, blocksConfigSettings.BLOCK_FILE_NAME)) {
            return currentDirPath;
        }
        // Traverse up one level.
        currentDirPath = path.dirname(currentDirPath);
    }
    throw new Error('Could not find a block directory');
};
