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
        const context = lastContext;
        const args = lastArgs;
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
