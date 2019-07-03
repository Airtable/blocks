// @flow

import {useEffect, useState} from 'react';

/**
 * Hook used for safely managing subscriptions in concurrent mode.
 *
 * In order to avoid removing and re-adding subscriptions each time this hook is called,
 * the parameters passed to this hook should be memoized in some way–
 * either by wrapping the entire params object with useMemo()
 * or by wrapping the individual callbacks with useCallback().
 *
 * @private
 */
export default function useSubscription<Value>({
    getCurrentValue,

    subscribe,
}: {|
    getCurrentValue: () => Value,
    subscribe: (callback: () => mixed) => () => void,
|}): Value {
    const [state, setState] = useState(() => ({
        getCurrentValue,
        subscribe,
        value: getCurrentValue(),
    }));

    let valueToReturn = state.value;

    if (state.getCurrentValue !== getCurrentValue || state.subscribe !== subscribe) {
        valueToReturn = getCurrentValue();

        setState({
            getCurrentValue,
            subscribe,
            value: valueToReturn,
        });
    }

    useEffect(() => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
            if (didUnsubscribe) {
                return;
            }

            setState(prevState => {
                if (
                    prevState.getCurrentValue !== getCurrentValue ||
                    prevState.subscribe !== subscribe
                ) {
                    return prevState;
                }

                const value = getCurrentValue();
                if (prevState.value === value) {
                    return prevState;
                }

                return {...prevState, value};
            });
        };
        const unsubscribe = subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
            didUnsubscribe = true;
            unsubscribe();
        };
    }, [getCurrentValue, subscribe]);

    return valueToReturn;
}
