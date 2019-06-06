// @flow
const getBlockDirPath = require('../get_block_dir_path');
const blockCliConfigSettings = require('../config/block_cli_config_settings');
const validateBlockJson = require('./validate_block_json');
const fsUtils = require('../fs_utils');
const path = require('path');

import type {Result} from '../types/result';
import type {BlockJsonNew} from '../types/block_json_new_type';

async function parseAndValidateBlockJsonAsync(): Promise<Result<BlockJsonNew>> {
    const blockDirPath = getBlockDirPath();
    const blockJsonPath = path.join(blockDirPath, blockCliConfigSettings.BLOCK_FILE_NAME);
    const blockJsonStr = await fsUtils.readFileAsync(blockJsonPath);
    let blockJson;
    try {
        blockJson = JSON.parse(blockJsonStr);
    } catch (err) {
        return {err: new Error(`Could not parse ${blockCliConfigSettings.BLOCK_FILE_NAME}`)};
    }
    const validationResult = validateBlockJson(blockJson);
    if (!validationResult.pass) {
        return {err: new Error(validationResult.reason)};
    }
    return {
        value: ((blockJson: any): BlockJsonNew), // eslint-disable-line flowtype/no-weak-types
    };
}

module.exports = parseAndValidateBlockJsonAsync;
