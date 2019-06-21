// @flow
import {useMemo, useRef} from 'react';
import {compact} from '../private_utils';
import type Watchable from '../watchable';
import useSubscription from './use_subscription';

const noopSubscription = {
    getCurrentValue: () => null,
    subscribe: () => () => {},
};

/**
 * A React hook for watching data in Airtable models like {@link Table} and {@link Record}. Each
 * model has several watchable keys that can be used with this hook to have your component
 * automatically re-render when data in the models changes. You can also provide an optional
 * callback if you need to do anything other than re-render when the data changes.
 *
 * This is a low-level tool that you should only use when you specifically need it. There are more
 * convenient model-specific hooks available:
 *
 * - For {@link Base}, {@link Table}, {@link View} & {@link Field}, use {@link useBase}
 * - For {@link QueryResult} & {@link Record}, use {@link useRecords}, {@link useRecordIds}, or
 *   {@link useRecordById}
 * - For {@link Viewport}, use {@link useViewport}.
 *
 * If you're writing a class component and still want to be able to use hooks, try {@link withHooks}.
 *
 * @param {?Watchable} model the model to watch
 * @param {Array<?string>} keys which keys we want to watch
 * @param [callback] an optional callback to call when any of the watch keys change
 *
 * @example
 * import {useWatchable} from '@airtable/blocks/ui';
 *
 * function TableName({table}) {
 *     useWatchable(table, ['name']);
 *     return <span>The table name is {table.name}</span>;
 * }
 *
 * @example
 * import {useWatchable} from '@airtable/blocks/ui';
 *
 * function ActiveView({cursor}) {
 *     useWatchable(cursor, ['activeViewId'], () => {
 *          alert('active view changed!!!')
 *     });
 *
 *     return <span>Active view id: {cursor.activeViewId}</span>;
 * }
 */
export default function useWatchable<Keys: string>(
    model: ?Watchable<Keys>,
    keys: $ReadOnlyArray<?Keys>,
    callback?: () => mixed,
) {
    const compactKeys = compact(keys);

    // use a ref to the callback so consumers don't have to provide their own memoization to avoid
    // unwatching and rewatching every render
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    // we use a subscription to model.__getWatchableKey() to track changes. This is because
    // __getWatchableKey will return a value that is:
    //   1. identical by === if nothing watchable in the model has changed. That means we won't
    //      trigger unnecessary re-renders if nothing has changed. Without this, every initial
    //      mount will be double-rendered as useSubscription will think the model changed in the
    //      async gap
    //   2. will be !== if anything watchable in the model has changed. Without this, we might not
    //      re-render when information that we care about has changed.
    //   3. is unique to that model. This means that if we change models, we're guaranteed to get
    //      re-rendered.
    const watchSubscription = useMemo(() => {
        // flow treats arguments as `let` bindings, so we need to make this `const` to not have to
        // worry about null values
        const constModel = model;
        if (!constModel) {
            return noopSubscription;
        }

        return {
            getCurrentValue: () => constModel.__getWatchableKey(),
            subscribe: notifyChange => {
                const onChange = (...args) => {
                    notifyChange();
                    if (callbackRef.current) {
                        callbackRef.current(...args);
                    }
                };

                constModel.watch(compactKeys, onChange);
                return () => {
                    constModel.unwatch(compactKeys, onChange);
                };
            },
        };
        // we spread keysArray below rather than using it as a direct dependency as we're likely to
        // get different array instances containing the same keys across renders, and don't want to
        // have to unwatch and watch after each render. that means that the lint rule can't track
        // that we're using compactKeys though.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model, ...compactKeys]);

    // we don't care about the return value - we just want useSubscription to correctly handle
    // re-rendering the component for us
    useSubscription(watchSubscription);
}
