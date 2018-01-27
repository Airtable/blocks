/* eslint-disable no-console */
'use strict';
const path = require('path');
const fs = require('fs');
const fsUtils = require('./fs_utils');
const _ = require('lodash');
const devDependencies = require('./dev_dependencies');

module.exports = function setUpEslintIfNeededSync(blockDirPath) {
    const packageJsonPath = path.join(blockDirPath, 'package.json');
    const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = packageJsonString ? JSON.parse(packageJsonString) : {};

    // Update dev dependencies if needed.
    if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
    }
    if (!_.isEqual(_.pick(packageJson.devDependencies, _.keys(devDependencies)), devDependencies)) {
        console.log('Updating dev dependencies...');
        _.each(devDependencies, (version, name) => {
            packageJson.devDependencies[name] = version;
        });

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));

        fsUtils.copyFileSync(
            require.resolve('../.eslintrc.json'),
            path.join(blockDirPath, '.eslintrc.json')
        );
        fsUtils.copyFileSync(
            require.resolve('../.eslintignore'),
            path.join(blockDirPath, '.eslintignore')
        );

        return true;
    } else {
        return false;
    }
};
