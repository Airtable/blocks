import {expect} from '@oclif/test';

import * as releaseModule from '../../src/manager/release';
import * as getGitHashModule from '../../src/helpers/get_git_hash';
import * as userAgentModule from '../../src/helpers/user_agent';
import * as airtableLegacyBlockApiModule from '../../src/helpers/airtable_legacy_block_api';
import * as airtableBlockV2ApiModule from '../../src/helpers/airtable_block_v2_api';
import {ReleaseTaskConsumer} from '../../src/tasks/release';
import {System} from '../../src/helpers/system';

import {test} from '../mocks/test';
import {AIRTABLE_API_URL, BUNDLE_FILE_NAME, V2_BLOCKS_BASE_ID} from '../../src/settings';
import {invariant, spawnUnexpectedError, spawnUserError} from '../../src/helpers/error_utils';
import {
    AirtableApiErrorName,
    AirtableApiErrorInfo,
    CreateBuildOptions,
    CreateReleaseOptions,
    CreateBuildResponseJson,
} from '../../src/helpers/airtable_api';
import {AppConfigErrorName} from '../../src/helpers/config_app';
import {RemoteConfigErrorName} from '../../src/helpers/config_remote';
import {SystemApiKeyErrorName} from '../../src/helpers/system_api_key';
import {AppBundlerContext} from '../../src/manager/bundler';
import {
    ReleaseCommandErrorName,
    ReleaseCommandMessageName,
} from '../../src/helpers/release_messages';

const {
    stubCreateReleaseTaskAsync,
    stubGetGitHashAsync,
    airtableLegacyBlockApiStub,
    airtableBlockV2ApiStub,
} = createStubs();

