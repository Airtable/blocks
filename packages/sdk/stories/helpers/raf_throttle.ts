// Ported over from Hyperbase.
// Loosely based on https://github.com/wuct/raf-throttle
// Create a throttled function which invokes the wrapped function at most once per animation frame.
function rafThrottle(
    callback: () => void,
): (() => void) & {
    cancel: () => void;
} {
    let requestId: number | null = null;
    let lastContext: unknown = null;
    let lastArgs: Array<unknown> | null = null;

    const invoke = () => {
        requestId = null;
        // Copy into the function scope and clear the free variables to prevent memory leak
        // caused by retaining the last invocation arguments.
        const context = lastContext;
        const args = lastArgs;
        // NOTE: we set these to null before application because it is possible
        // that `callback` recursively calls the throttled function again.
        lastContext = null;
        lastArgs = null;
        // @ts-ignore #typescript-migration
        callback.apply(context, args);
    };

    const throttled = function(this: unknown, ...args: Array<unknown>) {
        lastArgs = args;
        // eslint-disable-next-line consistent-this
        lastContext = this;
        if (requestId === null) {
            requestId = requestAnimationFrame(invoke);
        }
    };
    throttled.cancel = () => {
        if (requestId !== null) {
            cancelAnimationFrame(requestId);
            requestId = null;
            lastContext = null;
            lastArgs = null;
        }
    };

    return throttled;
}

export default rafThrottle;
