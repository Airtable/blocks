import {test} from '../mocks/test';

describe('remove-remote', () => {
    const testRemoveRemoteCommand = test
        .stdout()
        .stderr()
        .withFiles({
            '/home/projects/my-app/block.json': Buffer.from('{}'),
            '/home/projects/my-app/.block/oldremote.remote.json': Buffer.from(''),
        });

    testRemoveRemoteCommand
        .command(['remove-remote', 'oldremote'])
        .filePresence('/home/projects/my-app/.block/oldremote.remote.json', false)
        .it('completes');

    testRemoveRemoteCommand
        .withFiles({
            '/home/projects/my-app/frontend/index.js': Buffer.from(''),
        })
        .do(({system: sys}) => sys.process.chdir('/home/projects/my-app/frontend'))
        .command(['remove-remote', 'oldremote'])
        .filePresence('/home/projects/my-app/.block/oldremote.remote.json', false)
        .it('works from a child directory of project root');

    testRemoveRemoteCommand
        .do(({system: sys}) => sys.process.chdir('/home/projects'))
        .command(['remove-remote', 'oldremote'])
        .catch(/systemConfigAppDirectoryNotFound/)
        .it('cannot find project root');

    testRemoveRemoteCommand
        .command(['remove-remote'])
        .catch(/Missing 1 required arg/)
        .it('missing 1 argument');

    testRemoveRemoteCommand
        .command(['remove-remote', '@oldremote'])
        .catch(/systemConfigInvalidRemoteName/)
        .it('validates remoteName');

    testRemoveRemoteCommand
        .withFiles({
            '/home/projects/my-app/.block/oldremote.remote.json': null,
        })
        .command(['remove-remote', 'oldremote'])
        .catch(/remoteCommandConfigMissing/)
        .it('cannot remove a remote that does not exist');
});
