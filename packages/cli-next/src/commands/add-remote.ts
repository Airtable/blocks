import _debug from 'debug';

import {flags as commandFlags} from '@oclif/command';
import * as Parser from '@oclif/parser';

import AirtableCommand from '../helpers/airtable_command';
import {parseBlockIdentifier} from '../helpers/block_identifier';
import {RemoteConfig} from '../helpers/config_remote';
import {spawnUserError} from '../helpers/error_utils';
import {RemoteCommandErrorName, RemoteCommandMessageName} from '../helpers/remote_messages';
import {unwrapResultFunctor} from '../helpers/result';
import {
    findAppDirectoryAsync,
    validateRemoteName,
    writeRemoteConfigAsync,
} from '../helpers/system_config';
import {BLOCK_CONFIG_DIR_NAME, REMOTE_JSON_BASE_FILE_PATH} from '../settings';
import {omitUndefinedValues} from '../helpers/private_utils';

const debug = _debug('block-cli:command:add-remote');

export default class AddRemote extends AirtableCommand {
    static description = '[Beta] Add a new remote configuration';

    static examples = [
        `$ block add-remote app12345678/blk12345678 new-remote
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),
        server: commandFlags.string({
            description: 'API server endpoint for the remote',
            hidden: true,
        }),
        'api-key-name': commandFlags.string({
            description: 'The name of the API key this remote should use',
            hidden: true,
        }),
    };

    static args: Parser.args.Input = [
        {
            name: 'blockIdentifier',
            required: true,
            parse: unwrapResultFunctor(parseBlockIdentifier),
        },
        {
            name: 'remoteName',
            required: true,
            parse: unwrapResultFunctor(validateRemoteName),
        },
    ];

    async runAsync() {
        const {system: sys} = this;

        const {
            args: {
                blockIdentifier: {baseId, blockId},
                remoteName,
            },
            flags: {server, 'api-key-name': apiKeyName},
        } = this.parse(AddRemote);

        this.logMessage({type: RemoteCommandMessageName.REMOTE_COMMAND_BETA_WARNING});

        const appRootPath = await findAppDirectoryAsync(sys, sys.process.cwd());
        debug('project root at %s', sys.path.relative(sys.process.cwd(), appRootPath));

        const remoteJson: RemoteConfig = omitUndefinedValues({
            baseId,
            blockId,
            server,
            apiKeyName,
        });

        const remoteFile = `${remoteName}.${REMOTE_JSON_BASE_FILE_PATH}`;
        const remotePath = sys.path.join(appRootPath, BLOCK_CONFIG_DIR_NAME, remoteFile);

        if (
            await sys.fs
                .readFileAsync(remotePath)
                .then(() => true)
                .catch(() => false)
        ) {
            throw spawnUserError({
                type: RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_EXISTS,
                remoteName,
            });
        }

        await writeRemoteConfigAsync(sys, remotePath, remoteJson);

        this.logMessage({
            type: RemoteCommandMessageName.REMOTE_COMMAND_ADDED_NEW,
            remoteFile: sys.path.relative(sys.process.cwd(), remotePath),
        });
    }
}
