import {EventEmitter} from 'events';
import {Writable} from 'stream';
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

function spyStreamWrites(stream: Writable) {
    const dataIterable = new IterableAsyncQueue<string>();
    const write = stream.write;
    stream.write = function(this: Writable, message: string | Uint8Array, ...args: any[]): boolean {
        dataIterable.push(
            ArrayBuffer.isView(message) ? new TextDecoder().decode(message) : message,
        );
        return write.apply(this, [message, ...args] as any);
    };

    const end = stream.end;
    stream.end = function(this: Writable, ...args: Array<any>): ReturnType<typeof end> {
        if (typeof args[0] === 'string') {
            dataIterable.push(args[0]);
        } else if (Buffer.isBuffer(args[0])) {
            dataIterable.push(args[0].toString());
        } else if (ArrayBuffer.isView(args[0])) {
            dataIterable.push(new TextDecoder().decode(args[0]));
        }

        return end.apply(this, args as Parameters<typeof end>);
    };

    const uninstall = () => {
        dataIterable.close();
        stream.write = write;
        stream.end = end;
    };

    return {
        dataIterable,
        uninstall,
    };
}

/**
 * Accumulate strings emitted by an asynchronous iterable until the accumulated
 * value includes some substring.
 *
 * @param dataIterable Async Iterable over strings
 * @param needle the value to search for within the iterated strings
 */
async function waitForAsync(dataIterable: IterableAsyncQueue<string>, needle: string) {
    let data = '';

    for await (const chunk of dataIterable) {
        data += chunk;
        if (data.includes(needle)) {
            break;
        }
    }
}

/**
 * Record new listeners bound to an emitter into an asynchrnous iterable.
 *
 * @param emitter Emitter to spy on
 * @returns An object with the iterable and method to uninstall the spy
 */
function spyNewListeners(realEmitter: EventEmitter) {
    const methodNames = ['on', 'once', 'addListener'] as const;
    const savedState = {} as {[key: string]: (...args: any[]) => any};
    const fakeEmitter = new EventEmitter();

    for (const methodName of methodNames) {
        const realMethod = (savedState[methodName] = realEmitter[methodName]);

        realEmitter[methodName] = function(
            this: any,
            event: string | symbol,
            listener: (...args: any[]) => void,
        ) {
            fakeEmitter[methodName](event, listener);
            return realMethod.call(this, event, listener);
        };
    }

    return {
        fakeEmitter,
        uninstall() {
            for (const methodName of methodNames) {
                realEmitter[methodName] = savedState[methodName];
            }
        },
    };
}

/**
 *
 * @param prompt
 * @param response
 */
function answerThread(prompt: string, response: {stdin: string} | {signal: 'SIGINT'}) {
    return async (donePromise: Promise<unknown>) => {
        debug('binding answerer for: %s', prompt);

        let realEmitter: EventEmitter;
        let simulate: (emitter: EventEmitter) => void;

        if ('stdin' in response) {
            realEmitter = process.stdin;
            simulate = (emitter: EventEmitter) => {
                emitter.emit('data', response.stdin);
                emitter.emit('data', '\n');
            };
        } else {
            realEmitter = process;
            simulate = (emitter: EventEmitter) => {
                emitter.emit(response.signal);
            };
        }

        const {fakeEmitter, uninstall} = spyNewListeners(realEmitter);
        const errSpy = spyStreamWrites(process.stderr);
        const outSpy = spyStreamWrites(process.stdout);

        await Promise.race([
            waitForAsync(errSpy.dataIterable, prompt),
            waitForAsync(outSpy.dataIterable, prompt),
        ]);
        uninstall();
        errSpy.uninstall();
        outSpy.uninstall();

        simulate(fakeEmitter);
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
