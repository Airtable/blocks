#!/usr/bin/env node
// @flow
/* eslint-disable no-console */

/* Smoke test for blocks-cli.
 * Usage:
 *     ./smoke_test.tsx
 *         [--blocks_cli_command path/to/block/command]
 *         [--reinstall_from_npm]
 *
 * WARNING: When running with --reinstall_from_npm, the script will uninstall and
 * re-install the globally installed blocks-cli in the current node environment.
 *
 * Requires access to:
 *     https://airtable.com/appQOxbW7k6mK0Eqd?blocks=bipHcxcRpB0ObTAGo
 */

import * as childProcess from 'child_process';

require('core-js/stable');
require('regenerator-runtime/runtime');
const os = require('os');
const path = require('path');
const util = require('util');
const url = require('url');
const chalk = require('chalk');
const delay = require('delay');
const detectPort = require('detect-port');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');
const {merge} = require('lodash');
const request = require('postman-request');
const which = require('which');
const isWindows = require('is-windows');
const {spawnError} = require('@airtable/blocks/unstable_private_utils');

type CommandResultPromise = Promise<{error: Error | null; stdout: string; stderr: string}>;

const APP_ID = 'appQOxbW7k6mK0Eqd';
const BLOCK_ID = 'blkDOYCZmdADueASi';
const BLOCK_INSTALLATION_ID = 'bipHcxcRpB0ObTAGo';
const DEFAULT_BLOCK_RUN_WAIT_MS = 10 * 1000;
const DEFAULT_BLOCK_RUN_PORT = 9000;
const BLOCK_RELEASE_URL = 'https://block---q-oxb-w7k6m-k0-eqd--suk0375.airtableblocks.com/';
const BLOCKS_CLI_PACKAGE = '@airtable/blocks-cli';
const BLOCK_DIR_NAME = 'smoke_test';

const whichAsync = util.promisify(which);
const requestAsync = util.promisify(request);

function log(message: string, ...args: Array<string>) {
    console.log(chalk.bold.white(`\n> ${message}`), ...args);
}

function kill(pid: number, signal?: string | number) {
    if (isWindows()) {
        childProcess.spawn('taskkill', ['/pid', `${pid}`, '/f', '/t']);
    } else {
        process.kill(pid, signal);
    }
}

class SmokeTest {
    constructor(blocksCliCommand: string, blocksCliRunWaitMs: number, blockRunPort: number) {
        this._blocksCliCommand = blocksCliCommand;
        this._blocksCliRunWaitMs = blocksCliRunWaitMs;
        this._blockRunPort = blockRunPort;
    }

    getBlockRunUrl(): string {
        return `https://localhost:${this._blockRunPort}/`;
    }

    async _requestBlockServerRouteAsync(
        urlBase: string,
        urlPath: string,
        options: {method: string; body?: string; qs?: {payload: string}},
    ) {
        const requestUrl = url.resolve(urlBase, urlPath);
        console.log(chalk.dim(`---> ${requestUrl}`));
        try {
            const response = await requestAsync(
                requestUrl,
                merge(
                    {
                        agentOptions: {
                            rejectUnauthorized: false,
                        },
                    },
                    options,
                ),
            );
            const BODY_TRUNCATION_LIMIT = 5 * 80;
            const truncatedBody =
                response.body.length < BODY_TRUNCATION_LIMIT
                    ? response.body
                    : response.body.substr(0, BODY_TRUNCATION_LIMIT) + '...(truncated)';
            console.log(chalk.dim(truncatedBody));
            return response;
        } catch (e) {
            log(`Failed to fetch from ${requestUrl}:\n`, e);
            throw e;
        }
    }

