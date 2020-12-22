import {EventEmitter} from 'events';
import {Writable} from 'stream';
import {expect} from '@oclif/test';
import {invariant} from '../../src/helpers/error_utils';
import {Plugin, mapFancyTestAsyncPlugin} from './FancyTestAsync';
import {debug} from './test';

/**
 * An iterable queue that iterates once over values pushed into it.
 */
class IterableAsyncQueue<T> {
    open: boolean = true;
    items: T[] = [];
    push(...items: T[]) {
        this.items.push(...items);
    }
    close() {
        this.open = false;
    }
    async *[Symbol.asyncIterator]() {
        while (
            (await new Promise(resolve => {
                this.push = (...items) => {
                    this.items.push(...items);
                    resolve(true);
                };
                this.close = () => {
                    this.open = false;
                    resolve(true);
                };
            })) &&
            this.open
        ) {
            while (this.items.length > 0) {
                yield this.items.shift();
            }
        }
    }
}

/**
 * Iterate all yielded values from input iterables in the order they are
 * yielded.
 *
 * Promise.race resolves to the value of the first promise of its input promises
 * that resolves before the other promises. This generator yields the first
 * value yielded by any of its input iterables. As a generator it continues to
 * yield values from its input iterables. This iterable ends when any of its
 * inputs reach their end. When this iterable ends, it ends all inputs its
 * following with the optional iterator return method if they have this method.
 *
 * @param iterables A set of async iterables
 * @returns A iterable yielding values from its inputs as they are yielded
 */
async function* raceIterablesAsync<T>(...iterables: AsyncIterable<T>[]) {
    const iterators = Array.from(iterables, able => able[Symbol.asyncIterator]());
    try {
        let done = false;
        while (!done) {
            const result = await Promise.race(iterators.map(tor => tor.next()));
            if (result.done) {
                done = true;
            } else {
                yield result.value;
            }
        }
    } finally {
        for (const tor of iterators) {
            if (tor.return) {
                tor.return();
            }
        }
    }
}

function spyStreamWrites(stream: Writable) {
    const data: string[] = [];

    const write = stream.write;
    stream.write = (message: string | Uint8Array, ...args: any[]): boolean => {
        write.apply(stream, [message, ...args] as any);
        data.push(ArrayBuffer.isView(message) ? new TextDecoder().decode(message) : message);
        return true;
    };
    const uninstall = () => {
        stream.write = write;
    };

    return {
        data,
        uninstall,
    };
}

/**
 * Enqueue listeners that are being bound to an emitter.
 *
 * @param listenerQueue Queue to push into
 * @param emitter Emitter source listener is binding to
 * @param method Emitter method called to bind listener to emitter
 * @returns Wrapped method that will enqueue a new listener
 */
function enqueueNewListeners<T>(
    listenerQueue: IterableAsyncQueue<T>,
    emitter: EventEmitter,
    method: (...args: any[]) => any,
) {
    invariant(typeof method === 'function', 'EventEmitter method is not a function');
    return (...args: any[]) => {
        const result = method.apply(emitter, args);
        listenerQueue.push(args[1]);
        return result;
    };
}

/**
 * Record new listeners bound to an emitter into an asynchrnous iterable.
 *
 * @param emitter Emitter to spy on
 * @param methodNames Methods of emitter to spy on
 * @returns An object with the iterable and method to uninstall the spy
 */
function spyNewListeners(
    emitter: EventEmitter,
    methodNames: (keyof EventEmitter)[] = ['on', 'once', 'addListener'],
) {
    const listenerQueue = new IterableAsyncQueue<Parameters<EventEmitter['addListener']>[1]>();

    const savedState = {} as {[key: string]: (...args: any[]) => any};
    for (const name of methodNames) {
        savedState[name] = emitter[name];
        emitter[name] = enqueueNewListeners(listenerQueue, emitter, emitter[name]);
    }

    return {
        listenerQueue,
        uninstall() {
            for (const name of methodNames) {
                emitter[name] = savedState[name];
            }
        },
    };
}

/**
 * Iterate newly bound listeners on emitter.
 *
 * As a generator when the calling code leaves its for-await-of loop the finally
 * clause of the try/finally block will execute allowing this generator to clean
 * up after itself.
 */
async function* eachNewListenerAsync(
    emitter: EventEmitter,
    methodNames: (keyof EventEmitter)[] = ['on', 'once', 'addListener'],
) {
    const spy = spyNewListeners(emitter, methodNames);

    try {
        yield* spy.listenerQueue;
    } finally {
        spy.uninstall();
    }
}

/**
 * An iterator that does not yield a value but yields that it is done when
 * promise resolves.
 */
async function* waitUntilAsync(done: Promise<unknown>) {
    await done;
}

/**
 *
 * @param prompt
 * @param response
 */
function answerThread(prompt: string, response: {stdin: string} | {signal: 'SIGINT'}) {
    return async (donePromise: Promise<unknown>) => {
        debug('binding answerer for: %s', prompt);

        let responded = false;

        const errSpy = spyStreamWrites(process.stderr);
        const outSpy = spyStreamWrites(process.stdout);

        // Iterate new listeners from stdin and process. When a listener is
        // bound check if the spied stdout and stderr output contains the expect
        // `prompt` text. If the `prompt` is there send the stated response.
        for await (const listener of raceIterablesAsync(
            eachNewListenerAsync(process.stdin),
            eachNewListenerAsync(process),
            waitUntilAsync(donePromise),
        )) {
            if (!listener) {
                continue;
            }

            if (errSpy.data.join('').includes(prompt) || outSpy.data.join('').includes(prompt)) {
                debug('give response: %s', response);
                if ('stdin' in response) {
                    listener(response.stdin);
                    listener('\n');
                } else if ('signal' in response) {
                    listener(response.signal);
                }
                errSpy.data.length = 0;
                outSpy.data.length = 0;
                responded = true;
            }
        }

        errSpy.uninstall();
        outSpy.uninstall();

        expect(responded).to.equal(true);
    };
}

/**
 * Return a FancyTest Plugin that calls a function to do work and test the code
 * in parallel with other FancyTest Plugins.
 */
function testPluginFrom(
    threadAsync: (donePromise: Promise<any>) => Promise<any>,
): Plugin<{error?: any}> {
    let resolveDone = () => {};
    let threadPromise: Promise<void>;

    return mapFancyTestAsyncPlugin({
        run(ctx) {
            const donePromise = new Promise<void>(resolve => {
                resolveDone = () => resolve();
            });

            threadPromise = threadAsync(donePromise);
        },
        async finallyAsync(ctx) {
            resolveDone();

            try {
                // If an error occured, throw here.
                await threadPromise;
            } catch (err) {
                // If an error has not yet been posted to FancyTest do so here.
                if (!ctx.error) {
                    ctx.error = err;
                }
            }
        },
    });
}

/**
 * Answer a message written by the process.
 *
 * @param prompt Message to watch for in stdout and stderr
 * @param response Reaction to send when message appears
 */
export function answer(
    prompt: string,
    response: {stdin: string} | {signal: 'SIGINT'},
): Plugin<{error?: any}> {
    debug('will answer: %s', prompt);

    return testPluginFrom(answerThread(prompt, response));
}
