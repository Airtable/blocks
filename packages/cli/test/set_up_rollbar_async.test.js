// @flow
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const path = require('path');
const fsExtra = require('fs-extra');

let rollbarConstructorSpy;
class FakeRollbar {
    constructor() {
        rollbarConstructorSpy(...arguments);
    }
}

const setUpRollbarAsyncPath = path.join(
    __dirname,
    '..',
    'src',
    'helpers',
    'set_up_rollbar_async.js',
);
const setUpRollbarAsync = proxyquire(setUpRollbarAsyncPath, {
    rollbar: FakeRollbar,
});

describe('setUpRollbarAsync', function() {
    beforeEach(function() {
        rollbarConstructorSpy = sinon.fake();
    });

    it("doesn't set up Rollbar if it's in a Git repository", async function() {
        // No mocking is needed for this because we should be running this test from a Git repo.
        await setUpRollbarAsync();
        sinon.assert.notCalled(rollbarConstructorSpy);
    });

    it('sets up Rollbar if not in a Git repository', async function() {
        sinon.stub(fsExtra, 'pathExists').resolves(false);

        await setUpRollbarAsync();

        sinon.assert.calledOnce(rollbarConstructorSpy);
        sinon.assert.calledWith(
            rollbarConstructorSpy,
            sinon.match({
                accessToken: sinon.match.string,
                captureUncaught: true,
                captureUnhandledRejections: true,
                captureIp: false,
            }),
        );

        sinon.assert.calledOnce(fsExtra.pathExists);
        sinon.assert.calledWithExactly(fsExtra.pathExists, path.join(__dirname, '..', '.git'));
    });
});
