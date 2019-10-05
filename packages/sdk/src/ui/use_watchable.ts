/** @module @airtable/blocks/ui: useWatchable */ /** */
import {useMemo, useRef} from 'react';
import {useSubscription} from 'use-subscription';
import {compact} from '../private_utils';
import Watchable from '../watchable';
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
 * ```js
 * import {useWatchable} from '@airtable/blocks/ui';
 *
 * function TableName({table}) {
 *     useWatchable(table, ['name']);
 *     return <span>The table name is {table.name}</span>;
 * }
 * ```
 *
 * @example
 * ```js
 * import {useWatchable} from '@airtable/blocks/ui';
 *
 * function ActiveView({cursor}) {
 *     useWatchable(cursor, ['activeViewId'], () => {
 *          alert('active view changed!!!')
 *     });
 *
 *     return <span>Active view id: {cursor.activeViewId}</span>;
 * }
 * ```
 */
export default function useWatchable<Keys extends string>(
    models: Watchable<Keys> | ReadonlyArray<Watchable<Keys> | null | undefined> | null | undefined,
    keys: ReadonlyArray<Keys | null | undefined>,
    callback?: (model: Watchable<Keys>, keys: string, ...args: Array<any>) => unknown,
) {
    const compactModels = useArrayIdentity(compact(Array.isArray(models) ? models : [models]));
    const compactKeys = useArrayIdentity(compact(keys));

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
        return {
            getCurrentValue: () => compactModels.map(model => model.__getWatchableKey()).join(','),
            subscribe: (notifyChange: () => void) => {
                // sometimes, watching and unwatching a key has side effects - typically, these
                // only happen when watching or unwatching something for the first or last time, as
                // we use ref-counting to avoid unnecessary side effects. When the keys or models
                // for this subscription change, we teardown the old subscription and create a new
                // one. Often though, underlying model-key pairs will be the same - we'll remove
                // the old subscription, but instantly re-add it. In this case, we don't want to
                // trigger any side effects. To work around this, we defer unwatching the previous
                // models and keys until _after_ we've watched the new ones. That way, the ref-
                // count never reaches 0. We don't want the old watches to actually trigger in that
                // time though - so `isDisabled` prevents that.
                let isDisabled = false;

                const onChange = (model: Watchable<Keys>, key: Keys, ...args: Array<any>) => {
                    if (isDisabled) {
                        return;
                    }

                    notifyChange();
                    if (callbackRef.current) {
                        callbackRef.current(model, key, ...args);
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

    // we don't care about the return value - we just want useSubscription to correctly handle
    // re-rendering the component for us
    useSubscription(watchSubscription);
}
