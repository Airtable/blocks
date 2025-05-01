/** @module @airtable/blocks/ui: useWatchable */ /** */
import {useMemo, useRef} from 'react';
import {useSubscription} from 'use-subscription';
import {spawnError} from '../error_utils';
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
 * * For {@link Base}, {@link Table}, {@link View}, or {@link Field}, use {@link useBase}.
 * * For {@link RecordQueryResult} or {@link Record}, use {@link useRecords}, {@link useRecordIds}, or {@link useRecordById}.
 * * For {@link Viewport}, use {@link useViewport}.
 * * For {@link SettingsButton}, use {@link useSettingsButton}.
 *
 * If you're writing a class component and still want to be able to use hooks, try {@link withHooks}.
 *
 * @param models The model or models to watch.
 * @param keys The key or keys to watch. Non-optional, but may be null.
 * @param callback An optional callback to call when any of the watch keys change.
 *
 * @example
 * ```js
 * import {useWatchable} from '@airtable/blocks/[placeholder-path]/ui';
 *
 * function TableName({table}) {
 *     useWatchable(table, 'name');
 *     return <span>The table name is {table.name}</span>;
 * }
 *
 * function RecordValues({record, field}) {
 *     useWatchable(record, ['cellValues']);
 *     return <span>
 *         The record has cell value {record.getCellValue(field)} in {field.name}.
 *     </span>
 * }
 * ```
 * @docsPath UI/hooks/useWatchable
 * @hook
 */
export default function useWatchable<Keys extends string>(
    models: Watchable<Keys> | ReadonlyArray<Watchable<Keys> | null | undefined> | null | undefined,
    keys: Keys | ReadonlyArray<Keys | null> | null,
    callback?: (model: Watchable<Keys>, keys: string, ...args: Array<any>) => unknown,
) {
    if (keys === undefined) {
        throw spawnError(
            'Invalid call to useWatchable: keys cannot be undefined. ' +
                'Pass a key or array of keys corresponding to the model being watched as the second ' +
                'argument.',
        );
    }

    const compactModels: ReadonlyArray<Watchable<Keys>> = useArrayIdentity(
        compact(Array.isArray(models) ? models : [models]),
    );
    const compactKeys: ReadonlyArray<Keys> = useArrayIdentity(
        compact(Array.isArray(keys) ? keys : [keys]),
    );

    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const watchSubscription = useMemo(() => {
        return {
            getCurrentValue: () => compactModels.map(model => model.__getWatchableKey()).join(','),
            subscribe: (notifyChange: () => void) => {
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

    useSubscription(watchSubscription);
}
