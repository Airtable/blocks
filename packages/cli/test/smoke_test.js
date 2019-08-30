#!/usr/bin/env node
// @flow
/* eslint-disable no-console */

/* Smoke test for blocks-cli.
 * Usage:
 *     ./smoke_test.js
 *         [--blocks_cli_command path/to/block/command]
 *         [--reinstall_from_npm]
 *
 * WARNING: When running with --reinstall_from_npm, the script will uninstall and
 * re-install the globally installed blocks-cli in the current node environment.
 *
 * Requires access to:
 *     https://airtable.com/tbleA2gWqSbqgtXFD?blocks=bipHcxcRpB0ObTAGo
 */

require('@babel/polyfill');
const chalk = require('chalk');
const childProcess = require('child_process');
const delay = require('delay');
const detectPort = require('detect-port');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');
const invariant = require('invariant');
const os = require('os');
const path = require('path');
const request = require('request');
const util = require('util');
const which = require('which');
const isWindows = require('is-windows');

const APP_ID = 'appQOxbW7k6mK0Eqd';
const BLOCK_ID = 'blkDOYCZmdADueASi';
const DEFAULT_BLOCK_RUN_WAIT_MS = 10 * 1000;
const BLOCK_RUN_PORT = 9000;
const BLOCK_RUN_URL = `https://localhost:${BLOCK_RUN_PORT}/`;
const BLOCKS_CLI_PACKAGE = '@airtable/blocks-cli';

const whichAsync = util.promisify(which);
const requestAsync = util.promisify(request);

function log(message: string, ...args) {
    console.log(chalk.bold.white(`\n> ${message}`), ...args);
}

// TODO(Chuan): Merge into child_process_helpers.js
function kill(pid: number) {
    if (isWindows()) {
        childProcess.spawn('taskkill', ['/pid', `${pid}`, '/f', '/t']);
    } else {
        process.kill(pid);
    }
}

class SmokeTest {
    constructor(blocksCliCommand: string, blocksCliRunWaitMs: number) {
        this._blocksCliCommand = blocksCliCommand;
        this._blocksCliRunWaitMs = blocksCliRunWaitMs;
    }

    _runCommand(command: string, args: Array<string>, cwd?: string) {
        invariant(command, 'command');
        console.log(chalk.dim(`$ ${command} ${args.join(' ')}`));
        let commandProcess;
        const commandResultPromise = new Promise<{error: ?Error, stdout: string, stderr: string}>(
            resolve => {
                commandProcess = childProcess.execFile(
                    command,
                    args,
                    {cwd, encoding: 'utf-8'},
                    (error, stdout, stderr) => {
                        resolve({
                            error,
                            // flow-disable-next-line because it isn't aware these will be strings.
                            stdout,
                            // flow-disable-next-line ditto
                            stderr,
                        });
                    },
                );
            },
        );
        // Suppresses uninitialized variable warnings in FLow.
        invariant(commandProcess, 'commandProcess');
        const {pid} = commandProcess;
        this._childProcessPids.add(pid);
        commandProcess.on('exit', () => this._childProcessPids.delete(pid));
        commandProcess.stdout.on('data', data => console.log(data.trim()));
        commandProcess.stderr.on('data', data => console.error(data.trim()));
        return {commandProcess, commandResultPromise};
    }

    _runBlocksCli(args: Array<string>, cwd?: string) {
        return this._runCommand(this._blocksCliPath, args, cwd);
    }

    async _doRunAsync(): Promise<boolean> {
        // Check block command exists.
        try {
            this._blocksCliPath = await whichAsync(this._blocksCliCommand);
        } catch (e) {
            log(`Could not find blocks-cli command '${this._blocksCliCommand}'`, e);
            return false;
        }
        log(`Starting smoke test using blocks-cli at '${this._blocksCliPath}'`);

        // Check if there is a blocks-cli process running elsewhere.
        if ((await detectPort(BLOCK_RUN_PORT)) !== BLOCK_RUN_PORT) {
            log(
                `Port ${BLOCK_RUN_PORT} is currently in use. ` +
                    'Please kill or wait for termination before running this test.',
            );
            return false;
        }

        // Check block --version.
        log('Checking blocks-cli version');
        const {error: versionError, stdout: versionStdout} = await this._runBlocksCli(['--version'])
            .commandResultPromise;
        if (versionError) {
            log('Failed to get blocks-cli version');
            return false;
        }
        const version = versionStdout.trim();
        log(`blocks-cli reports version '${version}'`);

        // Set up temp dir for block code.
        this._tempDirPath = path.join(os.tmpdir(), `blocks-cli-smoke-test-${new Date().getTime()}`);
        log(`Using temporary directory '${this._tempDirPath}'`);
        await fsExtra.mkdirs(this._tempDirPath);

        // Check block init.
        log('Creating block');
        const {error: initError} = await this._runBlocksCli(
            ['init', `${APP_ID}/${BLOCK_ID}`, 'smoke_test'],
            this._tempDirPath,
        ).commandResultPromise;
        if (initError) {
            log('Failed to create block');
            return false;
        }
        const blockDir = path.join(this._tempDirPath, 'smoke_test');

        // Check block run.
        log(`Running block and waiting ${this._blocksCliRunWaitMs}ms`);
        const {
            commandProcess: runProcess,
            commandResultPromise: runResultPromise,
        } = this._runBlocksCli(['run'], blockDir);
        log(`Started blocks-cli with PID ${runProcess.pid}`);
        await delay(this._blocksCliRunWaitMs);
        try {
            process.kill(runProcess.pid, 0);
        } catch (e) {
            log('blocks-cli is not running');
            return false;
        }

        log(`Checking blocks-cli server at ${BLOCK_RUN_URL}`);
        try {
            let response = await requestAsync(BLOCK_RUN_URL, {
                method: 'GET',
                agentOptions: {
                    rejectUnauthorized: false,
                },
            });
            log(`Successfully fetched from ${BLOCK_RUN_URL}:\n`, response.body);
        } catch (e) {
            log(`Failed to fetch from ${BLOCK_RUN_URL}:\n`, e);
            return false;
        }

        log(`Stopping blocks-cli with PID ${runProcess.pid}`);
        kill(runProcess.pid);
        await runResultPromise;

        // Check block release.
        log('Releasing block');
        const {error: releaseError} = await this._runBlocksCli(['release'], blockDir)
            .commandResultPromise;
        if (releaseError) {
            log('Failed to release block');
            return false;
        }

        log(`Removing temporary directory '${this._tempDirPath}'`);
        await fsExtra.remove(this._tempDirPath);

        log('Success!');
        return true;
    }

