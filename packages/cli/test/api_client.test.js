// @flow
const ApiClient = require('../src/api_client');
const {TEST_SERVER_PORT} = require('../src/config/block_cli_config_settings');
const {TEST_API_URL} = require('./helpers');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const UserAgentBag = require('user-agent-bag');
const packageJson = require('../package.json');
const assert = (require('assert'): any); // eslint-disable-line flowtype/no-weak-types

describe('ApiClient', function() {
    let testApp: express$Application;
    let testServer;
    let apiClient;

    before(function(done) {
        testServer = http.createServer((...args) => {
            testApp(...args);
        });
        testServer.listen(TEST_SERVER_PORT, done);
    });

    beforeEach(function() {
        testApp = express();

        testApp.use((req: express$Request, res: express$Response, next: express$NextFunction) => {
            assert.strictEqual(req.get('Authorization'), 'Bearer key123');

            const userAgentBag = new UserAgentBag(req.get('User-Agent'));
            assert.strictEqual(userAgentBag.get('airtable-blocks-cli'), packageJson.version);
            assert(userAgentBag.has('Node'));
            assert(userAgentBag.has('OS'));

            next();
        });

        testApp.use(bodyParser.json());

        apiClient = new ApiClient({
            apiBaseUrl: TEST_API_URL,
            applicationId: 'app123',
            blockInstallationId: 'bli123',
            blockId: 'blk123',
            apiKey: 'key123',
        });
    });

    after(function(done) {
        testServer.close(done);
    });

    describe('fetchAccessPolicyAsync', function() {
        it('makes a GET request to Airtable and returns its body if successful', async function() {
            testApp.get(
                '/v2/meta/app123/blockInstallations/bli123/accessPolicy',
                (req: express$Request, res: express$Response) => {
                    res.json({accessPolicy: 'fakeAccessPolicy'});
                },
            );
            const result = await apiClient.fetchAccessPolicyAsync();
            assert.strictEqual(result, 'fakeAccessPolicy');
        });

        it('throws an error if Airtable returns a 404', async function() {
            testApp.get(
                '/v2/meta/app123/blockInstallations/bli123/accessPolicy',
                (req: express$Request, res: express$Response) => {
                    res.status(404).json({});
                },
            );
            await assert.rejects(async () => {
                await apiClient.fetchAccessPolicyAsync();
            }, /Incorrect application or block installation id/);
        });

        it('throws the returned error message for other responses', async function() {
            const badStatusCodes = [201, 302, 400, 401, 500];
            // flow-disable-next-line because Flow doesn't support symbols
            const statusCodesIterator = badStatusCodes[Symbol.iterator]();

            testApp.get(
                '/v2/meta/app123/blockInstallations/bli123/accessPolicy',
                (req: express$Request, res: express$Response) => {
                    res.status(statusCodesIterator.next().value);
                    res.json({
                        error: {message: 'foo bar'},
                    });
                },
            );

            for (let i = 0; i < badStatusCodes.length; i++) {
                await assert.rejects(async () => {
                    await apiClient.fetchAccessPolicyAsync();
                }, /foo bar/);
            }
        });
    });
});
