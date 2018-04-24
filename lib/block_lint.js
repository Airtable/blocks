'use strict';
const path = require('path');

module.exports = function blockLint(blockDirPath) {
    let eslint;
    try {
        eslint = require(path.join(blockDirPath, 'node_modules', 'eslint'));
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            throw new Error('eslint not found. Please run `yarn` and try again.');
        } else {
            throw err;
        }
    }
    const cli = new eslint.CLIEngine();
    const report = cli.executeOnFiles(['.']);
    return {
        report,
        formatter: cli.getFormatter(),
    };
};
