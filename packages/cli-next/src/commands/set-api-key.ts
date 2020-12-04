import cli from 'cli-ux';
import {flags as commandFlags} from '@oclif/command';

import AirtableCommand from '../helpers/airtable_command';

import {
    castLocation,
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

        location: commandFlags.string({options: ['user', 'app'], default: 'user'}),
    };

    static args = [{name: 'apiKey'}];

    async runAsync() {
        const {args, flags} = this.parse(SetApiKey);

        const location = castLocation(flags.location);
        if (location.err) {
            this.error(location.err.message, {exit: 1});
        }

        let {apiKey} = args;

        while (!isValidApiKey(apiKey)) {
            apiKey = await cli.prompt('What is your Airtable API Key?', {
                type: 'mask',
                required: true,
            });
        }

        const locationPath = await findApiKeyConfigPathAsync(this.system, location.value);
        this.log(`Saving API Key to: ${locationPath}`);

        await writeApiKeyAsync(this.system, location.value, apiKey);

        this.log(`API Key saved.`);
    }
}
