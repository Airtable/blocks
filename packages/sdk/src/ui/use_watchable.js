// @flow
import {useMemo, useRef} from 'react';
import {useSubscription} from 'use-subscription';
import {compact} from '../private_utils';
import type Watchable from '../watchable';

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
 * - For {@link RecordQueryResult} & {@link Record}, use {@link useRecords}, {@link useRecordIds}, or
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

    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const watchSubscription = useMemo(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model, ...compactKeys]);

    useSubscription(watchSubscription);
}
