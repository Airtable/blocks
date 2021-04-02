import {expect} from '@oclif/test';

import * as releaseModule from '../../src/manager/release';
import * as userAgentModule from '../../src/helpers/user_agent';
import * as uploadBlock1ReleaseModule from '../../src/helpers/upload_block1_release';
import * as uploadBlock2ReleaseModule from '../../src/helpers/upload_block2_release';
import {ReleaseTaskConsumer} from '../../src/tasks/release';
import {System} from '../../src/helpers/system';

import {test} from '../mocks/test';
import {AIRTABLE_API_URL, BUNDLE_FILE_NAME, V2_BLOCKS_BASE_ID} from '../../src/settings';
import {invariant, spawnUnexpectedError, spawnUserError} from '../../src/helpers/error_utils';
import {AirtableApiErrorName, AirtableApiErrorInfo} from '../../src/helpers/airtable_api';
import {AirtableBlock1ApiBaseOptions} from '../../src/helpers/airtable_block1_api';
import {AppConfigErrorName} from '../../src/helpers/config_app';
import {RemoteConfigErrorName} from '../../src/helpers/config_remote';
import {SystemApiKeyErrorName} from '../../src/helpers/system_api_key';
import {AppBundlerContext} from '../../src/manager/bundler';
import {BuildErrorName} from '../../src/helpers/build_messages';
import {
    ReleaseCommandErrorName,
    ReleaseCommandMessageName,
} from '../../src/helpers/release_messages';

const {
    stubCreateReleaseTaskAsync,
    uploadBlock1ReleaseStub,
    uploadBlock2ReleaseStub,
} = createStubs();