    _runCommand(
        command: string,
        args: Array<string>,
        cwd?: string,
    ): {
        runProcessPid: number;
        commandResultPromise: CommandResultPromise;
        command: string;
        args: string[];
        cwd: string | undefined;
    } {
        console.log(chalk.dim(`$ ${command} ${args.join(' ')}`));
        let commandProcess;
        let runProcessPid: number = 0;
        const commandResultPromise = new Promise(resolve => {
            commandProcess = childProcess.execFile(
                command,
                args,
                {cwd, encoding: 'utf-8'},
                (error: any, stdout: any, stderr: any) => {
                    resolve({
                        error,
                        stdout,
                        stderr,
                    });
                },
            );

            runProcessPid = commandProcess.pid;

            this._childProcessPids.add(runProcessPid);
            commandProcess.on('exit', () => this._childProcessPids.delete(runProcessPid));
            commandProcess.stdout!.on('data', data => console.log(data.trim()));
            commandProcess.stderr!.on('data', data => console.error(data.trim()));
        }) as CommandResultPromise;
        return {runProcessPid, commandResultPromise, command, args, cwd};
    }

    async _createTempDirAsync() {
        this._tempDirPath = path.join(os.tmpdir(), `blocks-cli-smoke-test-${new Date().getTime()}`);
        log(`Using temporary directory '${this._tempDirPath}'`);
        await fsExtra.mkdirs(this._tempDirPath);
        this._blockDirPath = path.join(this._tempDirPath, BLOCK_DIR_NAME);
    }

    async _removeTempDirAsync() {
        log(`Removing temporary directory '${this._tempDirPath}'`);
        await fsExtra.remove(this._tempDirPath);
    }

    _runBlocksCli(args: Array<string>, cwd?: string) {
        return this._runCommand(this._blocksCliPath, args, cwd);
    }

    async _checkBlocksCliIsExecutableAsync() {
        try {
            this._blocksCliPath = await whichAsync(this._blocksCliCommand);
        } catch (e) {
            log(`Could not find blocks-cli command '${this._blocksCliCommand}'`, e);
            throw e;
        }
        log(`Starting smoke test using blocks-cli at '${this._blocksCliPath}'`);

        if ((await detectPort(this._blockRunPort)) !== this._blockRunPort) {
            log(
                `Port ${this._blockRunPort} is currently in use. ` +
                    'Please kill or wait for termination before running this test.',
            );
            throw spawnError('Port %s is busy', this._blockRunPort);
        }

        log('Checking blocks-cli version');
        const {error: versionError, stdout: versionStdout} = await this._runBlocksCli(['--version'])
            .commandResultPromise;
        if (versionError) {
            log('Failed to get blocks-cli version');
            throw versionError;
        }
        const version = versionStdout.trim();
        log(`blocks-cli reports version '${version}'`);
    }

