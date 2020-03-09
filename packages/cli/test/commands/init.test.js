// @flow
const init = require('../../src/commands/init');
const blockCliConfigSettings = require('../../src/config/block_cli_config_settings');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const fsUtils = require('../../src/helpers/fs_utils');
const inquirer = require('inquirer');
const {getTemporaryDirectoryPath, assertThrowsAsync} = require('../helpers');
const configHelpers = require('../../src/helpers/config_helpers');
const initCommandHelpers = require('../../src/helpers/init_command_helpers');
const runBlockCliAsync = require('../../src/run_block_cli_async');
const sinon = require('sinon');
const assert = require('assert');

describe('init', function() {
    // These tests have to run the code in `runBlockCliAsync` so
    // that the yargs processing behaviour is run.  That is where
    // the default template is set to hello world if `--template`
    // is not passed.
    describe('runBlockCliAsync', () => {
        let originalArgv;
        let runCommandAsyncStub;
        let blockDirPath;

        beforeEach(() => {
            blockDirPath = getTemporaryDirectoryPath();
            originalArgv = process.argv;

            // omits template
            process.argv = ['path/to/node', 'block', 'init', 'app/blk', blockDirPath];

            // We don't want to actually run the init command
            runCommandAsyncStub = (sinon.stub(init, 'runCommandAsync'): any); // eslint-disable-line flowtype/no-weak-types
        });

        it('uses hello world template by default', async function() {
            await runBlockCliAsync();

            assert(
                runCommandAsyncStub.calledOnceWith(
                    sinon.match({template: 'https://github.com/Airtable/blocks-hello-world.git'}),
                ),
            );
        });

        afterEach(() => {
            process.argv = originalArgv;
            runCommandAsyncStub.restore();
        });
    });

    describe('init command', () => {
        let installBlockDependenciesAsyncStub;
        let promptAsyncStub;
        let hasApiKeyAsyncStub;
        let setApiKeyAsyncStub;
        let blockDirPath;

        const URL_PREVIEW_TEMPLATE = 'git@github.com:Airtable/blocks-url-preview.git';
        const URL_PREVIEW_DIRECTORY = 'blocks-url-preview';

        function getArgv() {
            return {
                _: [],
                $0: 'block',
                blockIdentifier: 'app123/blkABC',
                template: URL_PREVIEW_TEMPLATE,
                blockDirPath,
            };
        }

        async function createValidTemplateAsync() {
            const gitClonePath = path.join(blockDirPath, 'tmp', URL_PREVIEW_DIRECTORY);

            await fsUtils.mkdirPathAsync(gitClonePath);

            await fsUtils.mkdirPathAsync(path.join(gitClonePath, 'frontend'));
            fs.writeFileSync(path.join(gitClonePath, 'frontend', 'index.js'), 'index.js');
            fsExtra.outputJsonSync(path.join(gitClonePath, 'package.json'), {});
            fsExtra.outputJsonSync(
                path.join(gitClonePath, 'node_modules', '@airtable', 'blocks', 'package.json'),
                {},
            );
            fs.writeFileSync(path.join(gitClonePath, 'block.json'), 'block.json');
            fs.writeFileSync(path.join(gitClonePath, '.eslintrc.js'), '.eslintrc.js');
            fs.writeFileSync(path.join(gitClonePath, '.gitignore'), '.gitignore');
            return gitClonePath;
        }

        function createCustomTemplate(packageJson, sdkPackageJson) {
            return async function createCustomTemplateAsync() {
                const gitClonePath = path.join(blockDirPath, 'tmp', URL_PREVIEW_DIRECTORY);

                await fsUtils.mkdirPathAsync(gitClonePath);

                await fsUtils.mkdirPathAsync(path.join(gitClonePath, 'frontend'));
                fs.writeFileSync(path.join(gitClonePath, 'frontend', 'index.js'), 'index.js');
                fsExtra.outputJsonSync(path.join(gitClonePath, 'package.json'), packageJson);
                fsExtra.outputJsonSync(
                    path.join(gitClonePath, 'node_modules', '@airtable', 'blocks', 'package.json'),
                    sdkPackageJson,
                );
                fs.writeFileSync(path.join(gitClonePath, 'block.json'), 'block.json');
                fs.writeFileSync(path.join(gitClonePath, '.eslintrc.js'), '.eslintrc.js');
                fs.writeFileSync(path.join(gitClonePath, '.gitignore'), '.gitignore');
                return gitClonePath;
            };
        }

        function stubTemplateDownloadHandlers(createTemplateAsync) {
            sinon.stub(initCommandHelpers, 'downloadTemplateAsync').callsFake(createTemplateAsync);
            sinon.stub(initCommandHelpers, 'cleanUpDownloadedTemplateAsync');
        }

        async function runInitAsync(argv) {
            // We stub console.log to tidy up test output, but need to restore it
            // because the test runner relies on it!
            const logStub = sinon.stub(console, 'log');
            await init.runCommandAsync(argv);
            logStub.restore();
        }

        beforeEach(function() {
            blockDirPath = getTemporaryDirectoryPath();

            hasApiKeyAsyncStub = sinon.stub(configHelpers, 'hasApiKeyAsync').resolves(true);
            setApiKeyAsyncStub = sinon.stub(configHelpers, 'setApiKeyAsync').resolves();

            installBlockDependenciesAsyncStub = sinon.stub(
                initCommandHelpers,
                'installBlockDependenciesAsync',
            );
        });

        afterEach(async function() {
            hasApiKeyAsyncStub.restore();
            setApiKeyAsyncStub.restore();
            installBlockDependenciesAsyncStub.restore();
        });

        it('writes a directory of files', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            await runInitAsync(getArgv());

            assert(fs.existsSync(path.join(blockDirPath, '.gitignore')));

            assert(fs.existsSync(path.join(blockDirPath, 'frontend', 'index.js')));

            assert(fs.existsSync(path.join(blockDirPath, '.eslintrc.js')));

            assert(fs.existsSync(path.join(blockDirPath, 'block.json')));

            const remoteJson = await fsExtra.readJson(
                path.join(blockDirPath, '.block', 'remote.json'),
            );
            assert.strictEqual(remoteJson.baseId, 'app123');
            assert.strictEqual(remoteJson.blockId, 'blkABC');

            assert(fs.existsSync(path.join(blockDirPath, 'package.json')));
            assert(
                fs.existsSync(
                    path.join(blockDirPath, 'node_modules', '@airtable', 'blocks', 'package.json'),
                ),
            );
        });

        it('installs dependencies', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            await runInitAsync(getArgv());

            assert(installBlockDependenciesAsyncStub.calledWith(sinon.match(blockDirPath)));
        });

        it('only propagates whitelisted package.json entries', async function() {
            const packageJson = {
                name: 'foobar',
                version: '1.0.0',
                author: 'baz',
                description: 'A very important block',
                dependencies: {
                    a: '1.0.0',
                    b: 'latest',
                },
                devDependencies: {
                    x: '0.5',
                    y: '2.0',
                },
                scripts: {
                    frobnicate: 'frobnicate --confusingly',
                },
                private: true,
                _customA: 1,
                _customB: 'a string',
            };

            const sdkPackageJson = {
                version: '0.0.1',
            };

            stubTemplateDownloadHandlers(createCustomTemplate(packageJson, sdkPackageJson));
            await runInitAsync(getArgv());

            const finalPackageJson = await fsExtra.readJson(
                path.join(blockDirPath, 'package.json'),
            );

            const expectedJson = {
                dependencies: {
                    a: '1.0.0',
                    b: 'latest',
                },
                devDependencies: {
                    x: '0.5',
                    y: '2.0',
                },
                scripts: {
                    frobnicate: 'frobnicate --confusingly',
                },
                private: true,
            };

            assert.deepEqual(finalPackageJson, expectedJson);
        });

        it('rewrites sdk version if latest to current version', async function() {
            const packageJson = {
                dependencies: {
                    [blockCliConfigSettings.SDK_PACKAGE_NAME]: 'latest',
                    other_package: 'latest',
                },
            };
            const sdkPackageJson = {
                version: '0.0.1',
            };
            stubTemplateDownloadHandlers(createCustomTemplate(packageJson, sdkPackageJson));
            await runInitAsync(getArgv());

            const finalPackageJson = await fsExtra.readJson(
                path.join(blockDirPath, 'package.json'),
            );
            assert.strictEqual(
                finalPackageJson.dependencies[blockCliConfigSettings.SDK_PACKAGE_NAME],
                '0.0.1',
            );
            assert.strictEqual(finalPackageJson.dependencies.other_package, 'latest');
        });

        it('keeps sdk version if not latest', async function() {
            const packageJson = {
                dependencies: {
                    [blockCliConfigSettings.SDK_PACKAGE_NAME]: '^0.0.1',
                    other_package: 'latest',
                },
            };
            const sdkPackageJson = {
                version: '0.0.1',
            };
            stubTemplateDownloadHandlers(createCustomTemplate(packageJson, sdkPackageJson));
            await runInitAsync(getArgv());

            const finalPackageJson = await fsExtra.readJson(
                path.join(blockDirPath, 'package.json'),
            );
            assert.strictEqual(
                finalPackageJson.dependencies[blockCliConfigSettings.SDK_PACKAGE_NAME],
                '^0.0.1',
            );
            assert.strictEqual(finalPackageJson.dependencies.other_package, 'latest');
        });

        it('prompts for API key if the user does not have it set already', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            promptAsyncStub = sinon.stub(inquirer, 'prompt').resolves({
                apiKey: 'key123ABC',
            });

            hasApiKeyAsyncStub.resolves(false);

            await runInitAsync(getArgv());

            assert.strictEqual(promptAsyncStub.called, true);
            assert.strictEqual(setApiKeyAsyncStub.called, true);
            promptAsyncStub.restore();
        });

        it('does not prompt for API key if the user does have it set already', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            promptAsyncStub = sinon.stub(inquirer, 'prompt');

            await runInitAsync(getArgv());

            assert.strictEqual(promptAsyncStub.called, false);
            assert.strictEqual(setApiKeyAsyncStub.called, false);
            promptAsyncStub.restore();
        });

        it('throws if git repo not valid template (missing block.json)', async function() {
            // Use invalid template
            stubTemplateDownloadHandlers(async () => {
                const gitClonePath = path.join(blockDirPath, 'tmp', URL_PREVIEW_DIRECTORY);

                await fsUtils.mkdirPathAsync(gitClonePath);
                return gitClonePath;
            });

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert(err.message === `${URL_PREVIEW_TEMPLATE} does not seem to be a block template`);
        });

        it('throws if template download fails', async function() {
            // Doesn't download a template (e.g. because of a 404)
            stubTemplateDownloadHandlers(async () => {
                return path.join(blockDirPath, 'tmp', URL_PREVIEW_DIRECTORY);
            });

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert(err.message.match(`Could not get template ${URL_PREVIEW_TEMPLATE}`));
        });

        it('removes the tmp directory containing the template', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            await runInitAsync(getArgv());
            const cleanUpStub = (initCommandHelpers.cleanUpDownloadedTemplateAsync: any); // eslint-disable-line flowtype/no-weak-types
            assert(cleanUpStub.calledWithExactly(blockDirPath));
        });

        it('removes the block directory if there was an error', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            const fsUtilsRemoveSpy = sinon.spy(fsUtils, 'removeAsync');
            installBlockDependenciesAsyncStub.throws();
            await assertThrowsAsync(async () => await runInitAsync(getArgv()));

            assert(fsUtilsRemoveSpy.calledWithExactly(blockDirPath));
            assert(!fs.existsSync(path.join(blockDirPath)));
        });
    });
});
