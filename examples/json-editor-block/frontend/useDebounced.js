import {useMemo, useRef} from 'react';
import debounce from 'lodash.debounce';

/**
 * Create a "debounced" version of the provided function, `fn`. The new version
 * will delay invoking `fn` until after `changeDelay` milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * This function is memoized and will only be recreated when one of the values
 * in the provided `deps` array changes. This will immediately invalidate any
 * pending invocation of any previously-created function.
 *
 * @param {function} fn - the function to debounce
 * @param {number} changeDelay - the duration in milliseconds to wait before
 *                               invoking the provided function
 * @param {Array} deps - a set of values which should trigger the creation of a
 *                       new debounced function
 */
export default function useDebounced(fn, changeDelay, deps) {
    const count = useRef(0);

    return useMemo(() => {
        const id = (count.current += 1);

        return debounce((...args) => {
            // Every time a debounced function is created, this hook's mutable
            // `count` value is incremented. If the value of the immutable `id`
            // binding differs from the `count` value, the currently-executing
            // function has been superseded by a new version and should
            // therefore return without causing side effects.
            if (id !== count.current) {
                return;
            }

            return fn(...args);
        }, changeDelay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changeDelay, ...deps]);
}
