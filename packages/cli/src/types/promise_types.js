// @flow

// NOTE(richsinn): These type definitions are for the `resolve` and `reject` functions
//   from the "executor" parameter of the `Promise` constructor. They are NOT the
//   type definitions for the "static" Promise.resolve and Promise.reject functions.
export type PromiseResolveFunction = <R>(Promise<R> | R) => void;
export type PromiseRejectFunction = (error: any) => void; // eslint-disable-line flowtype/no-weak-types
