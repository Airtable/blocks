import cli from 'cli-ux';
import {flags as commandFlags} from '@oclif/command';
import * as Parser from '@oclif/parser';

import AirtableCommand from '../helpers/airtable_command';

import {
    ConfigLocation,
    findApiKeyConfigPathAsync,
    isValidApiKey,
    writeApiKeyAsync,
} from '../helpers/system_api_key';

export default class SetApiKey extends AirtableCommand {
    static description = 'set an api key for an airtable account to upload to';

    static examples = [
        `$ block set-api-key
$ block set-api-key APIKEY
$ block set-api-key --location app APIKEY
`,
    ];

    static flags = {
        help: commandFlags.help({char: 'h'}),

        location: commandFlags.enum<ConfigLocation>({
            options: Object.values(ConfigLocation),
            default: ConfigLocation.USER,
        }),

        'api-key-name': commandFlags.string({
            description: 'The name of the API key to set',
            hidden: true,
        }),
    };

    static args: Parser.args.Input = [{name: 'apiKey', required: false}];

    async runAsync() {
        const {args, flags} = this.parse(SetApiKey);
        const apiKeyName = flags['api-key-name'];

        let {apiKey} = args;

        while (!isValidApiKey(apiKey)) {
            apiKey = await cli.prompt('What is your Airtable API Key?', {
                type: 'mask',
                required: true,
            });
        }

        const locationPath = await findApiKeyConfigPathAsync(this.system, flags.location);
        this.log(`Saving API Key to: ${locationPath}`);

        await writeApiKeyAsync(this.system, flags.location, apiKey, apiKeyName);

        this.log(`API Key${apiKeyName ? ` '${apiKeyName}'` : ''} saved.`);
    }
}
