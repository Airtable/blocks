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
