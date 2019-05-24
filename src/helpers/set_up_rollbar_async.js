// @flow
const Rollbar = require('rollbar');
const {ROLLBAR_ACCESS_TOKEN} = require('../config/block_cli_config_settings');
const path = require('path');
const fsExtra = require('fs-extra');

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
    const possibleGitPath = path.join(
        __dirname,
        '..',
        '..',
        '.git'
    );
    return await fsExtra.pathExists(possibleGitPath);
}