describe('release', () => {
    const testReleaseCommand = test
        .timeout(10000)
        .stdout()
        .stderr()
        .enableDebug('block-cli*:release')
        .stub(releaseModule, 'createReleaseTaskAsync', stubCreateReleaseTaskAsync)
        .stub(uploadBlock1ReleaseModule, 'UploadBlock1Release', uploadBlock1ReleaseStub())
        .stub(
            uploadBlock2ReleaseModule,
            'UploadBlock2Release',
            uploadBlock2ReleaseStub({
                constructorOptions() {
                    throw spawnUnexpectedError('Must use UploadBlock1Release');
                },
            }),
        )
        .stub(userAgentModule, 'createUserAgentAsync', () => 'airtable-cli-user-agent/1.0.0')
        .withJSON({
            '/home/.config/.airtableblocksrc.json': {airtableApiKey: 'key1234'},
            '/home/projects/my-app/.block/remote.json': {baseId: 'abcd', blockId: '1234'},
            '/home/projects/my-app/package.json': {version: '1.0.0'},
            '/home/projects/my-app/block.json': {frontendEntry: 'index.js'},
        })
        .withFiles({
            '/home/projects/my-app/node_modules/fake-dependency/index.js': Buffer.from(
                '// fake dependency',
            ),
            '/home/projects/my-app/index.js': Buffer.from('// hello world'),
        });

    const testReleaseCommandBlock2 = testReleaseCommand
        .stub(
            uploadBlock1ReleaseModule,
            'UploadBlock1Release',
            uploadBlock1ReleaseStub({
                constructorOptions() {
                    throw spawnUnexpectedError('Must use UploadBlock2Release');
                },
            }),
        )
        .stub(uploadBlock2ReleaseModule, 'UploadBlock2Release', uploadBlock2ReleaseStub())
        .withJSON({
            '/home/projects/my-app/.block/remote.json': {
                baseId: V2_BLOCKS_BASE_ID,
                blockId: 'blk5678',
            },
        });

    testReleaseCommand.command(['release']).it('releases', ctx => {
        expect(ctx.stderr).to.contain('Releasing');
    });

    testReleaseCommand
        .stub(releaseModule, 'createReleaseTaskAsync', async (...args: any) => {
            await stubCreateReleaseTaskAsync(...args);
            return {
                bundleAsync: () => Promise.reject(new Error('Bundle failure')),
                async teardownAsync() {},
            };
        })
        .command(['release'])
        .catch('Bundle failure')
        .it('reports bundling failures');

    testReleaseCommand
        .stubDirectoryRemoval()
        .command(['release'])
        .filePresence('/home/projects/my-app/.tmp/index.js', true)
        .wroteFile('/home/projects/my-app/.tmp/index.js', content => content.length > 0)
        .it('creates an entry point');

    testReleaseCommand
        .command(['release'])
        .filePresence('/home/projects/my-app/.tmp/index.js', false)
        .it('removes the entry point following completion');

    testReleaseCommand
        .withJSON({
            '/home/projects/my-app/.block/remote.json': {
                baseId: 'abcd',
                blockId: '1234',
                server: 'http://example.com',
            },
        })
        .stub(
            uploadBlock1ReleaseModule,
            'UploadBlock1Release',
            uploadBlock1ReleaseStub({
                constructorOptions({blockUrlOptions: {apiBaseUrl}}) {
                    expect(apiBaseUrl).to.not.equal(AIRTABLE_API_URL);
                },
            }) as any,
        )
        .command(['release'])
        .it('releases to alternative stated airtable server');

    testReleaseCommand
        .withJSON({
            '/home/projects/my-app/.block/newremote.remote.json': {
                baseId: 'app123',
                blockId: 'blk5678',
            },
        })
        .command(['release', '--remote', 'newremote'])
        .it('releases with newremote remote', ctx => {
            expect(ctx.stderr).to.contain('/newremote.remote.json');
        });

    testReleaseCommandBlock2
        .command(['release', '--comment', 'fixed the bug'])
        .it('releases v2 block with comment flag');

    testReleaseCommandBlock2
        .answer(new RegExp(ReleaseCommandMessageName.RELEASE_COMMAND_DEVELOPER_COMMENT_PROMPT), {
            stdin: 'fixed the bug',
        })
        .command(['release'])
        .it('releases v2 block after prompting for comment');

    testReleaseCommand
        .withJSON({
            '/home/projects/my-app/block.json': {},
        })
        .command(['release'])
        .catch(new RegExp(AppConfigErrorName.APP_CONFIG_IS_NOT_VALID))
        .it('validates block.json');

    testReleaseCommand
        .withJSON({
            '/home/projects/my-app/.block/remote.json': {},
        })
        .command(['release'])
        .catch(new RegExp(RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID))
        .it('validates remote.json');

    testReleaseCommand
        .withJSON({
            '/home/.config/.airtableblocksrc.json': {},
        })
        .command(['release'])
        .catch(new RegExp(SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND))
        .it('ensures there is an airtableApiKey');

    testReleaseCommand
        .stub(
            uploadBlock1ReleaseModule,
            'UploadBlock1Release',
            uploadBlock1ReleaseStub({
                async buildUploadAsync(): Promise<
                    uploadBlock1ReleaseModule.AppBlock1BuildResponseJson
                > {
                    throw spawnUserError<AirtableApiErrorInfo>({
                        type: AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND,
                    });
                },
            }) as any,
        )
        .command(['release'])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND))
        .it('throws base not found error');

    testReleaseCommand
        .withFiles({
            '/home/projects/my-app/node_modules': null,
        })
        .command(['release'])
        .catch(new RegExp(BuildErrorName.BUILD_NODE_MODULES_ABSENT))
        .it('fails in the absence of a directory named "node_modules"');

    testReleaseCommand
        .command(['release', '--comment', 'fixed the bug'])
        .catch(new RegExp(ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK1_COMMENT_UNSUPPORTED))
        .it('does not support comment flag for v1 blocks');
});