describe('release', () => {
    const testReleaseCommand = test
        .timeout(10000)
        .stdout()
        .stderr()
        .enableDebug('block-cli*:release')
        .stub(releaseModule, 'createReleaseTaskAsync', stubCreateReleaseTaskAsync)
        .stub(getGitHashModule, 'getGitHashAsync', stubGetGitHashAsync)
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
        .stub(userAgentModule, 'createUserAgentAsync', () => 'airtable-cli-user-agent/1.0.0')
        .withJSON({
            '/home/.config/.airtableblocksrc.json': {airtableApiKey: 'key1234'},
            '/home/projects/my-app/.block/remote.json': {baseId: 'abcd', blockId: '1234'},
            '/home/projects/my-app/package.json': {version: '1.0.0'},
            '/home/projects/my-app/block.json': {frontendEntry: 'index.js'},
        })
        .withFiles({
            '/home/projects/my-app/node_modules/fake-dependency/index.js':
                Buffer.from('// fake dependency'),
            '/home/projects/my-app/index.js': Buffer.from('// hello world'),
        });

    const testReleaseCommandBlock2 = testReleaseCommand
        .stub(
            airtableLegacyBlockApiModule,
            'AirtableLegacyBlockApi',
            airtableLegacyBlockApiStub({
                constructorOptions() {
                    throw spawnUnexpectedError('Must use AirtableBlockV2Api');
                },
            }),
        )
        .stub(airtableBlockV2ApiModule, 'AirtableBlockV2Api', airtableBlockV2ApiStub())
        .withJSON({
            '/home/projects/my-app/.block/remote.json': {
                baseId: V2_BLOCKS_BASE_ID,
                blockId: 'blk5678',
            },
        });

    testReleaseCommand.command(['release']).it('releases', (ctx) => {
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
        .wroteFile('/home/projects/my-app/.tmp/index.js', (content) => content.length > 0)
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
            airtableLegacyBlockApiModule,
            'AirtableLegacyBlockApi',
            airtableLegacyBlockApiStub({
                constructorOptions({apiBaseUrl}) {
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
        .it('releases with newremote remote', (ctx) => {
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
            airtableLegacyBlockApiModule,
            'AirtableLegacyBlockApi',
            airtableLegacyBlockApiStub({
                async createBuildAsync(): Promise<CreateBuildResponseJson> {
                    throw spawnUserError<AirtableApiErrorInfo>({
                        type: AirtableApiErrorName.AIRTABLE_API_BLOCK_NOT_FOUND,
                    });
                },
            }),
        )
        .command(['release'])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_BLOCK_NOT_FOUND))
        .it('throws base not found error');

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
            async bundleAsync({outputPath, shouldGenerateSeparateSourceMaps}) {
                await sys.fs.writeFileAsync(
                    sys.path.join(outputPath, BUNDLE_FILE_NAME),
                    '// bundled source',
                );
                if (shouldGenerateSeparateSourceMaps) {
                    await sys.fs.writeFileAsync(
                        sys.path.join(outputPath, BUNDLE_FILE_NAME) + '.map',
                        '// sourcemap',
                    );
                }
            },
            async teardownAsync() {},
        };
    }

    async function _stubGetGitHashAsync(sys?: System, cwd?: string) {
        invariant(sys && cwd, 'Arguments sys and cwd must be passed in');
        return 'gitHash';
    }

    type AirtableLegacyBlockApiStubMethods = {
        constructorOptions(
            options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions,
        ): void;
    } & Pick<
        airtableLegacyBlockApiModule.AirtableLegacyBlockApi,
        'createBuildAsync' | 'createReleaseAsync'
    >;

    function _airtableLegacyBlockApiStub(
        methods: Partial<AirtableLegacyBlockApiStubMethods> = {},
    ): any {
        return class AirtableLegacyBlockApiStub
            implements
                Pick<
                    airtableLegacyBlockApiModule.AirtableLegacyBlockApi,
                    'createBuildAsync' | 'createReleaseAsync'
                >
        {
            private options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions;

            constructor(options: airtableLegacyBlockApiModule.AirtableLegacyBlockApiBaseOptions) {
                if (methods.constructorOptions) {
                    methods.constructorOptions(options);
                }
                this.options = options;
            }

            async createBuildAsync(options: CreateBuildOptions): Promise<CreateBuildResponseJson> {
                return methods.createBuildAsync
                    ? await methods.createBuildAsync(options)
                    : {
                          buildId: 'buildId',
                          frontendBundleUploadUrl: 'frontendBundleUploadUrl',
                          backendDeploymentPackageUploadUrl: null,
                          frontendBundleS3UploadInfo: {
                              endpointUrl: 'endpointUrl',
                              key: 'frontendBundleS3Key',
                              keyPrefix: null,
                              params: {},
                          },
                          backendDeploymentPackageS3UploadInfo: null,
                      };
            }
            async createReleaseAsync(options: CreateReleaseOptions): Promise<void> {
                if (methods.createReleaseAsync) {
                    await methods.createReleaseAsync(options);
                }
            }
        };
    }

    type AirtableBlockV2ApiStubMethods = {
        constructorOptions(options: airtableBlockV2ApiModule.AirtableBlockV2ApiBaseOptions): void;
    } & Pick<
        airtableBlockV2ApiModule.AirtableBlockV2Api,
        'createBuildAsync' | 'createReleaseAsync'
    >;

    function _airtableBlockV2ApiStub(methods: Partial<AirtableBlockV2ApiStubMethods> = {}): any {
        return class AirtableBlockV2ApiStub
            implements
                Pick<
                    airtableBlockV2ApiModule.AirtableBlockV2Api,
                    'createBuildAsync' | 'createReleaseAsync'
                >
        {
            constructor(options: airtableBlockV2ApiModule.AirtableBlockV2ApiBaseOptions) {
                if (methods.constructorOptions) {
                    methods.constructorOptions(options);
                }
            }

            async createBuildAsync(options: CreateBuildOptions): Promise<CreateBuildResponseJson> {
                if (methods.createBuildAsync) {
                    return await methods.createBuildAsync(options);
                }
                return {
                    buildId: 'buildId',
                    frontendBundleUploadUrl: 'frontendBundleUploadUrl',
                    backendDeploymentPackageUploadUrl: null,
                    frontendBundleS3UploadInfo: {
                        endpointUrl: 'endpointUrl',
                        key: 'frontendBundleS3Key',
                        keyPrefix: null,
                        params: {},
                    },
                    backendDeploymentPackageS3UploadInfo: null,
                };
            }

            async createReleaseAsync(options: CreateReleaseOptions): Promise<void> {
                if (methods.createReleaseAsync) {
                    await methods.createReleaseAsync(options);
                }
            }
        };
    }

    return {
        stubCreateReleaseTaskAsync: _stubCreateReleaseTaskAsync,
        stubGetGitHashAsync: _stubGetGitHashAsync,
        airtableLegacyBlockApiStub: _airtableLegacyBlockApiStub,
        airtableBlockV2ApiStub: _airtableBlockV2ApiStub,
    };
}
