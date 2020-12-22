import {expect} from '@oclif/test';

import * as findPortAsyncModule from '../../src/helpers/find_port_async';
import * as developmentProxyServerModule from '../../src/helpers/development_proxy_server';
import * as runModule from '../../src/manager/run';

import {test} from '../mocks/test';
import {RunTaskConsumer} from '../../lib/tasks/run';

type DevelopmentProxyServerInterface = developmentProxyServerModule.DevelopmentProxyServerInterface;

async function stubCreateRunTaskAsync(): Promise<RunTaskConsumer> {
    let port: number;
    return {
        async initAsync() {},
        async startBundlingAsync() {},
        async startDevServerAsync(options) {
            port = options.port;
        },
        async getDevServerPortAsync() {
            return port;
        },
        async teardownAsync() {},

        update() {},
    };
}

class StubDevelopmentProxyServer implements DevelopmentProxyServerInterface {
    async listenAsync(port: number, securePort: number): Promise<[number, number]> {
        return [port, securePort];
    }
    async proxyFrontendAsync(remoteAddress: string): Promise<void> {}
    async closeAsync() {}
}

function stubCreateServer(): any {
    return new StubDevelopmentProxyServer();
}

function stubFindPortAsync(stubOptions: {inUsePorts?: number[]; nextPort?: number} = {}): any {
    return async function(port?, portOptions?) {
        if (stubOptions?.inUsePorts && stubOptions.inUsePorts.includes(port)) {
            return stubOptions?.nextPort ?? 44444;
        }
        if (
            portOptions &&
            typeof portOptions.adjacentPorts === 'number' &&
            portOptions.adjacentPorts > 0
        ) {
            for (let i = 0; i < portOptions.adjacentPorts; i++) {
                if (stubOptions?.inUsePorts?.includes(port + i)) {
                    return stubOptions?.nextPort ?? 55555;
                }
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
        .stub(developmentProxyServerModule, 'createServer', stubCreateServer)
        .stub(runModule, 'createRunTaskAsync', stubCreateRunTaskAsync)
        .withFiles({
            '/home/projects/my-app/block.json': Buffer.from('{"frontendEntry":"index.js"}'),
            '/home/projects/my-app/index.js': Buffer.from('// hello world'),
        });

    testRunCommand
        .answer('Server listening', {signal: 'SIGINT'})
        .command(['run'])
        .wroteFile('/home/projects/my-app/.tmp/index.js', content => content.length > 0)
        .it('runs', ctx => {
            expect(ctx.stdout).to.contain('Server listening');
        });

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
        .catch('"block.json".frontendEntry should be a string')
        .it('validates block.json');
});
