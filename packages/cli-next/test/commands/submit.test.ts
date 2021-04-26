import {expect, test} from '../mocks/test';

import * as submitModule from '../../src/manager/submit';
import * as uploadSubmitModule from '../../src/helpers/upload_block1_submit';
import * as userAgentModule from '../../src/helpers/user_agent';

import {AppConfigErrorName} from '../../src/helpers/config_app';
import {RemoteConfigErrorName} from '../../src/helpers/config_remote';
import {SubmitCommandMessageName} from '../../src/helpers/submit_messages';
import {SubmitTaskConsumerAdapter} from '../../src/manager/submit_adapter';
import {System} from '../../src/helpers/system';
import {SystemApiKeyErrorName} from '../../src/helpers/system_api_key';

import {mapFancyTestAsyncPlugin} from '../mocks/FancyTestAsync';

type SubmitTaskProducer = submitModule.SubmitTaskProducer;

const {stubCreateSubmitTaskAsync, uploadSubmitStubAsync} = createStubs();

describe('submit', () => {
    const testSubmitCommand = test
        .register('wroteFileMatchingSnapshot', wroteFileMatchingSnapshot)
        .timeout(10000)
        .stdout()
        .stderr()
        .enableDebug('block-cli*:submit')
        .withJSON({
            '/home/.config/.airtableblocksrc.json': {airtableApiKey: {default: 'key1234'}},
            '/home/projects/my-app/.block/remote.json': {baseId: 'app1234', blockId: 'blk5678'},
            '/home/projects/my-app/.block/newremote.json': {baseId: 'app5678', blockId: 'blk1234'},
            '/home/projects/my-app/block.json': {frontendEntry: 'frontend/index.js'},
            '/home/projects/my-app/package.json': {},
            '/home/projects/shared/package.json': {},
        })
        .withFiles({
            '/home/projects/my-app/frontend/index.js': Buffer.from(''),
            '/home/projects/shared/lib/index.js': Buffer.from(''),
        })
        .stubDirectoryRemoval()
        .stub(
            submitModule,
            'createSubmitTaskAsync',
            stubCreateSubmitTaskAsync(['/home/projects/my-app/frontend/index.js']),
        )
        .stub(uploadSubmitModule, 'uploadBlock1SubmitAsync', uploadSubmitStubAsync)
        .stub(userAgentModule, 'createUserAgentAsync', () => 'airtable-cli-user-agent/1.0.0');

    const testSubmitCommandAndContinue = testSubmitCommand.answer(
        SubmitCommandMessageName.SUBMIT_COMMAND_PACKAGED_CONTINUE_PROMPT,
        {stdin: 'y'},
    );

    testSubmitCommandAndContinue
        .command(['submit'])
        .wroteFileMatchingSnapshot('/home/projects/my-app/.tmp/dist/block_archive.files.txt')
        .it('completes', ({stderr}) => {
            expect(stderr).to.contain('Submitting');
        });

    testSubmitCommand
        .answer(SubmitCommandMessageName.SUBMIT_COMMAND_PACKAGED_CONTINUE_PROMPT, {stdin: ''})
        .command(['submit'])
        .it('stops on request', ({stdout}) => {
            expect(stdout).to.contain(SubmitCommandMessageName.SUBMIT_COMMAND_STOP_AFTER_PACKAGING);
        });

    testSubmitCommandAndContinue
        .stub(
            submitModule,
            'createSubmitTaskAsync',
            stubCreateSubmitTaskAsync([
                '/home/projects/my-app/frontend/index.js',
                '/home/projects/shared/lib/index.js',
            ]),
        )
        .command(['submit'])
        .wroteFileMatchingSnapshot('/home/projects/my-app/.tmp/dist/block_archive.files.txt')
        .it('completes with sibling shared source');

    testSubmitCommandAndContinue
        .withJSON({
            '/home/.config/.airtableblocksrc.json': {
                airtableApiKey: {default: 'key1234', another: 'key5678'},
            },
            '/home/projects/my-app/.block/newremote.remote.json': {
                baseId: 'app5678',
                blockId: 'blk1234',
                server: 't.t.com',
                apiKeyName: 'another',
            },
        })
        .stub(uploadSubmitModule, 'uploadSubmitAsync', async function(
            options: uploadSubmitModule.UploadSubmitOptions,
            data: uploadSubmitModule.UploadSubmitDataOptions,
        ) {
            expect(options.blockUrlOptions.baseId).to.equal('app5678');
            expect(options.blockUrlOptions.apiBaseUrl).to.equal('t.t.com');
            expect(options.blockUrlOptions.apiKey).to.equal('key5678');
            return 'message';
        } as any)
        .command(['submit', '--remote', 'newremote'])
        .it('submits to newremote remote');

    testSubmitCommand
        .withJSON({
            '/home/projects/my-app/block.json': {},
        })
        .command('submit')
        .catch(new RegExp(AppConfigErrorName.APP_CONFIG_IS_NOT_VALID))
        .it('validates block.json');

    testSubmitCommand
        .withJSON({
            '/home/projects/my-app/.block/remote.json': {},
        })
        .command('submit')
        .catch(new RegExp(RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID))
        .it('validates remote.json');

    testSubmitCommand
        .withJSON({
            '/home/.config/.airtableblocksrc.json': {},
        })
        .command('submit')
        .catch(new RegExp(SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND))
        .it('ensures apiKey is in user config');
});

function createStubs() {
    function _stubCreateSubmitTaskAsync(files: string[] = []): any {
        return function(sys: System, context: any, producer: SubmitTaskProducer) {
            (async () => {
                await Promise.resolve();
                await producer.readyAsync();
            })();

            return {
                async findDependenciesAsync() {
                    return {files};
                },
                async teardownAsync() {},
            } as SubmitTaskConsumerAdapter;
        };
    }

    async function _uploadSubmitStubAsync() {
        return 'message';
    }

    return {
        stubCreateSubmitTaskAsync: _stubCreateSubmitTaskAsync,
        uploadSubmitStubAsync: _uploadSubmitStubAsync,
    };
}

function wroteFileMatchingSnapshot(filepath: string) {
    return mapFancyTestAsyncPlugin({
        async runAsync({system: sys}: {system: System}) {
            const buffer = await sys.fs.readFileAsync(filepath);
            const file = buffer.toString();
            expect(file).to.matchSnapshot();
        },
    });
}
