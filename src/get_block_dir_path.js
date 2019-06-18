'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const blockCliConfigSettings = require('./config/block_cli_config_settings');

const fileSystemRoot = path.parse(process.cwd()).root;

function getBlockDirPath() {
    let currentDirPath = process.cwd();
    while (currentDirPath !== fileSystemRoot) {
        const currentDirFiles = fs.readdirSync(currentDirPath);
        if (_.includes(currentDirFiles, blockCliConfigSettings.BLOCK_FILE_NAME)) {
            return currentDirPath;
        }
        // Traverse up one level.
        currentDirPath = path.dirname(currentDirPath);
    }
    throw new Error('Could not find a block directory');
}

module.exports = getBlockDirPath;