    async _startBlocksCliRunAsync() {
        log(`Running block and waiting ${this._blocksCliRunWaitMs}ms`);
        const {runProcessPid, commandResultPromise: runResultPromise} = this._runBlocksCli(
            ['run'],
            this._blockDirPath,
        );
        log(`Started blocks-cli with PID ${runProcessPid}`);

        await delay(this._blocksCliRunWaitMs);
        try {
            kill(runProcessPid, 0);
        } catch (e) {
            log('blocks-cli is not running');
            throw e;
        }

        log('Please open a browser to edit the block:');
        console.log(
            `-> ${chalk.bold.underline(
                `https://airtable.com/${APP_ID}?blocks=${BLOCK_INSTALLATION_ID}`,
            )}\n` +
                '-> Click on block dropdown menu and select "Edit app"\n' +
                `-> Enter ${chalk.bold.underline(
                    this.getBlockRunUrl(),
                )} and click "Start editing app"`,
        );
        await inquirer.prompt([
            {
                type: 'input',
                name: 'unused',
                message: 'Press ENTER to continue...',
            },
        ]);

        log('Checking blocks-cli server is up');
        for (const requestFn of [
            () => this._requestBlockServerRouteAsync(this.getBlockRunUrl(), '/', {method: 'GET'}),
            () =>
                this._requestBlockServerRouteAsync(this.getBlockRunUrl(), '/__runFrame/ping', {
                    method: 'HEAD',
                }),
            () =>
                this._requestBlockServerRouteAsync(this.getBlockRunUrl(), '/__runFrame/bundle.js', {
                    method: 'GET',
                }),
        ]) {
            const response = await requestFn();
            if (response.statusCode !== 200) {
                throw spawnError('Unexpected status code: %s', response.statusCode);
            }
        }

        return {runProcessPid, runResultPromise};
    }

    async _stopBlocksCliRunAsync(runState: {
        runProcessPid: number;
        runResultPromise: CommandResultPromise;
    }) {
        const {runProcessPid, runResultPromise} = runState;
        log(`Stopping blocks-cli with PID ${runProcessPid}`);

        kill(runProcessPid, 'SIGINT');

        await runResultPromise;
    }

    async _doBlocksCliReleaseAsync() {
        log('Releasing block');
        const {error: releaseError} = await this._runBlocksCli(['release'], this._blockDirPath)
            .commandResultPromise;
        if (releaseError) {
            log('Failed to release block');
            throw releaseError;
        }

        log('Checking released block is available');
        const runFrameResponse = await this._requestBlockServerRouteAsync(
            BLOCK_RELEASE_URL,
            '/__runFrame',
            {method: 'GET'},
        );
        if (runFrameResponse.statusCode !== 200) {
            throw spawnError('Unexpected status code: %s', runFrameResponse.statusCode);
        }
    }

    async _runBlocksCliWorkflowForDefaultTemplateAsync() {
        log('Testing workflow with default template');

        await this._createTempDirAsync();

        log('Creating block');
        const {error: initError} = await this._runBlocksCli(
            ['init', `${APP_ID}/${BLOCK_ID}`, BLOCK_DIR_NAME],
            this._tempDirPath,
        ).commandResultPromise;
        if (initError) {
            log('Failed to create block');
            throw initError;
        }

        const runState = await this._startBlocksCliRunAsync();
        await this._stopBlocksCliRunAsync(runState);
        await this._doBlocksCliReleaseAsync();
        await this._removeTempDirAsync();
    }

    async _doRunAsync() {
        await this._checkBlocksCliIsExecutableAsync();

        await this._runBlocksCliWorkflowForDefaultTemplateAsync();

        log('Success!');
    }

    async _cleanUpAsync() {
        this._childProcessPids.forEach(pid => {
            try {
                kill(pid);
            } catch (e) {
            }
        });
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
                await this._removeTempDirAsync();
            } else {
                log(`Not removing ${this._tempDirPath}`);
            }
        }
    }

    async runAsync() {
        process.on('SIGINT', async () => {
            await this._cleanUpAsync();
            process.exit(1);
        });

        let exitCode;
        try {
            await this._doRunAsync();
            exitCode = 0;
        } catch (e) {
            console.error(e);
            exitCode = 1;
        }
        await this._cleanUpAsync();
        process.exit(exitCode);
    }

    async installAsync() {
        const npmPath = await whichAsync('npm');

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
            await this._runCommand(npmPath, ['uninstall', '-g', BLOCKS_CLI_PACKAGE])
                .commandResultPromise;
        }

        log(`Installing ${BLOCKS_CLI_PACKAGE}`);
        await this._runCommand(npmPath, ['install', '-g', BLOCKS_CLI_PACKAGE]).commandResultPromise;

        log(`Successfully installed ${BLOCKS_CLI_PACKAGE}`);
    }

    _blocksCliCommand: string;
    _blocksCliRunWaitMs: number;
    _blockRunPort: number;
    _blocksCliPath!: string;
    _tempDirPath!: string;
    _blockDirPath!: string;
    _childProcessPids = new Set<number>();
}

if (require.main === module) {
    (async () => {
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
            })
            .option('block_run_port', {
                type: 'number',
                describe: 'The port to use for block run',
                default: DEFAULT_BLOCK_RUN_PORT,
            }).argv;
        const {blocks_cli_command, blocks_cli_run_wait_ms, block_run_port} = argv;
        const smokeTest = new SmokeTest(blocks_cli_command, blocks_cli_run_wait_ms, block_run_port);
        if (argv.reinstall_from_npm) {
            await smokeTest.installAsync();
        }
        await smokeTest.runAsync();
    })();
}
