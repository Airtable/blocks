// @flow
import {useMemo, useRef} from 'react';
import {compact} from '../private_utils';
import type Watchable from '../watchable';
import useSubscription from './use_subscription';

const noopSubscription = {
    getCurrentValue: () => null,
    subscribe: () => () => {},
};

export default function useWatchable<Keys: string>(
    model: Watchable<Keys> | null,
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
