import {expect} from '@oclif/test';
import {USER_CONFIG_FILE_NAME} from '../../src/settings';
import {AirtableApiErrorName} from '../../src/helpers/airtable_api';

import {test} from '../mocks/test';

describe('set-api-key', () => {
    test.stdout()
        .command(['set-api-key', 'keyAPI12345678910'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI12345678910'}})
        .it('runs set-api-key keyAPI12345678910', ctx => {
            expect(ctx.stdout).to.contain('Personal access token saved');
        });

    test.stdout()
        .command([
            'set-api-key',
            'pat1234567890abcd.1234567890123456789012345678901234567890123456789012345678901234',
        ])
        .wroteUserConfigFile({
            airtableApiKey: {
                default:
                    'pat1234567890abcd.1234567890123456789012345678901234567890123456789012345678901234',
            },
        })
        .it('runs set-api-key pat1234567890abcd', ctx => {
            expect(ctx.stdout).to.contain('Personal access token saved');
        });

    test.stdout()
        .stderr()
        .answer('What is your Airtable', {stdin: 'keyAPI12345678910'})
        .command(['set-api-key'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI12345678910'}})
        .it('runs set-api-key', ctx => {
            expect(ctx.stdout).to.contain('Personal access token saved');
        });

    test.stdout()
        .command(['set-api-key', 'keyAPI12345678910', '--location', 'user'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI12345678910'}})
        .it('writes api key to "user" location');

    test.stdout()
        .withFiles({'/home/projects/my-app/block.json': Buffer.from('{}')})
        .command(['set-api-key', 'keyAPI12345678910', '--location', 'app'])
        .wroteJsonFile('/home/projects/my-app/.airtableblocksrc.json', {
            airtableApiKey: {default: 'keyAPI12345678910'},
        })
        .it('writes api key to "app" location');

    test.stdout()
        .command(['set-api-key', 'keyAPI12345678910', '--location', 'system'])
        .catch(/Expected --location=system to be one of: user, app/)
        .it('there is no "system" location');

    test.stdout()
        .command(['set-api-key', 'keyAPI12345678910', '--api-key-name', 'organization'])
        .wroteUserConfigFile({airtableApiKey: {organization: 'keyAPI12345678910'}})
        .it('writes named api key in api key map');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: 'keyAPI12345678918',
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI12345678910'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI12345678910'}})
        .it('writes over api key string');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: 'keyAPI12345678910',
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI12345678918', '--api-key-name', 'organization'])
        .wroteUserConfigFile({
            airtableApiKey: {default: 'keyAPI12345678910', organization: 'keyAPI12345678918'},
        })
        .it('turns api key string into map and adds named api key');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: {organization: 'keyAPI12345678918'},
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI12345678910'])
        .wroteUserConfigFile({
            airtableApiKey: {default: 'keyAPI12345678910', organization: 'keyAPI12345678918'},
        })
        .it('adds default named api key to map');

    test.stdout()
        .withFiles({
            [`/home/.config/${USER_CONFIG_FILE_NAME}`]: Buffer.from(
                JSON.stringify({
                    airtableApiKey: {
                        default: 'keyAPI12345678919',
                        organization: 'keyAPI12345678918',
                    },
                }),
            ),
        })
        .command(['set-api-key', 'keyAPI12345678910'])
        .wroteUserConfigFile({
            airtableApiKey: {default: 'keyAPI12345678910', organization: 'keyAPI12345678918'},
        })
        .it('updates default named key in map');

    test.stdout()
        .command(['set-api-key', 'keyAPI!1234567890'])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED))
        .it('rejects invalid key when specified via command-line argument');

    test.stdout()
        .command(['set-api-key', 'keyAPI_1234567890'])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED))
        .it('rejects invalid key when contains underscore');

    test.stdout()
        .command(['set-api-key', 'keyAPI-1234567890'])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED))
        .it('rejects invalid key when contains dash');

    test.stdout()
        .command(['set-api-key', 'keyAPI12345678910', '--api-key-name', ''])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_KEY_NAME_INVALID))
        .it('rejects invalid key name');

    test.stdout()
        .command(['set-api-key', 'pat1234567890abcd', '--api-key-name', ''])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_KEY_NAME_INVALID))
        .it('rejects invalid PAT format');
});
