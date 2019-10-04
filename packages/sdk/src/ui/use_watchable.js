// @flow
import {useMemo, useRef} from 'react';
import {useSubscription} from 'use-subscription';
import {compact} from '../private_utils';
import type Watchable from '../watchable';
import useArrayIdentity from './use_array_identity';

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
 * @param {?Watchable | ?Array<?Watchable>} models the model or models to watch
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
    models: ?(Watchable<Keys> | $ReadOnlyArray<?Watchable<Keys>>),
    keys: $ReadOnlyArray<?Keys>,
    callback?: () => mixed,
) {
    const compactModels = useArrayIdentity(compact(Array.isArray(models) ? models : [models]));
    const compactKeys = useArrayIdentity(compact(keys));

    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const watchSubscription = useMemo(() => {
        return {
            getCurrentValue: () => compactModels.map(model => model.__getWatchableKey()).join(','),
            subscribe: notifyChange => {
                let isDisabled = false;

                const onChange = (...args) => {
                    if (isDisabled) {
                        return;
                    }

                    notifyChange();
                    if (callbackRef.current) {
                        callbackRef.current(...args);
                    }
                };

                for (const model of compactModels) {
                    model.watch(compactKeys, onChange);
                }

                return () => {
                    isDisabled = true;
                    setTimeout(() => {
                        for (const model of compactModels) {
                            model.unwatch(compactKeys, onChange);
                        }
                    }, 0);
                };
            },
        };
    }, [compactModels, compactKeys]);

    useSubscription(watchSubscription);
}
