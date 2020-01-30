// @flow

const airbuild = {
    nodejsVersion: '12.14.1',
    yarnVersion: '1.21.1',
    mysqlVersion: 'n/a',
    testCommand: 'yarn airbuild && echo "RUN_ALL_TESTS PASSED"',
    environmentVariables: {
        NODE_ENV: 'test',
    },
    options: {
        nodeModuleInstallCommand: 'yarn',
        postRestoreCachedNodeModulesCommand: 'yarn',
        directoryCaching: false,
        disableNodeModulesCaching: true,
        disableWipeNodeModules: true,
    },
    directoriesWithNodeModules: [],
    directoriesToCacheByAction: {
        transpile: [],
        compileAssets: [],
    },
    testDefinitions: [],
    mochaGlobalsToIgnore: [],
};

module.exports = airbuild;
