// @flow
const path = require('path');
const {execFileAsync} = require('./child_process_helpers');

async function yarnInstallAsync(cwd: string, args: Array<string>): Promise<{stdout: string, stderr: string}> {
    const yarnPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'yarn');
    return await execFileAsync(yarnPath, args, {
        cwd,
        prefix: 'yarn',
    });
}

const yarnHelpers = {
    yarnInstallAsync,
};

module.exports = yarnHelpers;
