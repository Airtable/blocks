import {EventEmitter} from 'events';

import _debug from 'debug';

import {Deferred} from './deferred';
import {invariant, spawnUnexpectedError} from './error_utils';
import {ObjectMap} from './private_utils';
import {Result} from './result';

const debug = _debug('block-cli:task:ipc:' + (process.send ? 'down' : 'up'));

interface PipeEnd<SendMessage, ReceiveMessage> {
    send(message: SendMessage): void;
    on(event: 'close', handle: () => void): this;
    on(event: 'message', handle: (message: ReceiveMessage) => void): this;
    removeListener(event: 'close', handle: () => void): this;
    removeListener(event: 'message', handle: (message: ReceiveMessage) => void): this;
}

interface Channel<TX, RX> {
    send(message: TX): void;
    [Symbol.asyncIterator](): AsyncIterator<RX>;
}

interface Closeable {
    close(): void;
}

const queueClosedSymbol = Symbol.for('queueClosed');

class QueueAsyncIterable<T> {
    private _closed: boolean = false;
    private _queue: (T | typeof queueClosedSymbol)[] = [];
    private _resolveShift: (() => void) | null = null;

    private async shiftAsync(): Promise<T | typeof queueClosedSymbol> {
        while (this._queue.length === 0) {
            invariant(this._resolveShift === null, 'one shifter at a time');
            await new Promise<void>(resolve => {
                this._resolveShift = resolve;
            });
            this._resolveShift = null;
        }
        return this._queue.shift() as T | typeof queueClosedSymbol;
    }

    push(...args: T[]) {
        this._queue.push(...args);
        if (this._resolveShift !== null) {
            this._resolveShift();
        }
    }

    close() {
        this._closed = true;
        this._queue.push(queueClosedSymbol);
        if (this._resolveShift !== null) {
            this._resolveShift();
        }
    }

    async *[Symbol.asyncIterator](): AsyncIterator<T> {
        while (!this._closed) {
            const item = await this.shiftAsync();
            if (item === queueClosedSymbol) {
                return;
            }
            yield item;
        }
        for (const item of this._queue) {
            if (item === queueClosedSymbol) {
                continue;
            }
            yield item;
        }
    }
}

class PipeChannelImplementation<TX, RX> implements Channel<TX, RX>, Closeable {
    pipe: PipeEnd<TX, RX>;
    closedDefer = new Deferred<void>();

    constructor(pipe: PipeEnd<TX, RX>) {
        this.pipe = pipe;
    }

    send(message: TX): void {
        debug('sending message', message);
        this.pipe.send(message);
    }

    close() {
        this.closedDefer.resolve();
    }

    async *[Symbol.asyncIterator](): AsyncIterator<RX> {
        const receiveQueue = new QueueAsyncIterable<RX>();

        // Handle can be called multiple times before the await statement
        const handle = (data: RX) => {
            debug('receiving message', data);
            receiveQueue.push(data);
        };
        const closeHandle = () => {
            receiveQueue.close();
        };

        try {
            this.pipe.on('close', closeHandle);
            this.pipe.on('message', handle);
            this.closedDefer.promise.then(closeHandle);

            yield* receiveQueue;
        } finally {
            this.pipe.removeListener('close', closeHandle);
            this.pipe.removeListener('message', handle);
        }
    }
}

enum ApplicationMessageType {
    REQUEST,
    RESPONSE,
    ERROR,
}

type Values<R extends ObjectMap<string, any>> = R[keyof R];
type RequestArgs<R> = Parameters<Values<ChannelMethods<R>>> & any[];
type RequestResults<R> = ReturnType<Values<ChannelMethods<R>>> extends Promise<infer P> ? P : never;

type RequestMessage<H> = [
    ApplicationMessageType.REQUEST,
    number,
    CallableKeys<ChannelMethods<H>>,
    RequestArgs<H>,
];

type ResponseMessage<H> =
    | [ApplicationMessageType.RESPONSE, number, RequestResults<H>]
    | [ApplicationMessageType.ERROR, number, any];

class RequestChannelImplementation<Remote extends ChannelMethods<Remote>>
    implements RequestChannel<Remote> {
    private _inner: Channel<RequestMessage<Remote>, ResponseMessage<Remote>>;
    private _nextId: number = 0;

    constructor(inner: Channel<RequestMessage<Remote>, ResponseMessage<Remote>>) {
        this._inner = inner;
    }

    private _newId(): number {
        return this._nextId++;
    }

    async requestAsync<
        Name extends CallableKeys<ChannelMethods<Remote>>,
        Method extends Remote[Name],
        Return extends ReturnType<Method>
    >(
        method: Name,
        ...args: Parameters<Method>
    ): Promise<Return extends Promise<infer P> ? P : never> {
        const id = this._newId();

        this._inner.send([ApplicationMessageType.REQUEST, id, method, args]);

        for await (const received of this._inner) {
            if (received[0] === ApplicationMessageType.RESPONSE && received[1] === id) {
                debug('received response', id, method);
                return received[2];
            } else if (received[0] === ApplicationMessageType.ERROR && received[1] === id) {
                debug('received error', id, method);
                throw received[2];
            }
        }

        throw spawnUnexpectedError('channel closed while waiting for response');
    }
}

