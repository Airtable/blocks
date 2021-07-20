import {flags as commandFlags} from '@oclif/command';
import _debug from 'debug';
import archiver from 'archiver';

import cli from '../helpers/cli_ux';

import AirtableCommand from '../helpers/airtable_command';
import {
    AIRTABLE_API_URL,
    APP_RELEASE_DIR,
    APP_ROOT_TEMPORARY_DIR,
    SUBMIT_ARCHIVE_NAME,
    V2_BLOCKS_BASE_ID,
} from '../settings';

import {createSubmitTaskAsync, SubmitTaskProducer} from '../manager/submit';
import {SubmitTaskConsumerAdapter} from '../manager/submit_adapter';

import {
    findAppConfigAsync,
    findAppDirectoryAsync,
    findRemoteConfigPathByNameAsync,
    readAppConfigAsync,
    readRemoteConfigAsync,
    validateRemoteName,
} from '../helpers/system_config';
import {renderEntryPointAsync} from '../helpers/render_entry_point_async';
import {mkdirpAsync, rmdirAsync, unlinkIfExistsAsync} from '../helpers/system_extra';
import {readApiKeyAsync} from '../helpers/system_api_key';
import {createUserAgentAsync} from '../helpers/user_agent';
import {Deferred} from '../helpers/deferred';
import {unwrapResultFunctor} from '../helpers/result';
import {System} from '../helpers/system';
import {SubmitCommandErrorName, SubmitCommandMessageName} from '../helpers/submit_messages';
import {spawnUserError} from '../helpers/error_utils';
import {AirtableLegacyBlockApi} from '../helpers/airtable_legacy_block_api';
import {AirtableBlockV2Api} from '../helpers/airtable_block_v2_api';
import {AirtableApi} from '../helpers/airtable_api';

const debug = _debug('block-cli:command:submit');

class SubmitProducer implements SubmitTaskProducer {
    readyDefer = new Deferred<void>();

    async readyAsync() {
        this.readyDefer.resolve();
    }
}

export default class Submit extends AirtableCommand {
    private _task?: SubmitTaskConsumerAdapter;
    private _teardownAction?: (() => void) | null;
    /**
     * A file system path describing the location where a temporary directory
     * should be created to store the generated file(s).
     */
    private _appTemporaryPath?: string;

    static description = 'Submit app for review for listing in the the Airtable Marketplace';

