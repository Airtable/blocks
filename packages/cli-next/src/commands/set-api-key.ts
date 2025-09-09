import {flags as commandFlags} from '@oclif/command';
import * as Parser from '@oclif/parser';
import cli from '../helpers/cli_ux';

import AirtableCommand from '../helpers/airtable_command';
import {AirtableApiErrorName} from '../helpers/airtable_api';
import {spawnUserError} from '../helpers/error_utils';

import {
    ConfigLocation,
    findApiKeyConfigPathAsync,
    isValidApiKey,
    isValidApiKeyName,
    writeApiKeyAsync,
} from '../helpers/system_api_key';
import {AIRTABLE_CREATE_TOKENS_URL} from '../settings';

export default class SetApiKey extends AirtableCommand {
    static description =
        'Set a personal access token (with block:manage scope) for an Airtable account to upload to';

    static examples = [
        `$ block set-api-key
$ block set-api-key TOKEN
$ block set-api-key --location app TOKEN
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),

        location: commandFlags.enum<ConfigLocation>({
            options: Object.values(ConfigLocation),
            default: ConfigLocation.USER,
        }),

        'api-key-name': commandFlags.string({
            description: 'The name of the personal access token to set',
            hidden: true,
        }),
    };

    static args: Parser.args.Input = [{name: 'apiKey', required: false}];

    async runAsync() {
        const {args, flags} = this.parse(SetApiKey);
        const apiKeyName = flags['api-key-name'];

        if (typeof apiKeyName === 'string' && !isValidApiKeyName(apiKeyName)) {
            throw spawnUserError({
                type: AirtableApiErrorName.AIRTABLE_API_KEY_NAME_INVALID,
                name: apiKeyName,
            });
        }

        let {apiKey} = args;

        if (apiKey && !isValidApiKey(apiKey)) {
            throw spawnUserError({type: AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED});
        }

        while (!isValidApiKey(apiKey)) {
            if (apiKey) {
                this.logMessage({type: AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED});
            }
            apiKey = await cli.prompt(
                `What is your Airtable personal access token (with block:manage scope)? You can generate one at ${AIRTABLE_CREATE_TOKENS_URL}.`,
                {
                    type: 'mask',
                    required: true,
                },
            );
        }

        const locationPath = await findApiKeyConfigPathAsync(this.system, flags.location);
        this.log(`Saving personal access token to: ${locationPath}`);

        await writeApiKeyAsync(this.system, flags.location, apiKey, apiKeyName);

        this.log(`Personal access token${apiKeyName ? ` '${apiKeyName}'` : ''} saved.`);
    }
}
