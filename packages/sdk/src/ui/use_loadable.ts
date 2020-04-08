/** @module @airtable/blocks/ui: useLoadable */ /** */
import {useMemo, useEffect} from 'react';
import {useSubscription} from 'use-subscription';
import {compact, has} from '../private_utils';
import {spawnError} from '../error_utils';
import useArrayIdentity from './use_array_identity';

// rather than asking for an AbstractModelWithAsyncData, we define a much more specific interface
// that enforces 'isDataLoaded' as a watchable key.
/**
 * A model that can be loaded.
 * Usually a {@link Cursor}, {@link RecordQueryResult}, or a {@link ViewMetadataQueryResult}.
 */
interface LoadableModel {
    /** @hidden */
    readonly isDataLoaded: boolean;
    /** @hidden */
    loadDataAsync(): Promise<void>;
    /** @hidden */
    unloadData(): void;
    /** @hidden */
    watch(keys: 'isDataLoaded', callback: () => unknown): ReadonlyArray<string>;
    /** @hidden */
    unwatch(keys: 'isDataLoaded', callback: () => unknown): ReadonlyArray<string>;
}

const SUSPENSE_CLEAN_UP_MS = 60000;

/**
 * Options object for the {@link useLoadable} hook.
 */
interface UseLoadableOpts {
    /** Whether suspense mode is enabled. If suspense is disabled, you need to manually check `model.isDataLoaded` so you don't use your model before it's ready. */
    shouldSuspend?: boolean;
}

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
 * indicator shows or how it looks, use [`<React.Suspense />`](https://reactjs.org/docs/react-api.html#reactsuspense|)
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
 * @param models The models to load.
 * @param opts Optional options to control how the hook works.
 *
 * @example
 * ```js
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
 * ```
 *
 * @example
 * ```js
 *  import {useLoadable} from '@airtable/blocks/ui';
 *
 *  function LoadTwoQueryResults({queryResultA, queryResultB}) {
 *      // load the queryResults:
 *      useLoadable([queryResultA, queryResultB]);
 *
 *      // now, we can use the data
 *      return <SomeFancyComponent />;
 *  }
 * ```
 *
 * @example
 * ```js
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
 * ```
 * @docsPath UI/hooks/useLoadable
 * @hook
 */
export default function useLoadable(
    models: ReadonlyArray<LoadableModel | null> | LoadableModel | null,
    opts: UseLoadableOpts = {shouldSuspend: true},
) {
    const shouldSuspend = opts && has(opts, 'shouldSuspend') ? opts.shouldSuspend : true;
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

    // .every returns `true` in the case of an empty array
    const areAllModelsLoaded = compactModels.every(model => model.isDataLoaded);

    if (shouldSuspend && !areAllModelsLoaded) {
        const suspensePromise = Promise.all(compactModels.map(model => model.loadDataAsync()))
            .then(() => {
                // if data isn't loaded and we're in suspense mode, we need to start the data loading and
                // throw the load promise. when we throw though, the render tree gets thrown away and none
                // of out hooks will be retained - so we can't attach this QueryResult to a component
                // lifecycle and use that to unload it. Instead, we load it and keep it loaded for a long
                // enough time that it can resolve and then be rendered successfully. After the timeout has
                // passed, we unload it, allowing the data to be released as long as it's not used anywhere
                // else in the block.
                setTimeout(() => {
                    for (const model of compactModels) {
                        model.unloadData();
                    }
                }, SUSPENSE_CLEAN_UP_MS);
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error(error);
                throw error;
            });

        throw suspensePromise;
    }

    // re-render when loaded state changes. technically, we could use `useWatchable` here, but as
    // our LoadableModel isn't a Watchable, we can't. There's no way to preserve flow errors when
    // watching something that doesn't have a 'isDataLoaded' watch key and use `Watchable`.
    const modelIsLoadedSubscription = useMemo(
        () => ({
            getCurrentValue: () => compactModels.map(model => model.isDataLoaded).join(','),
            subscribe: (onChange: () => void) => {
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

    // the main part of this hook comes down to managing the query result data loading in sync with
    // the component lifecycle. That means loading the data when the component mounts, and
    // unloading it when the component unmounts.
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
