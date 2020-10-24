import {ReactWrapper} from 'enzyme';
import ObjectPool from '../src/models/object_pool';
import Watchable from '../src/watchable';

/**
 * include a section of code that must pass flow but shouldn't actually be executed. Use it along
 * with '// flow-expect-error' to write tests for flow-type definitions that won't be run by jest.
 */
export function flowTest(description: string, fn: () => unknown): void {
}

export function getComputedStylePropValue<Props extends {}>(
    wrapper: ReactWrapper<Props>,
    styleProp: string,
): string {
    const domNode = wrapper.getDOMNode();
    return getComputedStyle(domNode).getPropertyValue(styleProp);
}

/**
 * Ensure that all instances of the ObjectPool class use the authentic
 * implementation.
 */
export const enableObjectPool = () => {
    const proto = ObjectPool.prototype;
    const names = Object.getOwnPropertyNames(proto) as (keyof ObjectPool<any, any>)[];
    for (const name of names) {
        if (jest.isMockFunction(proto[name])) {
            (proto[name] as jest.Mock).mockRestore();
        }
    }
};

/**
 * Replace the implementation of all instances of the ObjectPool class such
 * that they no longer provide caching of any sort.
 */
export const disableObjectPool = () => {
    enableObjectPool();
    const proto = ObjectPool.prototype;
    const names = Object.getOwnPropertyNames(proto) as (keyof ObjectPool<any, any>)[];

    for (const name of names) {
        if (typeof proto[name] === 'function') {
            jest.spyOn(proto, name as any).mockImplementation(() => {});
        }
    }
};

export function waitForWatchKeyAsync<Key extends string>(
    model: Watchable<Key>,
    key: Key,
): Promise<void> {
    return new Promise(resolve => {
        const handler = () => {
            model.unwatch(key, handler);
            resolve();
        };
        model.watch(key, handler);
    });
}