class ResponseChannelImplementation<
    Local extends {[key: string]: (...args: any[]) => Promise<any>}
> {
    private _inner: Channel<ResponseMessage<Local>, RequestMessage<Local>>;
    private _handles: Local;
    private _observer: EventEmitter;

    channelClosedPromise: Promise<void>;

    constructor(inner: Channel<ResponseMessage<Local>, RequestMessage<Local>>, handles: Local) {
        this._inner = inner;
        this._handles = handles;
        this._observer = new EventEmitter();

        this.channelClosedPromise = this._handleRequestsAsync();
    }

    private async _handleRequestsAsync(): Promise<void> {
        for await (const received of this._inner) {
            if (received[0] === ApplicationMessageType.REQUEST) {
                const [, id, method, args] = received;
                debug('responding to request: ', method, args);
                this._observer.emit('message', {
                    method,
                    args,
                    result: (async () => {
                        try {
                            const response = await this._handles[method](...args);
                            this._inner.send([ApplicationMessageType.RESPONSE, id, response]);
                            return {value: response};
                        } catch (err) {
                            this._inner.send([ApplicationMessageType.ERROR, id, err]);
                            return {err};
                        }
                    })(),
                });
            }
        }
    }

    async *[Symbol.asyncIterator](): AsyncIterator<{
        method: keyof ChannelMethods<Local>;
        args: RequestArgs<Local>;
        result: Promise<Result<RequestResults<Local>>>;
    }> {
        const iterable = new QueueAsyncIterable<any>();
        const closeHandle = () => iterable.close();
        const handle = (message: any) => iterable.push(message);
        try {
            this._observer.addListener('message', handle);
            this._observer.addListener('close', closeHandle);

            yield* iterable;
        } finally {
            this._observer.removeListener('message', handle);
            this._observer.removeListener('close', closeHandle);
        }
    }
}

export function createPipeChannel<TX = any, RX = any>(
    pipe: PipeEnd<TX, RX>,
): Channel<TX, RX> & Closeable {
    return new PipeChannelImplementation(pipe);
}

export function createRequestChannel<H extends ChannelMethods<H>>(
    inner: Channel<RequestMessage<H>, ResponseMessage<H>>,
): RequestChannel<H> {
    return new RequestChannelImplementation<H>(inner);
}

export function createResponseChannel<H extends ChannelMethods<H>>(
    inner: Channel<ResponseMessage<H>, RequestMessage<H>>,
    handles: H,
) {
    return new ResponseChannelImplementation(inner, handles);
}

/**
 * Values that can be sent over a channel.
 */
export type ChannelArg =
    | null
    | boolean
    | number
    | string
    | ChannelArg[]
    | {
          [key: string]: ChannelArg;
      };

/**
 * A function with argument and return types that can be sent over a channel.
 */
export type ChannelFunction<T extends (...args: any[]) => Promise<any>> = T extends (
    ...args: infer Args
) => infer Return
    ? (...args: Extract<Args, ChannelArg[]>) => Extract<Return, Promise<ChannelArg | void>>
    : never;

/**
 * Keys of an object whose values are anything except never.
 */
type CallableKeys<T> = {
    [key in Extract<keyof T, string>]: T[key] extends (...args: any[]) => Promise<any>
        ? T[key] extends ChannelFunction<T[key]>
            ? key
            : never
        : never;
}[Extract<keyof T, string>];

/**
 * An object with methods that can be called over a channel.
 */
export type ChannelMethods<T> = {[key in CallableKeys<T>]: T[key]};

/**
 * An object that can request methods be called on the remote side and their
 * value eventually returned.
 */
export interface RequestChannel<T extends ChannelMethods<T>> {
    requestAsync<
        N extends CallableKeys<ChannelMethods<T>>,
        F extends T[N],
        R extends ReturnType<F>
    >(
        method: N,
        ...args: Parameters<F>
    ): Promise<R extends Promise<infer P> ? P : never>;
}

export class RequestChannelAdapter<T extends ChannelMethods<T>> implements RequestChannel<T> {
    private _remote: T;

    constructor(remote: T) {
        this._remote = remote;
    }

    async requestAsync<
        N extends CallableKeys<ChannelMethods<T>>,
        F extends T[N],
        R extends ReturnType<F>
    >(method: N, ...args: Parameters<F> & any[]): Promise<R extends Promise<infer P> ? P : never> {
        return await this._remote[method](...args);
    }
}