    static examples = [
        `$ block submit
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),
        remote: commandFlags.string({
            description: 'Configure which remote to use',
            parse: unwrapResultFunctor(validateRemoteName),
        }),
    };

    async runAsync() {
        const {flags} = this.parse(Submit);

        const sys = this.system;
        const workingdir = sys.process.cwd();

        const appRootPath = await findAppDirectoryAsync(sys, workingdir);
        const appConfigPath = await findAppConfigAsync(sys, appRootPath);
        const appConfigResult = await readAppConfigAsync(sys, appConfigPath);
        if (appConfigResult.err) {
            this.error(appConfigResult.err);
        }
        const appConfig = appConfigResult.value;
        debug('loaded app config at %s', sys.path.relative(workingdir, appConfigPath));

        const remoteConfigPath = await findRemoteConfigPathByNameAsync(
            sys,
            workingdir,
            flags.remote,
        );
        const remoteConfigResult = await readRemoteConfigAsync(sys, remoteConfigPath);
        if (remoteConfigResult.err) {
            this.error(remoteConfigResult.err);
        }
        const remoteConfig = remoteConfigResult.value;
        const {baseId, blockId} = remoteConfig;
        debug('loaded remote config at %s', sys.path.relative(workingdir, remoteConfigPath));

        const apiKeyResult = await readApiKeyAsync(sys, remoteConfig.apiKeyName);
        if (apiKeyResult.err) {
            this.error(apiKeyResult.err);
        }
        const apiKey = apiKeyResult.value;
        debug('loaded apiKey %s', remoteConfig.apiKeyName ?? 'default');

        const userAgent = await createUserAgentAsync(sys);
        debug('connecting to Airtable with user agent: %s', userAgent);

        const producer = new SubmitProducer();
        const task = await createSubmitTaskAsync(
            sys,
            {module: appConfig.bundler?.module, workingdir: appRootPath},
            producer,
        );
        this._task = task;
        debug('initialized task');

        this._appTemporaryPath = sys.path.join(appRootPath, APP_ROOT_TEMPORARY_DIR);
        await mkdirpAsync(sys, this._appTemporaryPath);
        debug('created temporary directory');

        const appBuildPath = sys.path.join(this._appTemporaryPath, APP_RELEASE_DIR);
        await mkdirpAsync(sys, appBuildPath);
        debug('created build directory');

        cli.action.start('Finding dependencies');
        this._teardownAction = () => {
            this._teardownAction = null;
            cli.action.stop('Incomplete');
        };

        const entryPointPath = sys.path.join(this._appTemporaryPath, 'index.js');
        const userEntryPoint = sys.path.join(appRootPath, appConfig.frontendEntry);
        const entryPoint = await renderEntryPointAsync(sys, {
            mode: 'production',
            destination: entryPointPath,
            userEntryPoint,
        });
        await sys.fs.writeFileAsync(entryPointPath, Buffer.from(entryPoint));
        debug('wrote generated entry file at %s', sys.path.relative(workingdir, entryPointPath));

        await producer.readyDefer.promise;

        debug('finding dependencies');
        const dependencies = await task.findDependenciesAsync({
            mode: 'production',
            context: appRootPath,
            entry: entryPointPath,
        });
        debug('found %d dependencies', dependencies.files.length);

        cli.action.stop();
        cli.action.start('Packaging');

        const projectItems = await projectFilesAsync(sys, appRootPath);
        debug('project has %d descendant files', projectItems.length);

        const uniqueItems = [...projectItems, ...dependencies.files].reduce((carry, file) => {
            if (!carry.includes(file)) {
                carry.push(file);
            }
            return carry;
        }, [] as string[]);

        const filesOnly = (
            await Promise.all(
                uniqueItems.map(file =>
                    sys.fs
                        .readdirAsync(file)
                        .then(() => null)
                        .catch(() => file),
                ),
            )
        ).filter(Boolean) as string[];

        const commonRootPath = filesOnly
            .map(file => sys.path.dirname(file))
            .reduce((carry, dir) => {
                while (!dir.startsWith(carry)) {
                    const lastCarry = carry;
                    carry = sys.path.dirname(carry);
                    if (lastCarry === carry) {
                        throw spawnUserError({
                            type: SubmitCommandErrorName.SUBMIT_COMMAND_WINDOWS_MULTIPLE_DISKS,
                        });
                    }
                }
                return carry;
            });
        const commonRootRelativePath = sys.path.relative(workingdir, commonRootPath);

        const outputPath = sys.path.join(appBuildPath, SUBMIT_ARCHIVE_NAME);
        const outputRelativePath = sys.path.relative(workingdir, outputPath);
        await unlinkIfExistsAsync(sys, outputPath);
        const output = sys.fs.createWriteStream(outputPath);
        debug('writing zip to %s', outputRelativePath);

        const zip = archiver('zip');
        zip.pipe(output);
        zip.append(Buffer.from(sys.path.relative(commonRootPath, appRootPath)), {
            name: 'AIRTABLE_BLOCK_ROOT_PATH',
        });
        const zipFileTable = ['AIRTABLE_BLOCK_ROOT_PATH'];
        for (const file of filesOnly) {
            const name = sys.path.relative(commonRootPath, file);
            zipFileTable.push(name);
            zip.append(sys.fs.createReadStream(file), {
                name,
            });
        }
        const fileStreamClosedPromise = new Promise(resolve => {
            output.on('close', resolve);
        });
        await zip.finalize();
        await fileStreamClosedPromise;
        await sys.fs.writeFileAsync(
            sys.path.join(appBuildPath, 'block_archive.files.txt'),
            Buffer.from(`${zipFileTable.join('\n')}\n`),
        );

        const archiveBuffer = await sys.fs.readFileAsync(
            sys.path.join(appBuildPath, SUBMIT_ARCHIVE_NAME),
        );
        debug(
            'zipped up %d bytes from %d files under the common directory %s',
            archiveBuffer.byteLength,
            filesOnly.length,
            commonRootRelativePath,
        );

        cli.action.stop();

        const check = await cli.prompt(
            this.messages.renderMessage({
                type: SubmitCommandMessageName.SUBMIT_COMMAND_PACKAGED_CONTINUE_PROMPT,
            }),
            {
                default: 'N',
            },
        );
        if (check === 'N') {
            this.logMessage({type: SubmitCommandMessageName.SUBMIT_COMMAND_STOP_AFTER_PACKAGING});
            return;
        }

        cli.action.start('Submitting');

        let airtableApi: AirtableApi;
        if (baseId === V2_BLOCKS_BASE_ID) {
            airtableApi = new AirtableBlockV2Api({
                blockId,
                apiKey,
                userAgent,
                apiBaseUrl: remoteConfig.server ?? AIRTABLE_API_URL,
            });
        } else {
            airtableApi = new AirtableLegacyBlockApi({
                baseId,
                blockId,
                apiKey,
                userAgent,
                apiBaseUrl: remoteConfig.server ?? AIRTABLE_API_URL,
            });
        }
        const submitResponseMessage = await airtableApi.uploadSubmissionAsync({
            archiveBuffer,
        });

        cli.action.stop();
        this._teardownAction = null;

        this.log(submitResponseMessage);
    }

    async finallyAsync() {
        await Promise.all([
            this._appTemporaryPath ? rmdirAsync(this.system, this._appTemporaryPath) : null,
            this._task ? this._task.teardownAsync() : null,
            this._teardownAction ? this._teardownAction() : null,
        ]);
    }
}

const excludeProjectItems = ['node_modules', 'build', '.tmp', '.git'];
async function projectFilesAsync(sys: System, dir: string): Promise<string[]> {
    if (excludeProjectItems.includes(sys.path.parse(dir).base)) {
        return [];
    }
    try {
        const entries = await sys.fs.readdirAsync(dir);
        const nested = await Promise.all(
            entries.map(entry => projectFilesAsync(sys, sys.path.join(dir, entry))),
        );
        return ([] as string[]).concat(...nested);
    } catch (err) {
        if (err.code === 'ENOTDIR') {
            return [dir];
        }
        throw err;
    }
}
