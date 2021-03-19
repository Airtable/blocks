import {expect} from '@oclif/test';

import * as findPortAsyncModule from '../../src/helpers/find_port_async';
import * as developmentProxyServerModule from '../../src/helpers/development_proxy_server';
import * as runModule from '../../src/manager/run';
import {RunDevServerOptions, RunTaskConsumerChannel, RunTaskProducer} from '../../src/tasks/run';

import {test} from '../mocks/test';
import {System} from '../../src/helpers/system';
import {invariant} from '../../src/helpers/error_utils';
import {AppConfigErrorName} from '../../src/helpers/config_app';

type DevelopmentServerInterface = developmentProxyServerModule.DevelopmentServerInterface;
type DevelopmentProxyServerInterface = developmentProxyServerModule.DevelopmentServerInterface;

async function stubCreateRunTaskAsync(
    sys?: System,
    producer?: RunTaskProducer,
): Promise<RunTaskConsumerChannel> {
    invariant(sys && producer, 'arguments sys and producer are passed in');
    const consumer = {
        async startDevServerAsync(options: RunDevServerOptions) {},
        async teardownAsync() {},
    };
    (async () => {
        await Promise.resolve();
        await producer.readyAsync();
    })();
    return {
        async requestAsync(method: any, ...args: any[]) {
            return await (consumer as any)[method](...args);
        },
    };
}

class StubDevelopmentProxyServer implements DevelopmentServerInterface {
    async proxyFrontendAsync(remoteAddress: string): Promise<DevelopmentProxyServerInterface> {
        return this;
    }
    async closeAsync() {}
}

function stubCreateServer(): any {
    return new StubDevelopmentProxyServer();
}

function stubFindPortAsync(stubOptions: {inUsePorts?: number[]; nextPort?: number} = {}): any {
    return async function(port?, portOptions?) {
        const ports = Number(portOptions?.adjacentPorts) || 0;
        for (let i = 0; i < ports + 1; i++) {
            if (stubOptions?.inUsePorts?.includes(port + i)) {
                return stubOptions?.nextPort ?? 44444;
            }
        }
        return port ?? 33333;
    } as typeof findPortAsyncModule.findPortAsync;
}

describe('run', () => {
    const testRunCommand = test
        .timeout(10000)
        .stdout()
        .stderr()
        .enableDebug('block-cli*:run')
        .stub(findPortAsyncModule, 'findPortAsync', stubFindPortAsync())
        .stub(developmentProxyServerModule, 'createServerAsync', stubCreateServer)
        .stub(runModule, 'createRunTaskAsync', stubCreateRunTaskAsync)
        .withFiles({
            '/home/projects/my-app/block.json': Buffer.from('{"frontendEntry":"index.js"}'),
            '/home/projects/my-app/index.js': Buffer.from('// hello world'),
        });

    testRunCommand
        .answer('Server listening', {signal: 'SIGINT'})
        .command(['run'])
        .it('runs', ctx => {
            expect(ctx.stdout).to.contain('Server listening');
        });

    testRunCommand
        .stubDirectoryRemoval()
        .answer('Server listening', {signal: 'SIGINT'})
        .command(['run'])
        .filePresence('/home/projects/my-app/.tmp/index.js', true)
        .wroteFile('/home/projects/my-app/.tmp/index.js', content => content.length > 0)
        .it('creates an entry point');

    testRunCommand
        .answer('Server listening', {signal: 'SIGINT'})
        .command(['run'])
        .filePresence('/home/projects/my-app/.tmp/index.js', false)
        .it('removes the entry point following successful shutdown');

    testRunCommand
        .answer('Server listening', {signal: 'SIGINT'})
        .stub(
            findPortAsyncModule,
            'findPortAsync',
            stubFindPortAsync({inUsePorts: [9000], nextPort: 9002}),
        )
        .command(['run'])
        .it('finds next preferred port on checking in use port 9000', ctx => {
            expect(ctx.stderr).to.contain('(https) 9002');
            expect(ctx.stderr).to.contain('(http) 9003');
        });

    testRunCommand
        .answer('Server listening', {signal: 'SIGINT'})
        .stub(
            findPortAsyncModule,
            'findPortAsync',
            stubFindPortAsync({inUsePorts: [9001], nextPort: 9002}),
        )
        .command(['run'])
        .it('finds next preferred port on checking adjacent in use port 9001', ctx => {
            expect(ctx.stderr).to.contain('(https) 9002');
            expect(ctx.stderr).to.contain('(http) 9003');
        });

    testRunCommand
        .answer('Server listening', {signal: 'SIGINT'})
        .command(['run', '--port=1234', '--bundlerPort=2345'])
        .it('uses ports provided in flags', ctx => {
            expect(ctx.stderr).to.contain('(https) 1234');
            expect(ctx.stderr).to.contain('(http) 1235');
            expect(ctx.stderr).to.contain('(http) 2345');
        });

    testRunCommand
        .withFiles({
            '/home/projects/my-app/block.json': null,
        })
        .command(['run'])
        .catch('Could not find directory that includes a block.json entry.')
        .it('errors when it cannot find the application root');

    testRunCommand
        .withFiles({
            '/home/projects/my-app/block.json': Buffer.from('{}'),
        })
        .command(['run'])
        .catch(new RegExp(AppConfigErrorName.APP_CONFIG_IS_NOT_VALID))
        .it('validates block.json');
});
