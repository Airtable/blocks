declare module 'use-subscription' {
    export function useSubscription<Value>(subscription: {
        getCurrentValue: () => Value;
        subscribe: (callback: () => void) => () => void;
    }): Value;
}
