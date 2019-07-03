// @flow
const os = require('os');
const sinon = require('sinon');
const assert = (require('assert'): any); // eslint-disable-line flowtype/no-weak-types
const path = require('path');

const {getTemporaryDirectoryPath} = require('./helpers');
const fsUtils = require('../src/fs_utils');
const configHelpers = require('../src/helpers/config_helpers');
const getBlockDirPathModule = require('../src/get_block_dir_path');

describe('configHelpers', function() {
    describe('getConfigPath', function() {
        it('for BLOCK location, returns the block directory', function() {
            sinon.stub(getBlockDirPathModule, 'getBlockDirPath').returns('/block/dir/path');
            assert.equal(
                configHelpers.getConfigPath(configHelpers.ConfigLocations.BLOCK),
                '/block/dir/path/.airtableblocksrc.json',
            );
        });

        describe('for USER location', function() {
            let currentEnv;

            describe('on Windows', function() {
                beforeEach(function() {
                    sinon.stub(os, 'platform').returns('win32');
                    sinon.stub(os, 'homedir').returns('C:\\Users\\Blocky\\');
                    sinon.stub(path, 'join').callsFake(path.win32.join);

                    currentEnv = process.env;
                });

                afterEach(function() {
                    process.env = currentEnv;
                });

                it('returns path in %APPDATA% if it is set', function() {
                    process.env = {APPDATA: '\\appdata'};
                    assert.equal(
                        configHelpers.getConfigPath(configHelpers.ConfigLocations.USER),
                        '\\appdata\\.airtableblocksrc.json',
                    );
                });

                it('returns path in HOMEDIR\\AppData\\Roaming if %APPDATA% is missing', function() {
                    process.env = {};
                    assert.equal(
                        configHelpers.getConfigPath(configHelpers.ConfigLocations.USER),
                        'C:\\Users\\Blocky\\AppData\\Roaming\\.airtableblocksrc.json',
                    );
                });
            });

            const unixLikes = [
                {
                    name: 'macOS',
                    platform: 'darwin',
                },
                {
                    name: 'Linux',
                    platform: 'linux',
                },
                {
                    name: 'FreeBSD',
                    platform: 'freebsd',
                },
            ];

            for (const {name, platform} of unixLikes) {
                describe('on ' + name, function() {
                    beforeEach(function() {
                        sinon.stub(os, 'platform').returns(platform);
                        sinon.stub(os, 'homedir').returns('/home/dir');

                        currentEnv = process.env;
                    });

                    afterEach(function() {
                        process.env = currentEnv;
                    });

                    it('returns path in $XDG_CONFIG_HOME if it is set', function() {
                        process.env = {XDG_CONFIG_HOME: '/xdg/config/home'};

                        assert.equal(
                            configHelpers.getConfigPath(configHelpers.ConfigLocations.USER),
                            '/xdg/config/home/.airtableblocksrc.json',
                        );
                    });

                    it('returns path in homedir/.config if $XDG_CONFIG_HOME is missing', function() {
                        process.env = {};
                        assert.equal(
                            configHelpers.getConfigPath(configHelpers.ConfigLocations.USER),
                            '/home/dir/.config/.airtableblocksrc.json',
                        );
                    });
                });
            }
        });
    });

    describe('API key helpers', function() {
        let currentEnv;

        beforeEach(function() {
            const fakeUserConfigPath = getTemporaryDirectoryPath();
            const fakeBlockPath = getTemporaryDirectoryPath();

            sinon.stub(getBlockDirPathModule, 'getBlockDirPath').returns(fakeBlockPath);
            sinon.stub(os, 'platform').returns('darwin');
            sinon.stub(os, 'homedir').returns(fakeUserConfigPath);

            assert.equal(
                configHelpers.getConfigPath(configHelpers.ConfigLocations.BLOCK),
                path.join(fakeBlockPath, '.airtableblocksrc.json'),
            );
            assert.equal(
                configHelpers.getConfigPath(configHelpers.ConfigLocations.USER),
                path.join(fakeUserConfigPath, '.config', '.airtableblocksrc.json'),
            );

            currentEnv = process.env;
            process.env = {};
        });

        afterEach(function() {
            process.env = currentEnv;
        });

        describe('setApiKeyAsync', function() {
            for (let location of [
                configHelpers.ConfigLocations.USER,
                configHelpers.ConfigLocations.BLOCK,
            ]) {
                it(
                    'correctly writes the config file for ConfigLocations.' + location,
                    async function() {
                        await configHelpers.setApiKeyAsync(location, location + 'LevelKey');

                        const config = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(location),
                        );
                        assert.deepStrictEqual(config, {
                            airtableApiKey: location + 'LevelKey',
                        });
                    },
                );
            }

            it('will clobber the existing API key config value, if it exists', async function() {
                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.BLOCK,
                    'blockLevelKey',
                );
                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.USER,
                    'oldUserLevelKey',
                );

                // Should update user config and leave block config alone.
                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.USER,
                    'newUserLevelKey',
                );

                const userConfig = await fsUtils.readJsonIfExistsAsync(
                    configHelpers.getConfigPath(configHelpers.ConfigLocations.USER),
                );
                assert.deepStrictEqual(userConfig, {
                    airtableApiKey: 'newUserLevelKey',
                });

                const blockConfig = await fsUtils.readJsonIfExistsAsync(
                    configHelpers.getConfigPath(configHelpers.ConfigLocations.BLOCK),
                );
                assert.deepStrictEqual(blockConfig, {
                    airtableApiKey: 'blockLevelKey',
                });
            });

            it('will not clobber other existing config values', async function() {
                const configPath = configHelpers.getConfigPath(configHelpers.ConfigLocations.BLOCK);

                await fsUtils.outputJsonAsync(configPath, {
                    favouriteCat: 'pusheen',
                    airtableApiKey: 'oldBlockLevelKey',
                });

                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.BLOCK,
                    'newBlockLevelKey',
                );

                const blockConfig = await fsUtils.readJsonIfExistsAsync(
                    configHelpers.getConfigPath(configHelpers.ConfigLocations.BLOCK),
                );
                assert.deepStrictEqual(blockConfig, {
                    favouriteCat: 'pusheen',
                    airtableApiKey: 'newBlockLevelKey',
                });
            });
        });

        describe('getApiKeyIfExistsAsync', function() {
            it('returns the block level config key if it exists', async function() {
                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.BLOCK,
                    'blockLevelKey',
                );
                // User level key ignored
                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.USER,
                    'userLevelKey',
                );

                assert.equal(await configHelpers.getApiKeyIfExistsAsync(), 'blockLevelKey');
            });

            it("returns the user level config key if it exists, and block level config key doesn't", async function() {
                await configHelpers.setApiKeyAsync(
                    configHelpers.ConfigLocations.USER,
                    'userLevelKey',
                );

                assert.equal(await configHelpers.getApiKeyIfExistsAsync(), 'userLevelKey');
            });

            it('returns null if neither block level config or user level config has the key', async function() {
                assert.equal(await configHelpers.getApiKeyIfExistsAsync(), null);
            });

            it('errors if encountering an invalid config file', async function() {
                const configPath = configHelpers.getConfigPath(configHelpers.ConfigLocations.BLOCK);
                const expectedErrorMessage = 'Invalid config file at ' + configPath;

                await fsUtils.outputJsonAsync(configPath, ['is', 'list', 'not', 'object']);
                await assert.rejects(async () => {
                    await configHelpers.getApiKeyIfExistsAsync();
                }, expectedErrorMessage);

                await fsUtils.writeFileAsync(configPath, 'not valid JSON');
                await assert.rejects(async () => {
                    await configHelpers.getApiKeyIfExistsAsync();
                }, expectedErrorMessage);

                await fsUtils.outputJsonAsync(configPath, {
                    [configHelpers._test.CONFIG_KEY_API_KEY]: 123,
                });
                await assert.rejects(async () => {
                    await configHelpers.getApiKeyIfExistsAsync();
                }, 'expect apiKey to be a string');
            });
        });
    });
});
