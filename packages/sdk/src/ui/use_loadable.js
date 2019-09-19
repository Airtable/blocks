// @flow
import {useMemo, useEffect} from 'react';
import {useSubscription} from 'use-subscription';
import {compact} from '../private_utils';
import {spawnError} from '../error_utils';
import useArrayIdentity from './use_array_identity';

interface LoadableModel {
    +isDataLoaded: boolean;
    loadDataAsync(): Promise<void>;
    unloadData(): void;
    watch('isDataLoaded', () => mixed): $ReadOnlyArray<string>;
    unwatch('isDataLoaded', () => mixed): $ReadOnlyArray<string>;
}

const SUSPENSE_CLEAN_UP_MS = 60000;

/**
 * When you're writing a block, not all of the data in your base is available to work with straight
 * away. We need to load it from Airtable first. This hook is a low-level tool for managing that.
 * You might not need to use it directly though - if you're working with a {@link RecordQueryResult}, try
 * {@link useRecords}, {@link useRecordIds}, or {@link useRecordById} first.
 *
 * When you need to use a loadable model, `useLoadable(theModel)` will make sure that the model is
 * loaded when your component mounts, and unloaded when your component unmounts. By default, you
 * don't need to worry about waiting for the data to load - the hook uses React Suspense to make
 * sure the rest of your component doesn't run until the data is loaded. Whilst the data is
 * loading, the entire block will show a loading indicator. If you want to change where that
 * indicator shows or how it looks, use {@link https://reactjs.org/docs/react-api.html#reactsuspense <React.Suspense />}
 * around the component that uses the hook.
 *
 * You can pass several models to `useLoadable` in an array - it will load all of them simultaneously.
 * We'll memoize this array using shallow equality, so there's no need to use `useMemo`.
 *
 * If you need more control, you can pass `{shouldSuspend: false}` as a second argument to
 * the hook. In that case though, `useLoadable` will cause your component to re-render whenever the
 * load-state of any model you passed in changes, and you should check each model's `.isDataLoaded`
 *  property before trying to use the data you loaded.
 *
 * @param {QueryResult | Cursor | Array<QueryResult | Cursor | null> | null} models the models to load.
 * @param {object} [options] Optional options to control how the hook works
 * @param {boolean} [options.shouldSuspend=true] pass {shouldSuspend: false} to disable suspense
 * mode. If suspense is disabled, you need to manually check model.isDataLoaded so you don't use
 * your model before it's ready.
 *
 * @example
 * import {cursor} from '@airtable/blocks';
 * import {useLoadable, useWatchable} from '@airtable/blocks/ui';
 *
 *  function SelectedRecordIds() {
 *      // load selected records
 *      useLoadable(cursor);
 *
 *      // re-render whenever the list of selected records changes
 *      useWatchable(cursor, ['selectedRecordIds']);
 *
 *      // render the list of selected record ids
 *      return <div>Selected records: {cursor.selectedRecordIds.join(', ')}</div>;
 *  }
 *
 * @example
 *  import {useLoadable} from '@airtable/blocks/ui';
 *
 *  function LoadTwoQueryResults({queryResultA, queryResultB}) {
 *      // load the queryResults:
 *      useLoadable([queryResultA, queryResultB]);
 *
 *      // now, we can use the data
 *      return <SomeFancyComponent />;
 *  }
 *
 * @example
 *  import {useLoadable, useBase} from '@airtable/blocks/ui';
 *
 *  function LoadAllRecords() {
 *      const base = useBase();
 *
 *      // get a query result for every table in the base:
 *      const queryResults = base.tables.map(table => table.selectRecords());
 *
 *      // load them all:
 *      useLoadable(queryResults);
 *
 *      // use the data:
 *      return <SomeFancyComponent queryResults={queryResults} />;
 *  }
 */
export default function useLoadable(
    models: $ReadOnlyArray<LoadableModel | null> | LoadableModel | null,
    {shouldSuspend = true}: {|shouldSuspend?: boolean|} = {},
) {
    const constModels = useArrayIdentity(Array.isArray(models) ? models : [models]);
    const compactModels = useMemo(() => {
        const compacted = compact(constModels);

        for (const model of compacted) {
            if (typeof model.loadDataAsync !== 'function') {
                throw spawnError(
                    'useLoadable called with %s, which is not a loadable',
                    typeof model === 'object' ? model.toString() : typeof model,
                );
            }
        }
        return compacted;
    }, [constModels]);

    const areAllModelsLoaded = compactModels.every(model => model.isDataLoaded);

    if (shouldSuspend && !areAllModelsLoaded) {
        setTimeout(() => {
            for (const model of compactModels) {
                model.unloadData();
            }
        }, SUSPENSE_CLEAN_UP_MS);
        throw Promise.all(
            compactModels.map(model => {
                return model.loadDataAsync();
            }),
        );
    }

    const modelIsLoadedSubscription = useMemo(
        () => ({
            getCurrentValue: () => compactModels.map(model => model.isDataLoaded).join(','),
            subscribe: onChange => {
                for (const model of compactModels) {
                    model.watch('isDataLoaded', onChange);
                }
                return () => {
                    for (const model of compactModels) {
                        model.unwatch('isDataLoaded', onChange);
                    }
                };
            },
        }),
        [compactModels],
    );
    useSubscription(modelIsLoadedSubscription);

    useEffect(() => {
        for (const model of compactModels) {
            model.loadDataAsync();
        }

        return () => {
            for (const model of compactModels) {
                model.unloadData();
            }
        };
    }, [compactModels]);
}
