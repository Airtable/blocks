// @flow
const {getBlockDirPath} = require('./get_block_dir_path');
const fsUtils = require('./fs_utils');
const path = require('path');

import type {Result} from '../types/result';
import type {PackageJson} from '../types/package_json_type';

async function parseBlockPackageJsonAsync(): Promise<Result<PackageJson>> {
    const blockDirPath = getBlockDirPath();
    const blockPackageJsonPath = path.join(blockDirPath, 'package.json');
    const packageJsonStr = await fsUtils.readFileAsync(blockPackageJsonPath);
    let packageJson;
    try {
        packageJson = JSON.parse(packageJsonStr);
    } catch (err) {
        return {err: new Error("Could not parse the block's package.json")};
    }
    return {value: packageJson};
}

module.exports = parseBlockPackageJsonAsync;
