// @flow

declare module 'use-subscription' {
    declare export function useSubscription<Value>(subscription: {|
        getCurrentValue: () => Value,
        subscribe: (() => mixed) => () => void,
    |}): Value;
}
