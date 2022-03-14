import {expect} from '@oclif/test';

import * as npmModule from '../../src/helpers/npm_async';
import * as appTemplateUtilsModule from '../../src/helpers/app_template_utils';
import {System} from '../../src/helpers/system';
import {mkdirpAsync, removeDirOrFileIfExistsAsync} from '../../src/helpers/system_extra';
import {INIT_DEFAULT_TEMPLATE_URL} from '../../src/settings';

import {test} from '../mocks/test';
const {
    tarballFiles,
    stubNpmInstallAsync,
    stubGetGithubTemplateTarballUrlAsync,
    stubDownloadTarballAsync,
    stubExtractTarballAsync,
} = createStubs();

describe('init', () => {
    const testInitCommand = test
        .timeout(10000)
        .stdout()
        .stderr()
        .enableDebug('block-cli*:init')
        .do(ctx => ctx.system.process.chdir('/home/projects'))
        .withFiles({'/home/projects/my-app': null})
        .stub(
            appTemplateUtilsModule,
            'getGithubTemplateTarballUrlAsync',
            stubGetGithubTemplateTarballUrlAsync,
        )
        .stub(appTemplateUtilsModule, 'downloadTarballAsync', stubDownloadTarballAsync())
        .stub(appTemplateUtilsModule, 'extractTarballAsync', stubExtractTarballAsync())
        .stub(npmModule, 'installAsync', stubNpmInstallAsync())
        .withFiles({
            '/home/.config/.airtableblocksrc.json': Buffer.from(
                '{"airtableApiKey":"keyAPI12345678910"}',
            ),
        });

    testInitCommand
        .command(['init', 'app1234/blk5678', 'my-app'])
        .wroteFile('/home/projects/my-app/block.json', content => content.length > 0)
        .wroteFile(
            '/home/projects/my-app/node_modules/@airtable/blocks/package.json',
            content => content.length > 0,
        )
        .wroteJsonFile('/home/projects/my-app/package.json', {
            dependencies: {'@airtable/blocks': '2.0.0'},
        })
        .it('initializes', ctx => {
            expect(ctx.stderr).to.contain(
                `${(/\/[^/]*$/.exec(INIT_DEFAULT_TEMPLATE_URL) ?? [])[0]}.tar.gz`,
            );
            expect(ctx.stdout).to.contain('Ready');
        });

    testInitCommand
        .command([
            'init',
            'app1234/blk5678',
            'my-app',
            '--template',
            'https://github.com/Airtable/fantasy-block',
        ])
        .it('initializes with template flag', ctx => {
            expect(ctx.stderr).to.contain('fantasy-block.tar.gz');
        });

    testInitCommand
        .withFiles({'/home/.config': null})
        .answer('What is your Airtable', {stdin: 'keyAPI12345678910'})
        .command(['init', 'app1234/blk5678', 'my-app'])
        .wroteUserConfigFile({airtableApiKey: {default: 'keyAPI12345678910'}})
        .it('runs set-api-key if no key is set', ctx => {
            expect(ctx.stderr).to.contain('no api key has been set');
        });

    testInitCommand
        .stub(
            appTemplateUtilsModule,
            'extractTarballAsync',
            stubExtractTarballAsync({
                ...tarballFiles,
                'package/package.json': Buffer.from(
                    JSON.stringify({dependencies: {'@airtable/blocks': '1.0.0'}}),
                ),
            }),
        )
        .command(['init', 'app1234/blk5678', 'my-app'])
        .wroteJsonFile('/home/projects/my-app/package.json', {
            dependencies: {'@airtable/blocks': '1.0.0'},
        })
        .it('only modifies @airtable/blocks dependency latest version to installed one');

    testInitCommand
        .command(['init', 'app1234/blk5678'])
        .catch(/Missing 1 required arg:/)
        .it('requires blockDirPath command argument');

    testInitCommand
        .command(['init'])
        .catch(/Missing 2 required args:/)
        .it('requires blockIdentifier and blockDirPath command arguments');

    testInitCommand
        .command(['init', 'blk5678/app1234', 'my-app'])
        .catch(/blockIdentifierInvalidBaseId/)
        .it('validates blockIdentifier');

    testInitCommand
        .command(['init', 'blk5678/NONE', 'my-app'])
        .catch(/blockIdentifierInvalidBaseId/)
        .it('validates blockIdentifier with v2 blocks base id');

    testInitCommand
        .withFiles({'/home/projects/my-app/.keep': Buffer.alloc(0)})
        .command(['init', 'app1234/blk5678', 'my-app'])
        .catch(/initCommandDirectoryExists/)
        .it('fails if blockDirPath already exists');

    testInitCommand
        .stub(appTemplateUtilsModule, 'extractTarballAsync', stubExtractTarballAsync({}))
        .command(['init', 'app1234/blk5678', 'my-app'])
        .catch(/initCommandTemplateMissing/)
        .it('fails if template has no content');

    testInitCommand
        .stub(
            appTemplateUtilsModule,
            'extractTarballAsync',
            stubExtractTarballAsync({...tarballFiles, 'package/block.json': null}),
        )
        .command(['init', 'app1234/blk5678', 'my-app'])
        .catch(/initCommandTemplateNoBlockJson/)
        .it('fails if template does not have a block.json file');

    testInitCommand
        .stub(
            npmModule,
            'installAsync',
            stubNpmInstallAsync({
                'node_modules/@airtable/blocks/package.json': Buffer.from(JSON.stringify({})),
            }),
        )
        .command(['init', 'app1234/blk5678', 'my-app'])
        .catch(/initCommandInstalledSdkNoVersion/)
        .it('fails if installed @airtable/blocks does not have a version');
});

