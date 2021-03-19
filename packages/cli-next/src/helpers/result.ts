/**
 * Used to describe the outcome of operations where failure is not an
 * exceptional circumstance and hence does not warrant the use of
 * language-level exception handling.
 */
export type Result<T, E extends {} = Error> =
    | {
          readonly value: T;
          readonly err?: never;
      }
    | {
          readonly err: E;
          readonly value?: never;
      };

/**
 * Return the result's value or throw its error.
 *
 * @param result A result to unwrap
 * @returns The result's value
 */
export function unwrapResult<T, E extends {} = Error>(result: Result<T, E>): T {
    if (result.err) {
        throw result.err;
    }
    return result.value as T;
}

/**
 * Wrap a function that returns the result value instead of the original
 * function's result and throws the error if the function did not succeed.
 *
 * @param fn function that returns a result
 * @returns the result's value, otherwise throws the result's error
 */
export function unwrapResultFunctor<Args extends any[], T>(
    fn: (...args: Args) => Result<T>,
): (...args: Args) => T {
    return function(...args: Args) {
        return unwrapResult(fn(...args));
    };
}
