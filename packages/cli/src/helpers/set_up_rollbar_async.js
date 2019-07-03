// @flow
const Rollbar = require('rollbar');
const {ROLLBAR_ACCESS_TOKEN} = require('../config/block_cli_config_settings');
const path = require('path');
const fsExtra = require('fs-extra');
const getBlocksCliProjectRootPath = require('./get_blocks_cli_project_root_path');

async function setUpRollbarAsync(): Promise<void> {
    if (await isInDevelopmentRepositoryAsync()) {
        return;
    }

    new Rollbar({
        accessToken: ROLLBAR_ACCESS_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
        captureIp: false,
    });
}

module.exports = setUpRollbarAsync;

// This is a bit brittle because it assumes this file lives at this path.
// In the future, we may wish to set a flag at publish time to accomplish this.
async function isInDevelopmentRepositoryAsync(): Promise<boolean> {
    const packageRootPath = getBlocksCliProjectRootPath();
    return (
        packageRootPath.endsWith(`packages${path.sep}cli`) &&
        (await fsExtra.pathExists(path.join(packageRootPath, '..', '..', '.git')))
    );
}
