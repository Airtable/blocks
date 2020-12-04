export type Result<T, E extends {} = Error> =
    | {
          readonly value: T;
          readonly err?: never;
      }
    | {
          readonly err: E;
          readonly value?: never;
      };
