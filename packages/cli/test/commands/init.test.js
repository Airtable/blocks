// @flow
const init = require('../../src/commands/init');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const fsUtils = require('../../src/fs_utils');
const inquirer = require('inquirer');
const {getTemporaryDirectoryPath, assertThrowsAsync} = require('../helpers');
const configHelpers = require('../../src/helpers/config_helpers');
const nodeModulesCommandHelpers = require('../../src/helpers/node_modules_command_helpers');
const sinon = require('sinon');
const assert = require('assert');

describe('init', function() {
    describe('_getComponentName', function() {
        it('constructs component name to use in starter code correctly', function() {
            assert.strictEqual(
                init._test._getComponentName('/uses/last/path/portion'),
                'PortionBlock',
            );
            assert.strictEqual(
                init._test._getComponentName('/HANDLES CASES correctly'),
                'HandlesCasesCorrectlyBlock',
            );
            assert.strictEqual(
                init._test._getComponentName('/handles-delimiters_correctly'),
                'HandlesDelimitersCorrectlyBlock',
            );
            assert.strictEqual(
                init._test._getComponentName('/strips spaces & symbols! :)'),
                'StripsSpacesSymbolsBlock',
            );
            assert.strictEqual(
                init._test._getComponentName('/doesnt include block twice'),
                'DoesntIncludeBlockTwice',
            );
            assert.strictEqual(
                init._test._getComponentName('/123 handles starting numbers'),
                'My123HandlesStartingNumbersBlock',
            );
        });
    });

    describe('init command', function() {
        let npmAsyncStub;
        let promptAsyncStub;
        let hasApiKeyAsyncStub;
        let setApiKeyAsyncStub;
        let blockDirPath;

        async function runInitAsync() {
            const fakeArgv = {
                _: [],
                $0: 'block',
                blockIdentifier: 'app123/blkABC',
                blockDirPath,
            };

            // We stub console.log to tidy up test output, but need to restore it
            // because the test runner relies on it!
            sinon.stub(console, 'log');
            await init.runCommandAsync(fakeArgv);
            console.log.restore(); // eslint-disable-line no-console
        }

        beforeEach(function() {
            promptAsyncStub = sinon.stub(inquirer, 'prompt').resolves({
                apiKey: 'key123ABC',
            });

            npmAsyncStub = sinon.stub(nodeModulesCommandHelpers, 'npmAsync').resolves();

            hasApiKeyAsyncStub = sinon.stub(configHelpers, 'hasApiKeyAsync').resolves(true);
            setApiKeyAsyncStub = sinon.stub(configHelpers, 'setApiKeyAsync').resolves();

            blockDirPath = getTemporaryDirectoryPath();
        });

        it('writes a directory of files', async function() {
            await runInitAsync();

            assert(fs.existsSync(path.join(blockDirPath, '.gitignore')));

            assert(fs.existsSync(path.join(blockDirPath, 'frontend', 'index.js')));

            assert(fs.existsSync(path.join(blockDirPath, '.eslintrc.js')));

            assert(npmAsyncStub.calledTwice);

            const blockJson = await fsExtra.readJson(path.join(blockDirPath, 'block.json'));
            assert.strictEqual(blockJson.frontendEntry, './frontend/index.js');

            const remoteJson = await fsExtra.readJson(
                path.join(blockDirPath, '.block', 'remote.json'),
            );
            assert.strictEqual(remoteJson.baseId, 'app123');
            assert.strictEqual(remoteJson.blockId, 'blkABC');

            const packageJson = await fsExtra.readJson(path.join(blockDirPath, 'package.json'));
            assert.strictEqual(packageJson.private, true);
        });

        it('prompts for API key if the user does not have it set already', async function() {
            hasApiKeyAsyncStub.resolves(false);

            await runInitAsync();

            assert.strictEqual(promptAsyncStub.called, true);
            assert.strictEqual(setApiKeyAsyncStub.called, true);
        });

        it('does not prompt for API key if the user does have it set already', async function() {
            await runInitAsync();

            assert.strictEqual(promptAsyncStub.called, false);
            assert.strictEqual(setApiKeyAsyncStub.called, false);
        });

        it('removes the block directory if there was an error', async function() {
            const fsUtilsRemoveSpy = sinon.spy(fsUtils, 'removeAsync');
            npmAsyncStub.throws();
            await assertThrowsAsync(async () => await runInitAsync());

            assert(fsUtilsRemoveSpy.calledOnceWithExactly(blockDirPath));
            assert(!fs.existsSync(path.join(blockDirPath)));
        });
    });
});
