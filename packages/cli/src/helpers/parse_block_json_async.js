// @flow
const {getBlockDirPath} = require('./get_block_dir_path');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const fsUtils = require('./fs_utils');
const path = require('path');

import type {Result} from '../types/result';

async function parseBlockJsonAsync(): Promise<Result<mixed>> {
    const blockDirPath = getBlockDirPath();
    const blockJsonPath = path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME);
    const blockJsonStr = await fsUtils.readFileAsync(blockJsonPath);
    let blockJson;
    try {
        blockJson = JSON.parse(blockJsonStr);
    } catch (err) {
        return {err: new Error(`Could not parse ${blockCliConfigSettings.BLOCK_FILE_NAME}`)};
    }
    return {value: blockJson};
}

module.exports = parseBlockJsonAsync;
