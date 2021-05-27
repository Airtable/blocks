import {flags as commandFlags} from '@oclif/command';
import * as Parser from '@oclif/parser';
import _debug from 'debug';

import AirtableCommand from '../helpers/airtable_command';
import cli from '../helpers/cli_ux';

import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    INIT_DEFAULT_TEMPLATE_URL,
    INIT_TEMPLATE_CACHE_DIRECTORY,
    INIT_TEMPLATE_EXTRACT_DIRECTORY,
    INIT_TEMPLATE_TARBALL_FILENAME,
    REMOTE_JSON_BASE_FILE_PATH,
    SDK_PACKAGE_NAME,
} from '../settings';

import {
    dirExistsAsync,
    copyAsync,
    mkdirpAsync,
    readJsonIfExistsAsync,
    rmdirAsync,
    writeFormattedJsonAsync,
} from '../helpers/system_extra';
import {readGlobalApiKeyAsync} from '../helpers/system_api_key';
import {parseBlockIdentifier, BlockIdentifier} from '../helpers/block_identifier';
import {Result} from '../helpers/result';
import {spawnUserError} from '../helpers/error_utils';
import * as appTemplateUtils from '../helpers/app_template_utils';
import {System} from '../helpers/system';
import {writeRemoteConfigAsync} from '../helpers/system_config';
import * as npm from '../helpers/npm_async';
import {
    InitCommandErrorInfo,
    InitCommandErrorName,
    InitCommandMessageName,
} from '../helpers/init_messages';

const debug = _debug('block-cli:command:init');

export default class Init extends AirtableCommand {
    private _teardownAction: (() => Promise<void>) | null = null;

    static description = 'Initialize an Airtable app project';

