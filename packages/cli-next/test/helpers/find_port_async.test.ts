import {expect} from '@oclif/test';

import {spawnUnexpectedError} from '../../src/helpers/error_utils';
import * as findPortAsyncModule from '../../src/helpers/find_port_async';

import {test} from '../mocks/test';
import {mapFancyTestAsyncPlugin} from '../mocks/FancyTestAsync';

const FindPortErrorName = findPortAsyncModule.FindPortErrorName;

describe('find_port_async', () => {
    const testFindPortAsync = test.register('findPortAsync', findPortAsyncPlugin);

    testFindPortAsync
        .findPortAsync(9000, {
            bindPortAsync: stubBindPort(),
            promptForPortAsync: stubPromptForPortThrowsAsync,
        })
        .it('resolves to given unused port', ({findPortAsyncResult}) => {
            expect(findPortAsyncResult).to.equal(9000);
        });

    testFindPortAsync
        .findPortAsync(9000, {
            adjacentPorts: 1,
            bindPortAsync: stubBindPort(),
            promptForPortAsync: stubPromptForPortThrowsAsync,
        })
        .it('resolves to given unused port', ({findPortAsyncResult}) => {
            expect(findPortAsyncResult).to.equal(9000);
        });

    testFindPortAsync
        .findPortAsync(9000, {
            bindPortAsync: stubBindPort({usedPorts: [9000]}),
            promptForPortAsync: stubPromptForPort('9002'),
        })
        .it('resolves on number string from user', ({findPortAsyncResult}) => {
            expect(findPortAsyncResult).to.equal(9002);
        });

    testFindPortAsync
        .findPortAsync(9000, {
            adjacentPorts: 1,
            bindPortAsync: stubBindPort({usedPorts: [9001]}),
            promptForPortAsync: stubPromptForPort('9002'),
        })
        .it('resolves to another port when adjacent port is blocked', ({findPortAsyncResult}) => {
            expect(findPortAsyncResult).to.equal(9002);
        });

    testFindPortAsync
        .findPortAsync(0, {
            bindPortAsync: stubBindPort(),
            promptForPortAsync: stubPromptForPortThrowsAsync,
        })
        .it('does not resolve to 0 when requested', ({findPortAsyncResult}) => {
            expect(findPortAsyncResult).to.not.equal(0);
        });

    testFindPortAsync
        .findPortAsync(9000, {
            bindPortAsync: stubBindPort({usedPorts: [9000]}),
            promptForPortAsync: stubPromptForPort('string'),
        })
        .catch(new RegExp(FindPortErrorName.FIND_PORT_ASYNC_PORT_IS_NOT_NUMBER))
        .it('throws on non-number string from user');
});

function stubPromptForPort<T>(response: T) {
    return async () => response;
}

async function stubPromptForPortThrowsAsync(): Promise<never> {
    throw spawnUnexpectedError('promptForPortAsync should not be called');
}

function stubBindPort({
    usedPorts = [],
    randomPort = 55555,
}: {usedPorts?: number[]; randomPort?: number} = {}) {
    return async (port: number) => {
        if (port === 0) {
            return randomPort;
        }
        if (usedPorts.includes(port)) {
            throw Object.assign(spawnUnexpectedError('EADDRINUSE'), {code: 'EADDRINUSE'});
        }
        return port;
    };
}

function findPortAsyncPlugin(...args: Parameters<(typeof findPortAsyncModule)['findPortAsync']>) {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {findPortAsyncResult: number}) {
            ctx.findPortAsyncResult = await findPortAsyncModule.findPortAsync(...args);
        },
    });
}
