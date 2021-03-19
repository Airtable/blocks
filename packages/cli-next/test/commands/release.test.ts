import {expect} from '@oclif/test';

import * as releaseModule from '../../src/manager/release';
import * as userAgentModule from '../../src/helpers/user_agent';
import * as uploadReleaseModule from '../../src/helpers/upload_release';
import {ReleaseTaskConsumer} from '../../src/tasks/release';
import {System} from '../../src/helpers/system';

import {test} from '../mocks/test';
import {AIRTABLE_API_URL, BUNDLE_FILE_NAME} from '../../src/settings';
import {invariant, spawnUserError} from '../../src/helpers/error_utils';
import {
    AirtableApiBlockOptions,
    AirtableApiErrorName,
    AirtableApiErrorInfo,
} from '../../src/helpers/airtable_api';
import {AppConfigErrorName} from '../../src/helpers/config_app';
import {RemoteConfigErrorName} from '../../src/helpers/config_remote';
import {SystemApiKeyErrorName} from '../../src/helpers/system_api_key';
import {AppBundlerContext} from '../../src/manager/bundler';

const {
    stubCreateReleaseTaskAsync,
    UploadReleaseStub,
    UploadReleaseStubAltApiBaseUrl,
    UploadReleaseStubMissingBase,
} = createStubs();

describe('release', () => {
    const testReleaseCommand = test
        .timeout(10000)
        .stdout()
        .stderr()
        .enableDebug('block-cli*:release')
        .stub(releaseModule, 'createReleaseTaskAsync', stubCreateReleaseTaskAsync)
        .stub(uploadReleaseModule, 'UploadRelease', UploadReleaseStub as any)
        .stub(userAgentModule, 'createUserAgentAsync', () => 'airtable-cli-user-agent/1.0.0')
        .withFiles({
            '/home/.config/.airtableblocksrc.json': Buffer.from('{"airtableApiKey":"key1234"}'),
            '/home/projects/my-app/.block/remote.json': Buffer.from(
                '{"baseId":"abcd","blockId":"1234"}',
            ),
            '/home/projects/my-app/package.json': Buffer.from('{"version":"1.0.0"}'),
            '/home/projects/my-app/block.json': Buffer.from('{"frontendEntry":"index.js"}'),
            '/home/projects/my-app/index.js': Buffer.from('// hello world'),
        });

    testReleaseCommand.command(['release']).it('releases', ctx => {
        expect(ctx.stderr).to.contain('Releasing');
    });

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
        .withFiles({
            '/home/projects/my-app/.block/remote.json': Buffer.from(
                '{"baseId":"abcd","blockId":"1234","server":"http://example.com"}',
            ),
        })
        .stub(uploadReleaseModule, 'UploadRelease', UploadReleaseStubAltApiBaseUrl as any)
        .command(['release'])
        .it('releases to alternative stated airtable server');

    testReleaseCommand
        .withFiles({
            '/home/projects/my-app/.block/newremote.remote.json': Buffer.from(
                JSON.stringify({baseId: 'app123', blockId: 'blk5678'}),
            ),
        })
        .command(['release', '--remote', 'newremote'])
        .it('releases with newremote remote', ctx => {
            expect(ctx.stderr).to.contain('/newremote.remote.json');
        });

    testReleaseCommand
        .withFiles({
            '/home/projects/my-app/block.json': Buffer.from('{}'),
        })
        .command(['release'])
        .catch(new RegExp(AppConfigErrorName.APP_CONFIG_IS_NOT_VALID))
        .it('validates block.json');

    testReleaseCommand
        .withFiles({
            '/home/projects/my-app/.block/remote.json': Buffer.from('{}'),
        })
        .command(['release'])
        .catch(new RegExp(RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID))
        .it('validates remote.json');

    testReleaseCommand
        .withFiles({
            '/home/.config/.airtableblocksrc.json': Buffer.from('{}'),
        })
        .command(['release'])
        .catch(new RegExp(SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND))
        .it('ensures there is an airtableApiKey');

    testReleaseCommand
        .stub(uploadReleaseModule, 'UploadRelease', UploadReleaseStubMissingBase as any)
        .command(['release'])
        .catch(new RegExp(AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND))
        .it('throws base not found error');
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

        let _outputPath: string;
        return {
            async bundleAsync({outputPath}) {
                _outputPath = outputPath;
                await sys.fs.writeFileAsync(
                    sys.path.join(_outputPath, BUNDLE_FILE_NAME),
                    '// bundled source',
                );
            },
            async teardownAsync() {},
        };
    }

    class _UploadReleaseStub
        implements
            Pick<uploadReleaseModule.UploadRelease, 'buildUploadAsync' | 'createReleaseAsync'> {
        private blockUrlOptions: AirtableApiBlockOptions;

        constructor({
            airtable,
            s3,
            ...blockUrlOptions
        }: ConstructorParameters<typeof uploadReleaseModule['UploadRelease']>[0]) {
            this.blockUrlOptions = blockUrlOptions;
        }

        async buildStartAsync() {
            return {
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
        async buildUploadAsync() {
            return await this.buildStartAsync();
        }
        async createReleaseAsync() {}
    }

    class _UploadReleaseStubAltApiBaseUrl extends _UploadReleaseStub {
        constructor(...args: ConstructorParameters<typeof uploadReleaseModule['UploadRelease']>) {
            super(...args);
            expect(args[0].apiBaseUrl).to.not.equal(AIRTABLE_API_URL);
        }
    }

    class _UploadReleaseStubMissingBase extends _UploadReleaseStub {
        async buildUploadAsync(): Promise<never> {
            throw spawnUserError<AirtableApiErrorInfo>({
                type: AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND,
            });
        }
    }

    return {
        stubCreateReleaseTaskAsync: _stubCreateReleaseTaskAsync,
        UploadReleaseStub: _UploadReleaseStub,
        UploadReleaseStubAltApiBaseUrl: _UploadReleaseStubAltApiBaseUrl,
        UploadReleaseStubMissingBase: _UploadReleaseStubMissingBase,
    };
}
