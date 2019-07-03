// @flow
const config = require('../src/config/block_cli_config_settings');
const UserAgentBag = require('user-agent-bag');
const packageJson = require('../package.json');
const os = require('os');
const assert = require('assert');

describe('config settings', function() {
    it('USER_AGENT contains a reasonable value', function() {
        const {USER_AGENT} = config;
        assert(typeof USER_AGENT === 'string');

        const bag = new UserAgentBag(USER_AGENT);
        assert.strictEqual(bag.get('airtable-blocks-cli'), packageJson.version);
        assert.strictEqual(bag.get('Node'), process.version.substring(1));
        assert.strictEqual(bag.get('OS'), os.platform());
    });
});