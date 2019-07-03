// @flow
import {useMemo, useEffect} from 'react';
import {spawnError} from '../error_utils';
import useSubscription from './use_subscription';

interface LoadableModel {
    +isDataLoaded: boolean;
    loadDataAsync(): Promise<void>;
    unloadData(): void;
    watch('isDataLoaded', () => mixed): $ReadOnlyArray<string>;
    unwatch('isDataLoaded', () => mixed): $ReadOnlyArray<string>;
}

const noop = () => {};
const noopSubscription = {
    getCurrentValue: () => null,
    subscribe: () => () => {},
};

const SUSPENSE_CLEAN_UP_MS = 60000;

/**
 * When you're writing a block, not all of the data in your base is available to work with straight
 * away. We need to load it from Airtable first. This hook is a low-level tool for managing that.
 * You might not need to use it directly though - if you're working with a {@link RecordQueryResult}, try
 * {@link useRecords}, {@link useRecordIds}, or {@link useRecordById} first.
 *
 * When you need to use a loadable mode, `useLoadable(theModel)` will make sure that the model is
 * loaded when your component mounts, and unloaded when your component unmounts. By default, you
 * don't need to worry about waiting for the data to load - the hook uses React Suspense to make
 * sure the rest of your component doesn't run until the data is loaded. Whilst the data is
 * loading, the entire block will show a loading indicator. If you want to change where that
 * indicator shows or how it looks, use {@link https://reactjs.org/docs/react-api.html#reactsuspense <React.Suspense />}
 * around the component that uses the hook.
 *
 * If you need more control (for example, if you have two models you want to load at the same time
 * rather than one after the other), you can pass `{shouldSuspend: false}` as a second argument to
 * the hook. In that case though, you should check each model's `.isDataLoaded` property before
 * trying to use the data you loaded.
 *
 * @param {QueryResult | Cursor | null} model the model to load.
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
 *      // we have two query results. load them without suspense so they can be loaded together,
 *      // rather than one after the other
 *      useLoadable(queryResultA, {shouldSuspend: false});
 *      useLoadable(queryResultB, {shouldSuspend: false});
 *
 *      // manually check whether loading is finished or not before continuing
 *      if (!queryResultA.isDataLoaded || !queryResultB.isDataLoaded) {
 *          return <div>Loading...</div>
 *      }
 *
 *      // now, we can use the data
 *      return <SomeFancyComponent />;
 *  }
 */
export default function useLoadable(
    model: LoadableModel | null,
    {shouldSuspend = true}: {|shouldSuspend?: boolean|} = {},
) {
    const modelConst = model;
    if (modelConst !== null && typeof modelConst.loadDataAsync !== 'function') {
        throw spawnError(
            'useLoadable called with %s, which is not a loadable',
            typeof modelConst === 'object' ? modelConst.toString() : typeof modelConst,
        );
    }

    if (shouldSuspend && modelConst && !modelConst.isDataLoaded) {
        setTimeout(() => {
            modelConst.unloadData();
        }, SUSPENSE_CLEAN_UP_MS);
        throw modelConst.loadDataAsync();
    }

    const modelIsLoadedSubscription = useMemo(
        () =>
            modelConst
                ? {
                      getCurrentValue: () => modelConst.isDataLoaded,
                      subscribe: cb => {
                          const onChange = (...args) => {
                              cb();
                          };
                          modelConst.watch('isDataLoaded', onChange);
                          return () => {
                              modelConst.unwatch('isDataLoaded', onChange);
                          };
                      },
                  }
                : noopSubscription,
        [modelConst],
    );
    useSubscription(modelIsLoadedSubscription);

    useEffect(() => {
        if (modelConst) {
            modelConst.loadDataAsync();

            return () => {
                modelConst.unloadData();
            };
        } else {
            return noop;
        }
    }, [modelConst]);
}
