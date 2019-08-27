// @flow
/**
 * A standard type for operations that are expected to fail sometimes.
 */
export type Result<+T, +E: {} = Error> = {|+value: T|} | {|+err: E|};

const RESULT_OK = Object.freeze({value: undefined});

module.exports = {RESULT_OK};