    async _cleanUpAsync() {
        // Kill dangling child processes.
        this._childProcessPids.forEach(pid => {
            try {
                kill(pid);
            } catch (e) {
                // No-op
            }
        });
        // Remove temp dir.
        if (this._tempDirPath && (await fsExtra.pathExists(this._tempDirPath))) {
            const {shouldDeleteTempDir} = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'shouldDeleteTempDir',
                    message: 'Smoke test failed. Remove temporary directory?',
                    default: true,
                },
            ]);
            if (shouldDeleteTempDir) {
                log(`Removing '${this._tempDirPath}'`);
                await fsExtra.remove(this._tempDirPath);
            } else {
                log(`Not removing ${this._tempDirPath}`);
            }
        }
    }

    async runAsync() {
        // Catch Ctrl-C.
        process.on('SIGINT', async () => {
            await this._cleanUpAsync();
            process.exit(1);
        });

        // Run _doAsync() and catch all errors.
        let exitCode;
        try {
            exitCode = (await this._doRunAsync()) ? 0 : 1;
        } catch (e) {
            console.error(chalk.red('\nUnexpected error:\n', e));
            exitCode = 1;
        }
        await this._cleanUpAsync();
        process.exit(exitCode);
    }

    async installAsync() {
        const npmPath = await whichAsync('npm');

        // Remove existing installation if exists.
        log(`Checking for existing ${BLOCKS_CLI_PACKAGE} installation`);
        const {error: npmListError, stdout: npmListStdout} = await this._runCommand(npmPath, [
            'list',
            '-g',
            BLOCKS_CLI_PACKAGE,
        ]).commandResultPromise;
        if (!npmListError && npmListStdout.includes(BLOCKS_CLI_PACKAGE)) {
            log(
                `WARNING: ${BLOCKS_CLI_PACKAGE} will be globally uninstalled and re-installed. ` +
                    'Please abort with Ctrl-C if this is not desired.',
            );
            console.log('Waiting 5s...');
            await delay(5000);
            log(`Removing existing ${BLOCKS_CLI_PACKAGE} installation`);
            const {error: npmUninstallError} = await this._runCommand(npmPath, [
                'uninstall',
                '-g',
                BLOCKS_CLI_PACKAGE,
            ]).commandResultPromise;
            invariant(!npmUninstallError, 'npmUninstallError');
        }

        log(`Installing ${BLOCKS_CLI_PACKAGE}`);
        const {error: npmInstallError} = await this._runCommand(npmPath, [
            'install',
            '-g',
            BLOCKS_CLI_PACKAGE,
        ]).commandResultPromise;
        invariant(!npmInstallError, 'npmInstallError');

        log(`Successfully installed ${BLOCKS_CLI_PACKAGE}`);
    }

    _blocksCliCommand: string;
    _blocksCliRunWaitMs: number;
    _blocksCliPath: string;
    _tempDirPath: string;
    _childProcessPids = new Set<number>();
}

// Entrypoint
if (require.main === module) {
    (async () => {
        // yargs must be require'd here and not at the module level. This is because
        // yargs stores state globally, and when mocha require's all modules in this
        // directory, require-ing yargs in this file at the module level would end
        // up breaking other unit tests.
        const yargs = require('yargs');
        const argv = yargs
            .option('blocks_cli_command', {
                type: 'string',
                default: 'block',
                describe: 'Name or path of blocks-cli binary',
            })
            .option('reinstall_from_npm', {
                type: 'boolean',
                describe: 'If true, will globally uninstall and re-install blocks-cli from NPM',
            })
            .option('blocks_cli_run_wait_ms', {
                type: 'number',
                describe: 'Time in ms to wait for blocks-cli "run" command',
                default: DEFAULT_BLOCK_RUN_WAIT_MS,
            }).argv;
        const smokeTest = new SmokeTest(
            // eslint-disable-next-line flowtype/no-weak-types
            ((argv.blocks_cli_command: any): string),
            // eslint-disable-next-line flowtype/no-weak-types
            ((argv.blocks_cli_run_wait_ms: any): number),
        );
        if (argv.reinstall_from_npm) {
            await smokeTest.installAsync();
        }
        await smokeTest.runAsync();
    })();
}
