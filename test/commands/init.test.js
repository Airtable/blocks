// @flow
const init = require('../../src/commands/init');
const Environments = require('../../src/types/environments');
const os = require('os');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const cliHelpers = require('../../src/helpers/cli_helpers');
const yarnHelpers = require('../../src/helpers/yarn_helpers');
const sinon = require('sinon');
const assert = require('assert');

describe('init command', function() {
    let yarnInstallAsyncStub;
    beforeEach(function() {
        sinon.stub(cliHelpers, 'promptAsync').resolves({
            apiKey: 'key123ABC'
        });

        yarnInstallAsyncStub = sinon.stub(yarnHelpers, 'yarnInstallAsync').resolves();
    });

    it('writes a directory of files', async function() {
        const blockDirPath = path.join(
            os.tmpdir(),
            `airtable-blocks-cli-init-test-${Math.random().toString().slice(2)}`
        );

        const fakeArgv = {
            _: [],
            $0: 'block',
            blockIdentifier: 'app123/blkABC',
            blockDirPath,
            environment: Environments.PRODUCTION,
        };

        // We stub console.log to tidy up test output, but need to restore it
        // because the test runner relies on it!
        sinon.stub(console, 'log');
        await init.runCommandAsync(fakeArgv);
        console.log.restore(); // eslint-disable-line no-console

        assert(fs.existsSync(path.join(blockDirPath, '.airtableAPIKey')));

        assert(fs.existsSync(path.join(blockDirPath, '.gitignore')));

        assert(fs.existsSync(path.join(blockDirPath, 'frontend', 'index.js')));

        assert(yarnInstallAsyncStub.calledOnce);

        const blockJson = await fsExtra.readJson(path.join(blockDirPath, 'block.json'));
        assert.strictEqual(blockJson.frontendEntry, './frontend/index.js');

        const remoteJson = await fsExtra.readJson(path.join(blockDirPath, '.block', 'remote.json'));
        assert.strictEqual(remoteJson.baseId, 'app123');
        assert.strictEqual(remoteJson.blockId, 'blkABC');

        const packageJson = await fsExtra.readJson(path.join(blockDirPath, 'package.json'));
        assert.strictEqual(packageJson.private, true);
    });
});
