// @flow
const {getBlockDirPath} = require('./get_block_dir_path');
const fsUtils = require('./fs_utils');
const path = require('path');

import type {Result} from '../types/result';

// An incomplete flow type for the shape of a package.json file.
// see https://docs.npmjs.com/files/package.json
type PackageJson = {
    name?: string, // technically required if you want to publish to the registry
    version?: string, // technically required if you want to publish to the registry
    description?: string,
};

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
