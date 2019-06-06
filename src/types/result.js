// @flow
/**
 * A standard type for operations that are expected to fail sometimes.
 */
export type Result<+T, +E: {} = Error> = (
    {|+value: T|} |
    {|+err: E|}
);
