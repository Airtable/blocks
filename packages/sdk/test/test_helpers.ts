import Watchable from '../src/shared/watchable';

/**
 * include a section of code that must pass flow but shouldn't actually be executed. Use it along
 * with '// flow-expect-error' to write tests for flow-type definitions that won't be run by jest.
 */
export function flowTest(description: string, fn: () => unknown): void {
}

export function createPromiseWithResolveAndReject<T>(): {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error: any) => void;
} {
    let resolve: (value: T) => void;
    let reject: (error: any) => void;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {promise, resolve: resolve!, reject: reject!};
}

export function getComputedStylePropValue(element: Element, styleProp: string): string {
    return getComputedStyle(element).getPropertyValue(styleProp);
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

export function simulateTimersAndClearAfterEachTest(): void {
    let automaticAdvancement: ReturnType<typeof setInterval>;

    beforeAll(() => {
        automaticAdvancement = setInterval(() => {
            jest.advanceTimersByTime(20);
        }, 20);

        jest.useFakeTimers();
    });

    afterAll(() => {
        clearInterval(automaticAdvancement);
    });

    afterEach(() => {
        jest.clearAllTimers();
    });
}
