/* eslint-disable no-console */
'use strict';
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const semver = require('semver');
const devDependencies = require('./dev_dependencies');

module.exports = function setUpEslintIfNeededSync(blockDirPath) {
    const packageJsonPath = path.join(blockDirPath, 'package.json');
    const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = packageJsonString ? JSON.parse(packageJsonString) : {};

    if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
    }

    const originalPackageJson = _.cloneDeep(packageJson);

    console.log('Checking dev dependencies...');
    _.each(devDependencies, (version, name) => {
        const cleanVersion = semver.coerce(version);
        const currentVersion = semver.coerce(packageJson.devDependencies[name]);
        if (!currentVersion) {
            console.log(`  * ${name}: adding ${cleanVersion}`);
            packageJson.devDependencies[name] = version;
        } else {
            if (semver.gte(currentVersion, cleanVersion)) {
                console.log(`  * ${name}: skip ${currentVersion} -> ${cleanVersion}`);
            } else {
                console.log(`  * ${name}: upgrade ${currentVersion} -> ${cleanVersion}`);
                packageJson.devDependencies[name] = version;
            }
        }
    });

    const didUpdatePackageJson = !_.isEqual(packageJson, originalPackageJson);

    if (didUpdatePackageJson) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
    }

    const copyConfigFile = name => {
        const officialFilePath = path.join(__dirname, '..', name);
        const officialVersion = fs.readFileSync(officialFilePath, 'utf-8');
        const blockFilePath = path.join(blockDirPath, name);
        const blockVersion = fs.existsSync(blockFilePath)
            ? fs.readFileSync(blockFilePath, 'utf-8')
            : null;

        if (!blockVersion) {
            console.log(`  * ${name}: add file`);
            fs.writeFileSync(blockFilePath, officialVersion, 'utf-8');
        } else if (blockVersion === officialVersion) {
            console.log(`  * ${name}: up to date`);
        } else {
            console.log(`  * ${name}: exists, but different to official version. skipping`);
        }
    };

    console.log('\nChecking config files...');
    copyConfigFile('.eslintrc.json');
    copyConfigFile('.eslintignore');
    copyConfigFile('.prettierrc.json');

    console.log('');

    return didUpdatePackageJson;
};
