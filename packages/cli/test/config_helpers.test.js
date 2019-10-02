// @flow
const os = require('os');
const sinon = require('sinon');
const assert = (require('assert'): any); // eslint-disable-line flowtype/no-weak-types
const path = require('path');

const {getTemporaryDirectoryPath} = require('./helpers');
const fsUtils = require('../src/helpers/fs_utils');
const configHelpers = require('../src/helpers/config_helpers');
const {ConfigKeys, ConfigLocations} = require('../src/types/config_helpers_type');
const getBlockDirPathModule = require('../src/helpers/get_block_dir_path');

import type {UserOrBlockConfig} from '../src/types/config_helpers_type';

describe('configHelpers', function() {
    describe('getConfigPath', function() {
        it('for BLOCK location, returns the block directory', function() {
            sinon.stub(getBlockDirPathModule, 'getBlockDirPath').returns('/block/dir/path');
            assert.equal(
                configHelpers.getConfigPath(ConfigLocations.BLOCK),
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
                        configHelpers.getConfigPath(ConfigLocations.USER),
                        '\\appdata\\.airtableblocksrc.json',
                    );
                });

                it('returns path in HOMEDIR\\AppData\\Roaming if %APPDATA% is missing', function() {
                    process.env = {};
                    assert.equal(
                        configHelpers.getConfigPath(ConfigLocations.USER),
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
                            configHelpers.getConfigPath(ConfigLocations.USER),
                            '/xdg/config/home/.airtableblocksrc.json',
                        );
                    });

                    it('returns path in homedir/.config if $XDG_CONFIG_HOME is missing', function() {
                        process.env = {};
                        assert.equal(
                            configHelpers.getConfigPath(ConfigLocations.USER),
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
                configHelpers.getConfigPath(ConfigLocations.BLOCK),
                path.join(fakeBlockPath, '.airtableblocksrc.json'),
            );
            assert.equal(
                configHelpers.getConfigPath(ConfigLocations.USER),
                path.join(fakeUserConfigPath, '.config', '.airtableblocksrc.json'),
            );

            currentEnv = process.env;
            process.env = {};
        });

        afterEach(function() {
            process.env = currentEnv;
        });

        describe('setApiKeyAsync', function() {
            describe('if API Key config is a string', function() {
                for (let location of [ConfigLocations.USER, ConfigLocations.BLOCK]) {
                    it(`correctly writes the config file for ConfigLocations.${location}`, async function() {
                        await configHelpers.setApiKeyAsync(location, location + 'LevelKey', null);

                        const config = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(location),
                        );
                        assert.deepStrictEqual(config, {
                            airtableApiKey: location + 'LevelKey',
                        });
                    });
                }

                it('will clobber the existing API key config value, if it exists', async function() {
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelKey',
                        null,
                    );
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'oldUserLevelKey',
                        null,
                    );

                    // Should update user config and leave block config alone.
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'newUserLevelKey',
                        null,
                    );

                    const userConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.USER),
                    );
                    assert.deepStrictEqual(userConfig, {
                        airtableApiKey: 'newUserLevelKey',
                    });

                    const blockConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.BLOCK),
                    );
                    assert.deepStrictEqual(blockConfig, {
                        airtableApiKey: 'blockLevelKey',
                    });
                });

                it('will not clobber other existing config values', async function() {
                    const configPath = configHelpers.getConfigPath(ConfigLocations.BLOCK);

                    await fsUtils.outputJsonAsync(configPath, {
                        favouriteCat: 'pusheen',
                        airtableApiKey: 'oldBlockLevelKey',
                    });

                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'newBlockLevelKey',
                        null,
                    );

                    const blockConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.BLOCK),
                    );
                    assert.deepStrictEqual(blockConfig, {
                        favouriteCat: 'pusheen',
                        airtableApiKey: 'newBlockLevelKey',
                    });
                });

                describe('if apiKeyName is given', function() {
                    it('converts the string config value to an Object keyed by apiKeyName', async function() {
                        // Set both the user-level and block-level configs as string values for API Key
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'existingBlockLevelKey',
                            null,
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'existingUserLevelKey',
                            null,
                        );
                        const blockConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.BLOCK),
                        );
                        const blockConfigTypeCoerced = ((blockConfig: any): UserOrBlockConfig); // eslint-disable-line flowtype/no-weak-types
                        assert(typeof blockConfigTypeCoerced.airtableApiKey === 'string');

                        const userConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.USER),
                        );
                        const userConfigTypeCoerced = ((userConfig: any): UserOrBlockConfig); // eslint-disable-line flowtype/no-weak-types
                        assert(typeof userConfigTypeCoerced.airtableApiKey === 'string');

                        // Update both the user-level and block-level configs with an apiKeyName
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelKeyWithName',
                            'default',
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelKeyWithName',
                            'default',
                        );

                        const updatedBlockConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.BLOCK),
                        );
                        assert.deepStrictEqual(updatedBlockConfig, {
                            airtableApiKey: {
                                default: 'blockLevelKeyWithName',
                            },
                        });

                        const updatedUserConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.USER),
                        );
                        assert.deepStrictEqual(updatedUserConfig, {
                            airtableApiKey: {
                                default: 'userLevelKeyWithName',
                            },
                        });
                    });

                    it('if apiKeyName is NOT "default", converts string value to Object and migrates the existing API Key to "default"', async function() {
                        // Set both the user-level and block-level configs as string values for API Key
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'existingBlockLevelKey',
                            null,
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'existingUserLevelKey',
                            null,
                        );

                        // Update both the user-level and block-level configs with apiKeyName
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelStagingKey',
                            'staging',
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDevelopmentKey',
                            'development',
                        );

                        const updatedBlockConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.BLOCK),
                        );
                        assert.deepStrictEqual(updatedBlockConfig, {
                            airtableApiKey: {
                                default: 'existingBlockLevelKey',
                                staging: 'blockLevelStagingKey',
                            },
                        });

                        const updatedUserConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.USER),
                        );
                        assert.deepStrictEqual(updatedUserConfig, {
                            airtableApiKey: {
                                default: 'existingUserLevelKey',
                                development: 'userLevelDevelopmentKey',
                            },
                        });
                    });
                });
            });

            describe('if API Key config is an Object', function() {
                it('creates the API Key config Object keyed by apiKeyName', async function() {
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelStagingKey',
                        'staging',
                    );
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'userLevelRandomNameKey',
                        'random-name',
                    );

                    const blockConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.BLOCK),
                    );
                    assert.deepStrictEqual(blockConfig, {
                        airtableApiKey: {
                            staging: 'blockLevelStagingKey',
                        },
                    });
                    const userConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.USER),
                    );
                    assert.deepStrictEqual(userConfig, {
                        airtableApiKey: {
                            'random-name': 'userLevelRandomNameKey',
                        },
                    });
                });

                it('if apiKeyName is not provided, it updates the "default" value', async function() {
                    // Create some API Key configs as Object keyed by apiKeyName for both
                    // block-level and user-level configs
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelStagingKey',
                        'staging',
                    );
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'userLevelRandomBlahKey',
                        'random-blah',
                    );

                    // Set an API Key without a apiKeyName
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelDefaultKey',
                        null,
                    );
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'userLevelDefaultKey',
                        null,
                    );

                    const blockConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.BLOCK),
                    );
                    assert.deepStrictEqual(blockConfig, {
                        airtableApiKey: {
                            default: 'blockLevelDefaultKey',
                            staging: 'blockLevelStagingKey',
                        },
                    });
                    const userConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.USER),
                    );
                    assert.deepStrictEqual(userConfig, {
                        airtableApiKey: {
                            default: 'userLevelDefaultKey',
                            'random-blah': 'userLevelRandomBlahKey',
                        },
                    });
                });

                it('updates the API Key config for the provided apiKeyName', async function() {
                    // Create block-level configs for API Key for multiple apiKeyName values
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelThisShouldNotChange',
                        'unchanged',
                    );
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelOldKey',
                        'changed',
                    );
                    // Update API Key for for only one apiKeyName of block-level configs
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelNewKey',
                        'changed',
                    );

                    // Create user-level configs for API Key for multiple apiKeyName values
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'userLevelThisShouldNotChange',
                        'unchanged',
                    );
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'userLevelOldKey',
                        'changed',
                    );
                    // Update API Key for only one apiKeyName of user-level configs
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.USER,
                        'userLevelNewKey',
                        'changed',
                    );

                    const blockConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.BLOCK),
                    );
                    assert.deepStrictEqual(blockConfig, {
                        airtableApiKey: {
                            unchanged: 'blockLevelThisShouldNotChange',
                            changed: 'blockLevelNewKey',
                        },
                    });

                    const userConfig = await fsUtils.readJsonIfExistsAsync(
                        configHelpers.getConfigPath(ConfigLocations.USER),
                    );
                    assert.deepStrictEqual(userConfig, {
                        airtableApiKey: {
                            unchanged: 'userLevelThisShouldNotChange',
                            changed: 'userLevelNewKey',
                        },
                    });
                });
            });
        });

        describe('getApiKeyIfExistsAsync', function() {
            describe('if API Key config is a string', function() {
                it('returns the block level config key if it exists', async function() {
                    await configHelpers.setApiKeyAsync(
                        ConfigLocations.BLOCK,
                        'blockLevelKey',
                        null,
                    );
                    // User level key ignored
                    await configHelpers.setApiKeyAsync(ConfigLocations.USER, 'userLevelKey', null);

                    assert.equal(await configHelpers.getApiKeyIfExistsAsync(null), 'blockLevelKey');
                });

                it("returns the user level config key if it exists, and block level config key doesn't", async function() {
                    await configHelpers.setApiKeyAsync(ConfigLocations.USER, 'userLevelKey', null);

                    assert.equal(await configHelpers.getApiKeyIfExistsAsync(null), 'userLevelKey');
                });

                it('returns null if neither block level config or user level config has the key', async function() {
                    assert.equal(await configHelpers.getApiKeyIfExistsAsync(null), null);
                });

                it('errors if encountering an invalid config file', async function() {
                    const configPath = configHelpers.getConfigPath(ConfigLocations.BLOCK);
                    const expectedErrorMessage = 'Invalid config file at ' + configPath;

                    await fsUtils.outputJsonAsync(configPath, ['is', 'list', 'not', 'object']);
                    await assert.rejects(async () => {
                        await configHelpers.getApiKeyIfExistsAsync(null);
                    }, expectedErrorMessage);

                    await fsUtils.writeFileAsync(configPath, 'not valid JSON');
                    await assert.rejects(async () => {
                        await configHelpers.getApiKeyIfExistsAsync(null);
                    }, expectedErrorMessage);

                    await fsUtils.outputJsonAsync(configPath, {
                        [ConfigKeys.API_KEY]: 123,
                    });
                    await assert.rejects(async () => {
                        await configHelpers.getApiKeyIfExistsAsync(null);
                    }, 'expect apiKey to be a string');
                });

                describe('if apiKeyName is provided', function() {
                    it('returns the API Key string config value if requested apiKeyName is "default"', async function() {
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelKeyAsString',
                            null,
                        );

                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('default'),
                            'userLevelKeyAsString',
                        );

                        // Confirm that the config value is still a string
                        const userConfig = await fsUtils.readJsonIfExistsAsync(
                            configHelpers.getConfigPath(ConfigLocations.USER),
                        );
                        assert.deepStrictEqual(userConfig, {
                            airtableApiKey: 'userLevelKeyAsString',
                        });
                    });

                    it('returns null if requested apiKeyName is not "default"', async function() {
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelKey',
                            null,
                        );

                        assert.equal(await configHelpers.getApiKeyIfExistsAsync('staging'), null);
                    });
                });
            });

            describe('if API Key config is an Object', function() {
                describe('if only user level config exists', function() {
                    it('returns the API Key for the requested apiKeyName, if it exists', async function() {
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDefaultKey',
                            'default',
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDevelopmentKey',
                            'development',
                        );

                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('default'),
                            'userLevelDefaultKey',
                        );
                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('non-existent'),
                            null,
                        );
                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('development'),
                            'userLevelDevelopmentKey',
                        );
                    });

                    it('returns the API Key for "default" if apiKeyName is not given', async function() {
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDefaultKey',
                            'default',
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDevelopmentKey',
                            'development',
                        );

                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync(null),
                            'userLevelDefaultKey',
                        );
                    });
                });
                describe('if block level config exists', function() {
                    it('returns the API Key for the requested apiKeyName, if it exists', async function() {
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelDefaultKey',
                            'default',
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelStagingKey',
                            'staging',
                        );
                        // User level key ignored
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDefaultKey',
                            'default',
                        );

                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('default'),
                            'blockLevelDefaultKey',
                        );
                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync(null),
                            'blockLevelDefaultKey',
                        );
                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('staging'),
                            'blockLevelStagingKey',
                        );
                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync('i-do-not-exist'),
                            null,
                        );
                    });

                    it('returns the API Key for "default" if apiKeyName is not given', async function() {
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelDefaultKey',
                            'default',
                        );
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.BLOCK,
                            'blockLevelStagingKey',
                            'staging',
                        );
                        // User level key ignored
                        await configHelpers.setApiKeyAsync(
                            ConfigLocations.USER,
                            'userLevelDefaultKey',
                            'default',
                        );

                        assert.equal(
                            await configHelpers.getApiKeyIfExistsAsync(null),
                            'blockLevelDefaultKey',
                        );
                    });
                });
            });
        });
    });
});
