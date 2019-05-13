// @flow
const APIClient = require('../src/api_client');
const Environments = require('../src/types/environments');
const {TEST_SERVER_PORT} = require('../src/config/block_cli_config_settings');
const express = require('express');
const http = require('http');
const assert = (require('assert'): any); // eslint-disable-line flowtype/no-weak-types

describe('APIClient', function() {
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

        apiClient = new APIClient({
            environment: Environments.TEST,
            applicationId: 'app123',
            blockInstallationId: 'bli123',
            blockId: 'blk123',
            apiKey: 'key123',
        });
    });

    after(function(done) {
        testServer.close(done);
    });

    describe('fetchBlockAsync', function() {
        beforeEach(function() {
            testApp.use((req: express$Request, res: express$Response, next: express$NextFunction) => {
                assert(req.get('Authorization'), 'Bearer key123');
                next();
            });
        });

        it('makes a GET request to Airtable and returns its body if successful', async function() {
            testApp.get('/v2/meta/app123/blocks/blk123', (req: express$Request, res: express$Response) => {
                res.json({
                    modules: [],
                    packageVersionByName: {},
                    frontendEntryModuleId: 'blm123',
                });
            });
            const result = await apiClient.fetchBlockAsync();
            assert.deepStrictEqual(result, {
                modules: [],
                packageVersionByName: {},
                frontendEntryModuleId: 'blm123',
            });
        });

        it('throws an error if Airtable returns a 404', async function() {
            testApp.get('/v2/meta/app123/blocks/blk123', (req: express$Request, res: express$Response) => {
                res.status(404).json({});
            });
            await assert.rejects(async () => {
                await apiClient.fetchBlockAsync();
            }, /Incorrect application or block id/);
        });

        it('throws the returned error message for other responses', async function() {
            const badStatusCodes = [201, 302, 400, 401, 500];
            // flow-disable-next-line because Flow doesn't support symbols
            const statusCodesIterator = badStatusCodes[Symbol.iterator]();

            testApp.get('/v2/meta/app123/blocks/blk123', (req: express$Request, res: express$Response) => {
                res.status(statusCodesIterator.next().value);
                res.json({
                    error: {message: 'foo bar'}
                });
            });

            for (let i = 0; i < badStatusCodes.length; i++) {
                await assert.rejects(async () => {
                    await apiClient.fetchBlockAsync();
                }, /foo bar/);
            }
        });
    });
});
