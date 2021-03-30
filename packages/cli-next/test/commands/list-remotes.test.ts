import {expect, test} from '../mocks/test';

describe('list-remotes', () => {
    const testListRemotesCommand = test
        .stdout()
        .stderr()
        .withJSON({
            '/home/projects/my-app/block.json': {},
            '/home/projects/my-app/.block/remote.json': {baseId: 'app1234', blockId: 'blk5678'},
        });

    testListRemotesCommand.command(['list-remotes']).it('completes');

    testListRemotesCommand
        .withJSON({
            '/home/projects/my-app/.block/oldremote.remote.json': {
                baseId: 'app1234',
                blockId: 'blk5678',
            },
        })
        .command(['list-remotes'])
        .it('completes with 2 remotes');

    testListRemotesCommand
        .withJSON({
            '/home/projects/my-app/.block/oldremote.remote.json': {
                baseId: 'app1234',
                blockId: 'blk5678',
                server: 't.t.com',
            },
        })
        .command(['list-remotes'])
        .it('completes with server column', ({stdout}) => {
            expect(stdout).to.contain('Server');
        });

    testListRemotesCommand
        .withJSON({
            '/home/projects/my-app/.block/oldremote.remote.json': {
                baseId: 'app1234',
                blockId: 'blk5678',
                apiKeyName: 'apiKey',
            },
        })
        .command(['list-remotes'])
        .it('completes with "Api key name" column', ({stdout}) => {
            expect(stdout).to.contain('Api key name');
        });

    testListRemotesCommand
        .withFiles({
            '/home/projects/my-app/frontend/index.js': Buffer.from(''),
        })
        .do(({system: sys}) => sys.process.chdir('/home/projects/my-app/frontend'))
        .command(['list-remotes'])
        .it('works from a child directory of project root');

    testListRemotesCommand
        .withJSON({
            '/home/projects/my-app/.block/oldremote.remote.json': {baseId: 'app1234'},
        })
        .command(['list-remotes'])
        .catch(/remoteConfigIsNotValid/)
        .it('validates each remote');

    testListRemotesCommand
        .do(({system: sys}) => sys.process.chdir('/home/projects'))
        .command(['list-remotes'])
        .catch(/systemConfigAppDirectoryNotFound/)
        .it('cannot find project root');

    testListRemotesCommand
        .withFiles({
            '/home/projects/my-app/.block': null,
        })
        .command(['list-remotes'])
        .catch(/remoteCommandNoConfigs/)
        .it('errors if .block directory is missing');

    testListRemotesCommand
        .withFiles({
            '/home/projects/my-app/.block/remote.json': null,
        })
        .command(['list-remotes'])
        .catch(/remoteCommandNoConfigs/)
        .it('errors if there are no remotes');
});