function createStubs() {
    async function _stubCreateReleaseTaskAsync(
        sys?: System,
        context?: AppBundlerContext,
        producer?: releaseModule.ReleaseTaskProducer,
    ): Promise<ReleaseTaskConsumer> {
        invariant(
            sys && context && producer,
            'Arguments sys, context, and producer must be passed in',
        );

        (async () => {
            await Promise.resolve();
            await producer.readyAsync();
        })();

        return {
            async bundleAsync({outputPath}) {
                await sys.fs.writeFileAsync(
                    sys.path.join(outputPath, BUNDLE_FILE_NAME),
                    '// bundled source',
                );
            },
            async teardownAsync() {},
        };
    }

    type UploadBlock1ReleaseStubMethods = {
        constructorOptions(
            options: uploadBlock1ReleaseModule.UploadBlock1ReleaseConstructorOptions,
        ): void;
    } & Pick<
        uploadBlock1ReleaseModule.UploadBlock1Release,
        'buildUploadAsync' | 'createReleaseAsync'
    >;

    function _uploadBlock1ReleaseStub(methods: Partial<UploadBlock1ReleaseStubMethods> = {}): any {
        return class _UploadReleaseStub
            implements
                Pick<
                    uploadBlock1ReleaseModule.UploadBlock1Release,
                    'buildUploadAsync' | 'createReleaseAsync'
                > {
            private blockUrlOptions: AirtableBlock1ApiBaseOptions;

            constructor(
                options: ConstructorParameters<
                    typeof uploadBlock1ReleaseModule['UploadBlock1Release']
                >[0],
            ) {
                if (methods.constructorOptions) {
                    methods.constructorOptions(options);
                }
                this.blockUrlOptions = options.blockUrlOptions;
            }

            async buildUploadAsync(
                options: uploadBlock1ReleaseModule.UploadBlock1ReleaseUploadOptions,
            ) {
                return methods.buildUploadAsync
                    ? await methods.buildUploadAsync(options)
                    : {
                          buildId: 'buildId',
                          frontendBundleUploadUrl: 'frontendBundleUploadUrl',
                          backendDeploymentPackageUploadUrl: null,
                          frontendBundleS3UploadInfo: {
                              endpointUrl: 'endpointUrl',
                              key: null,
                              keyPrefix: null,
                              params: {},
                          },
                          backendDeploymentPackageS3UploadInfo: null,
                      };
            }
            async createReleaseAsync(
                options: uploadBlock1ReleaseModule.UploadBlock1ReleaseCreateReleaseOptions,
            ) {
                if (methods.createReleaseAsync) {
                    await methods.createReleaseAsync(options);
                }
            }
        };
    }

    type UploadBlock2ReleaseStubMethods = {
        constructorOptions(
            options: uploadBlock2ReleaseModule.UploadBlock2ReleaseConstructorOptions,
        ): void;
    } & Pick<
        uploadBlock2ReleaseModule.UploadBlock2Release,
        'buildUploadAsync' | 'createReleaseAsync'
    >;

    function _uploadBlock2ReleaseStub(methods: Partial<UploadBlock2ReleaseStubMethods> = {}): any {
        return class UploadBlock2ReleaseStub
            implements
                Pick<
                    uploadBlock2ReleaseModule.UploadBlock2Release,
                    'buildUploadAsync' | 'createReleaseAsync'
                > {
            constructor(options: uploadBlock2ReleaseModule.UploadBlock2ReleaseConstructorOptions) {
                if (methods.constructorOptions) {
                    methods.constructorOptions(options);
                }
            }

            async buildUploadAsync(
                options: uploadBlock2ReleaseModule.UploadBlock2ReleaseBuildUploadOptions,
            ): Promise<uploadBlock2ReleaseModule.UploadBlock2BuildResponseJson> {
                if (methods.buildUploadAsync) {
                    return await methods.buildUploadAsync(options);
                }
                return {
                    buildId: 'buildId',
                    frontendBundleS3UploadInfo: {
                        endpointUrl: 'endpointUrl',
                        key: null,
                        keyPrefix: null,
                        params: {},
                    },
                };
            }

            async createReleaseAsync(
                options: uploadBlock2ReleaseModule.UploadBlock2ReleaseCreateReleaseOptions,
            ) {
                if (methods.createReleaseAsync) {
                    await methods.createReleaseAsync(options);
                }
            }
        };
    }

    return {
        stubCreateReleaseTaskAsync: _stubCreateReleaseTaskAsync,
        uploadBlock1ReleaseStub: _uploadBlock1ReleaseStub,
        uploadBlock2ReleaseStub: _uploadBlock2ReleaseStub,
    };
}