function createStubs() {
    interface FilesChange {
        [path: string]: Buffer | null;
    }
    interface StubFunction {
        (): any;
    }

    async function withFilesAsync(sys: System, cwd: string, files: FilesChange) {
        for (const [key, value] of Object.entries(files)) {
            const keyPath = sys.path.join(cwd, key);
            if (value) {
                await mkdirpAsync(sys, sys.path.dirname(keyPath));
                await sys.fs.writeFileAsync(keyPath, value);
            } else {
                await removeDirOrFileIfExistsAsync(sys, keyPath);
            }
        }
    }

    async function _stubGetGithubTemplateTarballUrlAsync(template: string) {
        return `https://example.com${(/\/[^/]*$/.exec(template) ?? ['/template'])[0]}.tar.gz`;
    }
    function _stubDownloadTarballAsync(files: FilesChange = {'tarball.tar.gz': Buffer.alloc(0)}) {
        return (async (sys: System, tarballUrl: string, destinationPath: string) => {
            await withFilesAsync(sys, destinationPath, files);
        }) as StubFunction;
    }
    const _tarballFiles = {
        'package/block.json': Buffer.from(JSON.stringify({})),
        'package/package.json': Buffer.from(
            JSON.stringify({dependencies: {'@airtable/blocks': 'latest'}}),
        ),
    };
    function _stubExtractTarballAsync(files: FilesChange = _tarballFiles) {
        return (async (sys: System, tarballPath: string, destinationDir: string) => {
            await withFilesAsync(sys, destinationDir, files);
            return sys.path.join(destinationDir, 'package');
        }) as StubFunction;
    }
    function _stubNpmInstallAsync(
        files: FilesChange = {
            'node_modules/@airtable/blocks/package.json': Buffer.from(
                JSON.stringify({version: '2.0.0'}),
            ),
        },
    ) {
        return (async (sys: System, cwd: string) => {
            await withFilesAsync(sys, cwd, files);
        }) as StubFunction;
    }

    return {
        tarballFiles: _tarballFiles,
        stubGetGithubTemplateTarballUrlAsync: _stubGetGithubTemplateTarballUrlAsync as StubFunction,
        stubDownloadTarballAsync: _stubDownloadTarballAsync,
        stubExtractTarballAsync: _stubExtractTarballAsync,
        stubNpmInstallAsync: _stubNpmInstallAsync,
    };
}
