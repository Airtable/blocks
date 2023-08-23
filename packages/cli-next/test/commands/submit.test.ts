import {expect, test} from '../mocks/test';

import * as submitModule from '../../src/manager/submit';
import * as airtableLegacyBlockApiModule from '../../src/helpers/airtable_legacy_block_api';
import * as airtableBlockV2ApiModule from '../../src/helpers/airtable_block_v2_api';
import * as taskModule from '../../src/helpers/task';
import * as userAgentModule from '../../src/helpers/user_agent';

import {AppConfigErrorName} from '../../src/helpers/config_app';
import {RemoteConfigErrorName} from '../../src/helpers/config_remote';
import {SubmitCommandMessageName} from '../../src/helpers/submit_messages';
import {SubmitTaskConsumerAdapter} from '../../src/manager/submit_adapter';
import {System} from '../../src/helpers/system';
import {SystemApiKeyErrorName} from '../../src/helpers/system_api_key';

import {mapFancyTestAsyncPlugin} from '../mocks/FancyTestAsync';
import {spawnUnexpectedError} from '../../src/helpers/error_utils';
import {UploadSubmissionOptions} from '../../src/helpers/airtable_api';

type SubmitTaskProducer = submitModule.SubmitTaskProducer;

const {
    stubResolveBuiltinModuleAsync,
    stubCreateSubmitTaskAsync,
    airtableLegacyBlockApiStub,
    airtableBlockV2ApiStub,
} = createStubs();

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
            '/node/env-12.20.1/lib/node_modules/@airtable/blocks-cli/lib/bundler.js': Buffer.from(
                '',
            ),
            '/home/projects/my-app/frontend/index.js': Buffer.from(''),
            '/home/projects/shared/lib/index.js': Buffer.from(''),
        })
        .stubDirectoryRemoval()
        .stub(taskModule, 'resolveBuiltinModuleAsync', stubResolveBuiltinModuleAsync())
        .stub(
            submitModule,
            'createSubmitTaskAsync',
            stubCreateSubmitTaskAsync(['/home/projects/my-app/frontend/index.js']),
        )
        .stub(airtableLegacyBlockApiModule, 'AirtableLegacyBlockApi', airtableLegacyBlockApiStub())
        .stub(
            airtableBlockV2ApiModule,
            'AirtableBlockV2Api',
            airtableBlockV2ApiStub({
                constructorOptions() {
                    throw spawnUnexpectedError('Must use AirtableLegacyBlockApi');
                },
            }),
        )
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
        .withFiles({
            '/home/projects/my-app/my-bundler.js': Buffer.from(''),
        })
        .withJSON({
            '/home/projects/my-app/block.json': {
                frontendEntry: 'frontend/index.js',
                bundler: {module: './my-bundler.js'},
            },
        })
        .command(['submit'])
        .wroteFileMatchingSnapshot('/home/projects/my-app/.tmp/dist/block_archive.files.txt')
        .it('completes with custom bundler');

    testSubmitCommandAndContinue
        .withFiles({
            '/home/projects/shared/my-bundler.js': Buffer.from(''),
        })
        .withJSON({
            '/home/projects/my-app/block.json': {
                frontendEntry: 'frontend/index.js',
                bundler: {module: '../shared/my-bundler.js'},
            },
        })
        .command(['submit'])
        .wroteFileMatchingSnapshot('/home/projects/my-app/.tmp/dist/block_archive.files.txt')
        .it('completes with custom bundler in shared dir');

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
        .stub(
            airtableLegacyBlockApiStub,
            'AirtableLegacyBlockApi',
            airtableLegacyBlockApiStub({
                constructorOptions(
                    options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions,
                ) {
                    expect(options.baseId).to.equal('app5678');
                    expect(options.apiBaseUrl).to.equal('t.t.com');
                    expect(options.apiKey).to.equal('key5678');
                },
            }),
        )
        .stub(
            airtableBlockV2ApiModule,
            'AirtableBlockV2Api',
            airtableBlockV2ApiStub({
                constructorOptions() {
                    throw spawnUnexpectedError('Must use AirtableLegacyBlockApi');
                },
            }),
        )
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
    function _stubResolveBuiltinModuleAsync(): any {
        return async function(
            sys: System,
            workingDir: string,
            ...modulePath: string[]
        ): Promise<string> {
            return '/node/env-12.20.1/lib/node_modules/@airtable/blocks-cli/lib/bundler.js';
        };
    }

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

    type AirtableLegacyBlockApiStubMethods = {
        constructorOptions(
            options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions,
        ): void;
    } & Pick<airtableLegacyBlockApiModule.AirtableLegacyBlockApi, 'uploadSubmissionAsync'>;

    function _airtableLegacyBlockApiStub(
        methods: Partial<AirtableLegacyBlockApiStubMethods> = {},
    ): any {
        return class AirtableLegacyBlockApiStub {
            private options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions;

            constructor(options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions) {
                if (methods.constructorOptions) {
                    methods.constructorOptions(options);
                }
                this.options = options;
            }

            async uploadSubmissionAsync(options: UploadSubmissionOptions) {
                if (methods.uploadSubmissionAsync) {
                    return await methods.uploadSubmissionAsync(options);
                }
                return 'message';
            }
        };
    }

    type AirtableBlockV2ApiStubMethods = {
        constructorOptions(options: airtableBlockV2ApiModule.AirtableBlockV2ApiBaseOptions): void;
    } & Pick<airtableBlockV2ApiModule.AirtableBlockV2Api, 'uploadSubmissionAsync'>;

    function _airtableBlockV2ApiStub(methods: Partial<AirtableBlockV2ApiStubMethods> = {}): any {
        return class AirtableBlockV2ApiStub {
            constructor(options: airtableBlockV2ApiModule.AirtableBlockV2ApiBaseOptions) {
                if (methods.constructorOptions) {
                    methods.constructorOptions(options);
                }
            }

            async uploadSubmissionAsync(options: UploadSubmissionOptions) {
                if (methods.uploadSubmissionAsync) {
                    return await methods.uploadSubmissionAsync(options);
                }
                return 'message';
            }
        };
    }

    return {
        stubResolveBuiltinModuleAsync: _stubResolveBuiltinModuleAsync,
        stubCreateSubmitTaskAsync: _stubCreateSubmitTaskAsync,
        airtableLegacyBlockApiStub: _airtableLegacyBlockApiStub,
        airtableBlockV2ApiStub: _airtableBlockV2ApiStub,
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
