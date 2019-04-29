/* eslint-disable no-console */
'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const blocksConfigSettings = require('./config/block_cli_config_settings');

let blockDirPath = null;

function getBlockDirPath() {
    if (blockDirPath === null) {
        let currentDirPath = process.cwd();
        while (currentDirPath !== '/') {
            const currentDirFiles = fs.readdirSync(currentDirPath);
            if (_.includes(currentDirFiles, blocksConfigSettings.BLOCK_FILE_NAME)) {
                // Cache and return the blockDirPath.
                blockDirPath = currentDirPath;
                return blockDirPath;
            }
            // Traverse up one level.
            currentDirPath = path.dirname(currentDirPath);
        }
        console.error('Could not find a block directory');
        process.exit(1);
    }
    return blockDirPath;
}

module.exports = getBlockDirPath;
