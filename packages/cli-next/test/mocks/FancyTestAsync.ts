import {FancyTypes} from '@oclif/test';

export type Plugin<T> = FancyTypes.Plugin<T>;

export interface AsyncPlugin<T> {
    init?(ctx: T): any;
    initAsync?(ctx: T): Promise<any>;
    run?(ctx: T): any;
    runAsync?(ctx: T): Promise<any>;
    catch?(ctx: T): any;
    catchAsync?(ctx: T): Promise<any>;
    finally?(ctx: T): any;
    finallyAsync?(ctx: T): Promise<any>;
}

/**
 * Map `*Async` suffixed FancyTest Plugin methods to non suffixed methods
 * FancyTest supports.
 *
 * @param plugin FancyTest Plugin with promise returning methods suffixed by
 * `*Async`
 * @returns plugin mapped to remove Async suffix to work with FancyTest
 */
export function mapFancyTestAsyncPlugin<T>(plugin: AsyncPlugin<T>): Plugin<T> {
    const wrapped: Plugin<T> = {};
    if (plugin.initAsync) {
        const initAsync = plugin.initAsync.bind(plugin);
        wrapped.init = (ctx) => initAsync(ctx);
    } else if (plugin.init) {
        wrapped.init = plugin.init.bind(plugin);
    }
    if (plugin.runAsync) {
        const runAsync = plugin.runAsync.bind(plugin);
        wrapped.run = (ctx) => runAsync(ctx);
    } else if (plugin.run) {
        wrapped.run = plugin.run.bind(plugin);
    }
    if (plugin.catchAsync) {
        const catchAsync = plugin.catchAsync.bind(plugin);
        wrapped.catch = (ctx) => catchAsync(ctx);
    } else if (plugin.catch) {
        wrapped.catch = plugin.catch.bind(plugin);
    }
    if (plugin.finallyAsync) {
        const finallyAsync = plugin.finallyAsync.bind(plugin);
        wrapped.finally = (ctx) => finallyAsync(ctx);
    } else if (plugin.finally) {
        wrapped.finally = plugin.finally.bind(plugin);
    }
    return wrapped;
}
