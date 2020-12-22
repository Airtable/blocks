import {expect} from '@oclif/test';

import {test} from '../mocks/test';

describe('set-api-key', () => {
    test.stdout()
        .command(['set-api-key', 'keyAPI1234'])
        .wroteUserConfigFile({airtableApiKey: 'keyAPI1234'})
        .it('runs set-api-key keyAPI1234', ctx => {
            expect(ctx.stdout).to.contain('API Key saved');
        });

    test.stdout()
        .stderr()
        .answer('What is your Airtable', {stdin: 'keyAPI1234'})
        .command(['set-api-key'])
        .wroteUserConfigFile({airtableApiKey: 'keyAPI1234'})
        .it('runs set-api-key', ctx => {
            expect(ctx.stdout).to.contain('API Key saved');
        });
});
