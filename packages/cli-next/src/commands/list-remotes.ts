import _debug from 'debug';

import {flags as commandFlags} from '@oclif/command';

import AirtableCommand from '../helpers/airtable_command';
import {findAppDirectoryAsync, readRemoteConfigAsync} from '../helpers/system_config';
import {BLOCK_CONFIG_DIR_NAME, REMOTE_JSON_BASE_FILE_PATH} from '../settings';
import {RemoteConfig} from '../helpers/config_remote';
import {spawnUserError} from '../helpers/error_utils';
import {RemoteCommandErrorName, RemoteCommandMessageName} from '../helpers/remote_messages';
import cli, {Table} from '../helpers/cli_ux';

const debug = _debug('block-cli:command:list-remotes');

export default class ListRemotes extends AirtableCommand {
    static description = '[Beta] List remote configurations';

    static examples = [
        `$ block list-remotes
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),
    };

    async runAsync() {
        const {system: sys} = this;

        this.parse(ListRemotes);

        this.logMessage({type: RemoteCommandMessageName.REMOTE_COMMAND_BETA_WARNING});

        const appRootPath = await findAppDirectoryAsync(sys, sys.process.cwd());
        debug('project root at %s', sys.path.relative(sys.process.cwd(), appRootPath));

        const blockConfigFiles = await sys.fs
            .readdirAsync(sys.path.join(appRootPath, BLOCK_CONFIG_DIR_NAME))
            .catch(() => []);

        const remoteFiles = blockConfigFiles.filter(file =>
            file.endsWith(REMOTE_JSON_BASE_FILE_PATH),
        );

        if (remoteFiles.length === 0) {
            throw spawnUserError({
                type: RemoteCommandErrorName.REMOTE_COMMAND_NO_CONFIGS,
            });
        }

        const remoteConfigs = await Promise.all(
            remoteFiles.map(async file => {
                const config = await readRemoteConfigAsync(
                    sys,
                    sys.path.join(appRootPath, BLOCK_CONFIG_DIR_NAME, file),
                );
                if (config.err) {
                    throw config.err;
                }
                const name =
                    file === REMOTE_JSON_BASE_FILE_PATH
                        ? ''
                        : file.slice(0, file.length - REMOTE_JSON_BASE_FILE_PATH.length - 1);
                return {
                    name,
                    ...config.value,
                };
            }),
        );

        const columns: Table.table.Columns<RemoteConfig & {name: string}> = {
            name: {},
            'Block identifier': {
                get: (remote: RemoteConfig) => `${remote.baseId}/${remote.blockId}`,
            },
        };
        if (remoteConfigs.some(remote => Boolean(remote.server))) {
            columns.server = {
                get: (remote: RemoteConfig) => remote.server ?? '',
            };
        }
        if (remoteConfigs.some(remote => Boolean(remote.apiKeyName))) {
            columns['Api key name'] = {
                get: (remote: RemoteConfig) => remote.apiKeyName ?? '',
            };
        }

        cli.table(remoteConfigs, columns);
    }
}
