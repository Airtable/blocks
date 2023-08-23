import _debug from 'debug';

import {flags as commandFlags} from '@oclif/command';
import * as Parser from '@oclif/parser';

import AirtableCommand from '../helpers/airtable_command';
import {spawnUserError} from '../helpers/error_utils';
import {RemoteCommandErrorName, RemoteCommandMessageName} from '../helpers/remote_messages';
import {unwrapResultFunctor} from '../helpers/result';
import {findAppDirectoryAsync, validateRemoteName} from '../helpers/system_config';
import {BLOCK_CONFIG_DIR_NAME, REMOTE_JSON_BASE_FILE_PATH} from '../settings';
import {unlinkIfExistsAsync} from '../helpers/system_extra';

const debug = _debug('block-cli:command:remove-remote');

export default class RemoveRemote extends AirtableCommand {
    static description = '[Beta] Remove a remote configuration';

    static examples = [
        `$ block remove-remote old-remote
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),
    };

    static args: Parser.args.Input = [
        {
            name: 'remoteName',
            required: true,
            parse: unwrapResultFunctor(validateRemoteName),
        },
    ];

    async runAsync() {
        const {system: sys} = this;

        const {
            args: {remoteName},
        } = this.parse(RemoveRemote);

        this.logMessage({type: RemoteCommandMessageName.REMOTE_COMMAND_BETA_WARNING});

        const appRootPath = await findAppDirectoryAsync(sys, sys.process.cwd());
        debug('project root at %s', sys.path.relative(sys.process.cwd(), appRootPath));

        const remoteFile = `${remoteName}.${REMOTE_JSON_BASE_FILE_PATH}`;
        const remotePath = sys.path.join(appRootPath, BLOCK_CONFIG_DIR_NAME, remoteFile);

        if (
            await sys.fs
                .readFileAsync(remotePath)
                .then(() => false)
                .catch(() => true)
        ) {
            throw spawnUserError({
                type: RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_MISSING,
                remoteName,
            });
        }

        await unlinkIfExistsAsync(sys, remotePath);

        this.logMessage({
            type: RemoteCommandMessageName.REMOTE_COMMAND_REMOVED_EXISTING,
            remoteFile: sys.path.relative(sys.process.cwd(), remotePath),
        });
    }
}