    static examples = [
        `$ block init app12345678/blk12345678 hellow-world-app --template ${INIT_DEFAULT_TEMPLATE_URL}
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),
        template: commandFlags.string({default: INIT_DEFAULT_TEMPLATE_URL}),
    };

    static args: Parser.args.Input = [
        {
            name: 'blockIdentifier',
            required: true,
            parse: parseBlockIdentifier,
        },
        {
            name: 'blockDirPath',
            required: true,
        },
    ];

    async runAsync() {
        const {
            args: {blockIdentifier, blockDirPath},
            flags,
        }: {
            args: {blockIdentifier: Result<BlockIdentifier>; blockDirPath: string};
            flags: {template: string};
        } = this.parse(Init);

        if (blockIdentifier.err) {
            throw blockIdentifier.err;
        }

        const {baseId, blockId} = blockIdentifier.value;

        const {system: sys} = this;

        const destinationPath = sys.path.resolve(sys.process.cwd(), blockDirPath);
        const relativeDestinationPath = sys.path.relative(sys.process.cwd(), destinationPath);

        debug('initializing %s', destinationPath);

        if (await dirExistsAsync(sys, destinationPath)) {
            throw spawnUserError<InitCommandErrorInfo>({
                type: InitCommandErrorName.INIT_COMMAND_DIRECTORY_EXISTS,
                blockDirPath: relativeDestinationPath,
            });
        }

        const apiKeyResult = await readGlobalApiKeyAsync(sys);
        if (!apiKeyResult.value) {
            debug('no api key has been set, ask for one now');
            await this.config.runCommand('set-api-key');
        }

        const cacheDir = sys.path.join(destinationPath, INIT_TEMPLATE_CACHE_DIRECTORY);
        const cacheTemplateTarballPath = sys.path.join(cacheDir, INIT_TEMPLATE_TARBALL_FILENAME);
        const cacheTemplateExtractPath = sys.path.join(cacheDir, INIT_TEMPLATE_EXTRACT_DIRECTORY);

        cli.action.start('Downloading template');
        this._teardownAction = async () => {
            this._teardownAction = null;
            cli.action.stop('Error');

            this.warnMessage({type: InitCommandErrorName.INIT_COMMAND_UNKNOWN_ERROR});
            await rmdirAsync(this.system, destinationPath);
        };

        await mkdirpAsync(sys, cacheDir);

        const templateTarballUrl = await appTemplateUtils.getGithubTemplateTarballUrlAsync(
            flags.template,
        );
        debug('downloading template tarball from %s', templateTarballUrl);
        await appTemplateUtils.downloadTarballAsync(
            sys,
            templateTarballUrl,
            cacheTemplateTarballPath,
        );

        cli.action.stop();
        cli.action.start('Extracting template');

        const cacheTemplatePath = await appTemplateUtils.extractTarballAsync(
            sys,
            cacheTemplateTarballPath,
            cacheTemplateExtractPath,
        );

        if (!(await dirExistsAsync(sys, cacheTemplatePath))) {
            throw spawnUserError<InitCommandErrorInfo>({
                type: InitCommandErrorName.INIT_COMMAND_TEMPLATE_MISSING,
                template: flags.template,
            });
        }
        if (
            await sys.fs
                .readFileAsync(sys.path.join(cacheTemplatePath, BLOCK_FILE_NAME))
                .then(() => false)
                .catch(() => true)
        ) {
            throw spawnUserError<InitCommandErrorInfo>({
                type: InitCommandErrorName.INIT_COMMAND_TEMPLATE_NO_BLOCK_JSON,
                template: flags.template,
            });
        }

        await copyAsync(sys, cacheTemplatePath, destinationPath);
        await rmdirAsync(sys, cacheDir);

        cli.action.stop();
        cli.action.start('Installing dependencies');

        await npm.installAsync(sys, destinationPath);

        cli.action.stop();
        cli.action.start('Saving');

        await rewritePackageJsonAsync(sys, destinationPath);
        await writeRemoteConfigAsync(
            sys,
            sys.path.join(destinationPath, BLOCK_CONFIG_DIR_NAME, REMOTE_JSON_BASE_FILE_PATH),
            {blockId, baseId},
        );

        cli.action.stop();
        this._teardownAction = null;

        this.logMessage({
            type: InitCommandMessageName.INIT_COMMAND_READY,
            blockDirPath: relativeDestinationPath,
            platform: sys.os.platform(),
        });
    }

    async catchAsync(err: Error) {
        if (this._teardownAction) {
            await this._teardownAction();
        }
        return await super.catchAsync(err);
    }
}

async function dereferenceBlockSdkVersionAsync(
    sys: System,
    blockDirPath: string,
    rawVersion: string,
): Promise<string> {
    if (rawVersion === 'latest') {
        const sdkPackageJsonPath = sys.path.join(
            blockDirPath,
            'node_modules',
            '@airtable',
            'blocks',
            'package.json',
        );
        const sdkPackageJson = await readJsonIfExistsAsync(sys, sdkPackageJsonPath);
        if (typeof sdkPackageJson?.version !== 'string') {
            throw spawnUserError<InitCommandErrorInfo>({
                type: InitCommandErrorName.INIT_COMMAND_INSTALLED_SDK_NO_VERSION,
            });
        }
        return sdkPackageJson.version;
    }
    return rawVersion;
}

const initCommandPackageJsonFilter = [
    'dependencies',
    'devDependencies',
    'private',
    'scripts',
] as const;

function filterKeysInPackageJson<T>(
    packageJson: T,
): Pick<T, keyof T & typeof initCommandPackageJsonFilter[any]> {
    return Object.entries(packageJson)
        .filter(([key]) => initCommandPackageJsonFilter.includes(key as any))
        .reduce((carry, [key, value]) => {
            carry[key] = value;
            return carry;
        }, {} as any);
}

async function rewritePackageJsonAsync(sys: System, blockDirPath: string): Promise<void> {
    const {path} = sys;

    const packageJsonPath = path.join(blockDirPath, 'package.json');
    const packageJson = await readJsonIfExistsAsync(sys, packageJsonPath);
    if (packageJson instanceof Object) {
        if (packageJson.dependencies instanceof Object) {
            const rawVersion = packageJson.dependencies[SDK_PACKAGE_NAME];
            packageJson.dependencies[SDK_PACKAGE_NAME] = await dereferenceBlockSdkVersionAsync(
                sys,
                blockDirPath,
                rawVersion,
            );
        }
        const rewrittenPackageJson = filterKeysInPackageJson(packageJson);
        await writeFormattedJsonAsync(sys, packageJsonPath, rewrittenPackageJson);
    }
}
