import {expect} from '@oclif/test';
import {USER_CONFIG_FILE_NAME} from '../../src/settings';

import {test} from '../mocks/test';

describe('set-api-key', () => {
    test.stdout()
        .command(['set-api-key', 'keyAPI1234'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI1234'}})
        .it('runs set-api-key keyAPI1234', ctx => {
            expect(ctx.stdout).to.contain('API Key saved');
        });

    test.stdout()
        .stderr()
        .answer('What is your Airtable', {stdin: 'keyAPI1234'})
        .command(['set-api-key'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI1234'}})
        .it('runs set-api-key', ctx => {
            expect(ctx.stdout).to.contain('API Key saved');
        });

    test.stdout()
        .command(['set-api-key', 'keyAPI1234', '--location', 'user'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI1234'}})
        .it('writes api key to "user" location');

    test.stdout()
        .withFiles({'/home/projects/my-app/block.json': Buffer.from('{}')})
        .command(['set-api-key', 'keyAPI1234', '--location', 'app'])
        .wroteJsonFile('/home/projects/my-app/.airtableblocksrc.json', {
            airtableApiKey: {default: 'keyAPI1234'},
        })
        .it('writes api key to "app" location');

    test.stdout()
        .command(['set-api-key', 'keyAPI1234', '--location', 'system'])
        .catch(/Expected --location=system to be one of: user, app/)
        .it('there is no "system" location');

    test.stdout()
        .command(['set-api-key', 'keyAPI1234', '--api-key-name', 'organization'])
        .wroteUserConfigFile({airtableApiKey: {organization: 'keyAPI1234'}})
        .it('writes named api key in api key map');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: 'keyAPI9876',
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI1234'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI1234'}})
        .it('writes over api key string');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: 'keyAPI9876',
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI1234', '--api-key-name', 'organization'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI9876', organization: 'keyAPI1234'}})
        .it('turns api key string into map and adds named api key');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: {organization: 'keyAPI9876'},
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI1234'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI1234', organization: 'keyAPI9876'}})
        .it('adds default named api key to map');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: {default: 'keyAPI4567', organization: 'keyAPI9876'},
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI1234'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI1234', organization: 'keyAPI9876'}})
        .it('updates default named key in map');
});
