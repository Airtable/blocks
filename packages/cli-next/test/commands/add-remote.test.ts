import {test} from '../mocks/test';

describe('add-remote', () => {
    const testAddRemoteCommand = test
        .stdout()
        .stderr()
        .withFiles({
            '/home/projects/my-app/block.json': Buffer.from('{}'),
        });

    testAddRemoteCommand
        .command(['add-remote', 'app1234/blk5678', 'newremote'])
        .wroteJsonFile('/home/projects/my-app/.block/newremote.remote.json', {
            baseId: 'app1234',
            blockId: 'blk5678',
        })
        .it('completes');

    testAddRemoteCommand
        .command(['add-remote', 'NONE/blk5678', 'newremote'])
        .it('completes with NONE baseId');

    testAddRemoteCommand
        .command(['add-remote', 'app1234/blk5678', 'newremote', '--server', 'test.airtable.com'])
        .wroteJsonFile('/home/projects/my-app/.block/newremote.remote.json', {
            baseId: 'app1234',
            blockId: 'blk5678',
            server: 'test.airtable.com',
        })
        .it('completes with alternate server');

    testAddRemoteCommand
        .command(['add-remote', 'app1234/blk5678', 'newremote', '--api-key-name', 'testkey'])
        .wroteJsonFile('/home/projects/my-app/.block/newremote.remote.json', {
            baseId: 'app1234',
            blockId: 'blk5678',
            apiKeyName: 'testkey',
        })
        .it('completes with alternate api key');

    testAddRemoteCommand
        .withFiles({
            '/home/projects/my-app/frontend/index.js': Buffer.from(''),
        })
        .do(({system: sys}) => sys.process.chdir('/home/projects/my-app/frontend'))
        .command(['add-remote', 'app1234/blk5678', 'newremote'])
        .wroteJsonFile('/home/projects/my-app/.block/newremote.remote.json', {
            baseId: 'app1234',
            blockId: 'blk5678',
        })
        .it('works from a child directory of project root');

    testAddRemoteCommand
        .do(({system: sys}) => sys.process.chdir('/home/projects'))
        .command(['add-remote', 'app1234/blk5678', 'newremote'])
        .catch(/systemConfigAppDirectoryNotFound/)
        .it('cannot find project root');

    testAddRemoteCommand
        .command(['add-remote'])
        .catch(/Missing 2 required args/)
        .it('missing 2 arguments');

    testAddRemoteCommand
        .command(['add-remote', 'app1234/blk5678'])
        .catch(/Missing 1 required arg/)
        .it('missing 1 argument');

    testAddRemoteCommand
        .command(['add-remote', '1234', 'newremote'])
        .catch(/blockIdentifierInvalidFormat/)
        .it('validates blockIdentifier');

    testAddRemoteCommand
        .command(['add-remote', 'app1234/blk5678', '@newremote'])
        .catch(/systemConfigInvalidRemoteName/)
        .it('validates remoteName');

    testAddRemoteCommand
        .withFiles({
            '/home/projects/my-app/.block/newremote.remote.json': Buffer.from(''),
        })
        .command(['add-remote', 'app1234/blk5678', 'newremote'])
        .catch(/remoteCommandConfigExists/)
        .it('does not overwrite existing remote');
});
