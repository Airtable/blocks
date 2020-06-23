// @flow
const init = require('../../src/commands/init');
const blockCliConfigSettings = require('../../src/config/block_cli_config_settings');
const path = require('path');
const {execFile} = require('child_process');
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
        let cleanUpDownloadedTemplateAsyncStub;
        let blockDirPath;
        let templateSource;

        function getArgv() {
            return {
                _: [],
                $0: 'block',
                blockIdentifier: 'app123/blkABC',
                template: templateSource,
                blockDirPath,
            };
        }

        async function createValidTemplateAsync(gitClonePath) {
            await fsUtils.mkdirPathAsync(path.join(gitClonePath, 'frontend'));
            fs.writeFileSync(path.join(gitClonePath, 'frontend', 'index.js'), 'index.js');
            fsExtra.outputJsonSync(path.join(gitClonePath, 'package.json'), {});
            fsExtra.outputJsonSync(
                path.join(gitClonePath, 'node_modules', '@airtable', 'blocks', 'package.json'),
                {},
            );
            fs.writeFileSync(path.join(gitClonePath, 'block.json'), 'block.json');
            fs.writeFileSync(path.join(gitClonePath, '.eslintrc.js'), '.eslintrc.js');
            fs.writeFileSync(path.join(gitClonePath, '.gitignore'), 'gitignore');
        }

        function createCustomTemplate(packageJson, sdkPackageJson) {
            return async function createCustomTemplateAsync(gitClonePath) {
                await fsUtils.mkdirPathAsync(path.join(gitClonePath, 'frontend'));
                fs.writeFileSync(path.join(gitClonePath, 'frontend', 'index.js'), 'index.js');
                fsExtra.outputJsonSync(path.join(gitClonePath, 'package.json'), packageJson);
                fsExtra.outputJsonSync(
                    path.join(gitClonePath, 'node_modules', '@airtable', 'blocks', 'package.json'),
                    sdkPackageJson,
                );
                fs.writeFileSync(path.join(gitClonePath, 'block.json'), 'block.json');
                fs.writeFileSync(path.join(gitClonePath, '.eslintrc.js'), '.eslintrc.js');
                fs.writeFileSync(path.join(gitClonePath, '.gitignore'), 'gitignore');
            };
        }

        async function gitAsync(args, options) {
            // Explicitly set credentials to allow these commands to run in
            // environments which are not fully configured for development
            // (e.g. continuous integration).
            const credentials = ['-c', 'user.name=Fake Name', '-c', 'user.email=fake@email.com'];

            return new Promise((resolve, reject) => {
                execFile('git', credentials.concat(args), options, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        }

        async function stubTemplateDownloadHandlersAsync(createTemplateAsync) {
            await fsUtils.mkdirPathAsync(templateSource);
            await createTemplateAsync(templateSource);

            await gitAsync(['init'], {cwd: templateSource});
            await gitAsync(['add', '.'], {cwd: templateSource});
            await gitAsync(['commit', '--allow-empty', '--message', 'Initial commit'], {
                cwd: templateSource,
            });
        }

        async function runInitAsync(argv) {
            // We stub console.log to tidy up test output, but need to restore it
            // because the test runner relies on it!
            const logStub = sinon.stub(console, 'log');
            try {
                await init.runCommandAsync(argv);
            } finally {
                logStub.restore();
            }
        }

        beforeEach(function() {
            blockDirPath = getTemporaryDirectoryPath();
            templateSource = getTemporaryDirectoryPath();

            hasApiKeyAsyncStub = sinon.stub(configHelpers, 'hasApiKeyAsync').resolves(true);
            setApiKeyAsyncStub = sinon.stub(configHelpers, 'setApiKeyAsync').resolves();
            cleanUpDownloadedTemplateAsyncStub = sinon.stub(
                initCommandHelpers,
                'cleanUpDownloadedTemplateAsync',
            );

            installBlockDependenciesAsyncStub = sinon.stub(
                initCommandHelpers,
                'installBlockDependenciesAsync',
            );
        });

        afterEach(async function() {
            await fsUtils.removeAsync(templateSource);
            hasApiKeyAsyncStub.restore();
            setApiKeyAsyncStub.restore();
            cleanUpDownloadedTemplateAsyncStub.restore();
            installBlockDependenciesAsyncStub.restore();
        });

        it('writes a directory of files', async function() {
            await stubTemplateDownloadHandlersAsync(createValidTemplateAsync);
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
            await stubTemplateDownloadHandlersAsync(createValidTemplateAsync);
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

            await stubTemplateDownloadHandlersAsync(
                createCustomTemplate(packageJson, sdkPackageJson),
            );
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
            await stubTemplateDownloadHandlersAsync(
                createCustomTemplate(packageJson, sdkPackageJson),
            );
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
            await stubTemplateDownloadHandlersAsync(
                createCustomTemplate(packageJson, sdkPackageJson),
            );
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
            await stubTemplateDownloadHandlersAsync(createValidTemplateAsync);
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
            await stubTemplateDownloadHandlersAsync(createValidTemplateAsync);
            promptAsyncStub = sinon.stub(inquirer, 'prompt');

            await runInitAsync(getArgv());

            assert.strictEqual(promptAsyncStub.called, false);
            assert.strictEqual(setApiKeyAsyncStub.called, false);
            promptAsyncStub.restore();
        });

        it('throws if git repo not valid template (missing block.json)', async function() {
            // Use invalid template
            await stubTemplateDownloadHandlersAsync(gitClonePath => {});

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert.equal(err.message, `${templateSource} does not seem to be a block template`);
        });

        it('throws if template download fails', async function() {
            // Doesn't download a template (e.g. because of a 404)
            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert(err.message.match(`Could not get template ${templateSource}`));
        });

        it('throws if Node module installation fails', async function() {
            const packageJson = {
                dependencies: {
                    '@airtable/highly-improbable-package-name': '99.99.9993',
                },
            };
            const sdkPackageJson = {};
            await stubTemplateDownloadHandlersAsync(
                createCustomTemplate(packageJson, sdkPackageJson),
            );
            installBlockDependenciesAsyncStub.restore();

            const err = await assertThrowsAsync(async () => {
                await runInitAsync(getArgv());
            });
            assert(err.message.match(/\bnpm\b/));
        });

        it('removes the tmp directory containing the template', async function() {
            await stubTemplateDownloadHandlersAsync(createValidTemplateAsync);
            await runInitAsync(getArgv());
            const cleanUpStub = (initCommandHelpers.cleanUpDownloadedTemplateAsync: any); // eslint-disable-line flowtype/no-weak-types
            assert(cleanUpStub.calledWithExactly(blockDirPath));
        });

        it('removes the block directory if there was an error', async function() {
            await stubTemplateDownloadHandlersAsync(createValidTemplateAsync);
            const fsUtilsRemoveSpy = sinon.spy(fsUtils, 'removeAsync');
            installBlockDependenciesAsyncStub.throws();
            await assertThrowsAsync(async () => await runInitAsync(getArgv()));

            assert(fsUtilsRemoveSpy.calledWithExactly(blockDirPath));
            assert(!fs.existsSync(path.join(blockDirPath)));
        });
    });
});
