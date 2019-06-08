// @flow
import {useMemo, useEffect} from 'react';
import useSubscription from './use_subscription';

// rather than asking for an AbstractModelWithAsyncData, we define a much more specific interface
// that enforces 'isDataLoaded' as a watchable key.
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
export default function useLoadable(
    model: LoadableModel | null,
    {shouldSuspend = true}: {|shouldSuspend?: boolean|} = {},
) {
    const modelConst = model;
    if (modelConst !== null && typeof modelConst.loadDataAsync !== 'function') {
        throw new Error(
            `useLoadable called with ${
                typeof modelConst === 'object' ? modelConst.toString() : typeof modelConst
            }, which is not a loadable`,
        );
    }

    if (shouldSuspend && modelConst && !modelConst.isDataLoaded) {
        // if data isn't loaded and we're in suspense mode, we need to start the data loading and
        // throw the load promise. when we throw though, the render tree gets thrown away and none
        // of out hooks will be retained - so we can't attach this QueryResult to a component
        // lifecycle and use that to unload it. Instead, we load it and keep it loaded for a long
        // enough time that it can resolve and then be rendered successfully. After the timeout has
        // passed, we unload it, allowing the data to be released as long as it's not used anywhere
        // else in the block.
        setTimeout(() => {
            modelConst.unloadData();
        }, SUSPENSE_CLEAN_UP_MS);
        throw modelConst.loadDataAsync();
    }

    // re-render when loaded state changes. technically, we could use `useWatchable` here, but as
    // our LoadableModel isn't a Watchable, we can't. There's no way to preserve flow errors when
    // watching something that doesn't have a 'isDataLoaded' watch key and use `Watchable`.
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

    // the main part of this hook comes down to managing the query result data loading in sync with
    // the component lifecycle. That means loading the data when the component mounts, and
    // unloading it when the component unmounts.
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
