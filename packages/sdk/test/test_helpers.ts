import {ReactWrapper} from 'enzyme';
import Watchable from '../src/watchable';

/**
 * include a section of code that must pass flow but shouldn't actually be executed. Use it along
 * with '// flow-expect-error' to write tests for flow-type definitions that won't be run by jest.
 */
export function flowTest(description: string, fn: () => unknown): void {
    // no-op
}

export function getComputedStylePropValue<Props extends {}>(
    wrapper: ReactWrapper<Props>,
    styleProp: string,
): string {
    const domNode = wrapper.getDOMNode();
    return getComputedStyle(domNode).getPropertyValue(styleProp);
}

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
