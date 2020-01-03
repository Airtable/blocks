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
const nodeModulesCommandHelpers = require('../../src/helpers/node_modules_command_helpers');
const runBlockCliAsync = require('../../src/run_block_cli_async');
const sinon = require('sinon');
const assert = require('assert');
const {merge} = require('lodash');

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

    // Once we feel confident in the template-download mechanism,
    // we can replace the custom hello world installation with a
    // template.  Then, we can delete all these tests.
    describe('init command with hello world default template', () => {
        describe('runCommandAsync', () => {
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
                    template: '@airtable/hello-world',
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

            it('uses the Hello World template', async function() {
                await runInitAsync();

                assert(
                    fs
                        .readFileSync(path.join(blockDirPath, 'frontend', 'index.js'), 'utf8')
                        .match('Hello world'),
                );
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

            it('uses hello world template', async function() {
                await runBlockCliAsync();

                assert(
                    runCommandAsyncStub.calledOnceWith(
                        sinon.match({template: '@airtable/hello-world'}),
                    ),
                );
            });

            afterEach(() => {
                process.argv = originalArgv;
                runCommandAsyncStub.restore();
            });
        });
    });

    describe('init command with non hello world template', () => {
        let installBlockDependenciesAsyncStub;
        let promptAsyncStub;
        let hasApiKeyAsyncStub;
        let setApiKeyAsyncStub;
        let blockDirPath;

        const YOUTUBE_PREVIEW_TEMPLATE = '@airtable/youtube-preview';

        function getArgv() {
            return {
                _: [],
                $0: 'block',
                blockIdentifier: 'app123/blkABC',
                template: YOUTUBE_PREVIEW_TEMPLATE,
                blockDirPath,
            };
        }

        async function createValidTemplateAsync() {
            const npmInstallPath = path.join(
                blockDirPath,
                'tmp',
                'node_modules',
                YOUTUBE_PREVIEW_TEMPLATE,
            );

            await fsUtils.mkdirPathAsync(npmInstallPath);

            await fsUtils.mkdirPathAsync(path.join(npmInstallPath, 'frontend'));
            fs.writeFileSync(path.join(npmInstallPath, 'frontend', 'index.js'), 'index.js');
            fsExtra.outputJsonSync(path.join(npmInstallPath, 'package.json'), {});
            fsExtra.outputJsonSync(
                path.join(npmInstallPath, 'node_modules', '@airtable', 'blocks', 'package.json'),
                {},
            );
            fs.writeFileSync(path.join(npmInstallPath, 'block.json'), 'block.json');
            fs.writeFileSync(path.join(npmInstallPath, '.eslintrc.js'), '.eslintrc.js');
            fs.writeFileSync(path.join(npmInstallPath, '__gitignore'), '__gitignore');
            return npmInstallPath;
        }

        function createCustomTemplate(packageJson, sdkPackageJson) {
            return async function createCustomTemplateAsync() {
                const npmInstallPath = path.join(
                    blockDirPath,
                    'tmp',
                    'node_modules',
                    YOUTUBE_PREVIEW_TEMPLATE,
                );

                await fsUtils.mkdirPathAsync(npmInstallPath);

                await fsUtils.mkdirPathAsync(path.join(npmInstallPath, 'frontend'));
                fs.writeFileSync(path.join(npmInstallPath, 'frontend', 'index.js'), 'index.js');
                fsExtra.outputJsonSync(path.join(npmInstallPath, 'package.json'), packageJson);
                fsExtra.outputJsonSync(
                    path.join(
                        npmInstallPath,
                        'node_modules',
                        '@airtable',
                        'blocks',
                        'package.json',
                    ),
                    sdkPackageJson,
                );
                fs.writeFileSync(path.join(npmInstallPath, 'block.json'), 'block.json');
                fs.writeFileSync(path.join(npmInstallPath, '.eslintrc.js'), '.eslintrc.js');
                fs.writeFileSync(path.join(npmInstallPath, '__gitignore'), '__gitignore');
                return npmInstallPath;
            };
        }

        function stubTemplateDownloadHandlers(createTemplateAsync) {
            sinon.stub(initCommandHelpers, 'downloadTemplateAsync').callsFake(createTemplateAsync);
            sinon.stub(initCommandHelpers, 'cleanUpDownloadedTemplateAsync');
        }

        async function runInitAsync(argv) {
            // We stub console.log to tidy up test output, but need to restore it
            // because the test runner relies on it!
            sinon.stub(console, 'log');
            await init.runCommandAsync(argv);
            console.log.restore(); // eslint-disable-line no-console
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
        });

        it('does not prompt for API key if the user does have it set already', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            promptAsyncStub = sinon.stub(inquirer, 'prompt');

            await runInitAsync(getArgv());

            assert.strictEqual(promptAsyncStub.called, false);
            assert.strictEqual(setApiKeyAsyncStub.called, false);
        });

        it('throws if template not prefixed with `@airtable/`', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            let argVWithBadTemplate = merge(getArgv(), {template: 'no @airtable/'});

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(argVWithBadTemplate);
            });
            assert(err.message.match(/Block templates must be official Airtable example blocks/));
        });

        it('throws if template includes @airtable prefix but no package name', async function() {
            stubTemplateDownloadHandlers(createValidTemplateAsync);
            let argVWithBadTemplate = merge(getArgv(), {template: '@airtable/'});

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(argVWithBadTemplate);
            });
            assert(err.message.match(/Block templates must be official Airtable example blocks/));
        });

        it('throws if npm package not valid template (missing block.json)', async function() {
            // Use invalid template
            stubTemplateDownloadHandlers(async () => {
                const npmInstallPath = path.join(
                    blockDirPath,
                    'tmp',
                    'node_modules',
                    YOUTUBE_PREVIEW_TEMPLATE,
                );

                await fsUtils.mkdirPathAsync(npmInstallPath);
                return npmInstallPath;
            });

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert(
                err.message === '@airtable/youtube-preview does not seem to be a block template',
            );
        });

        it('throws if template download fails', async function() {
            // Doesn't download a template (e.g. because of a 404)
            stubTemplateDownloadHandlers(async () => {
                const npmInstallPath = path.join(
                    blockDirPath,
                    'tmp',
                    'node_modules',
                    YOUTUBE_PREVIEW_TEMPLATE,
                );

                return npmInstallPath;
            });

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert(err.message.match('Could not get template @airtable/youtube-preview'));
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
