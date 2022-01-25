// If errorOriginFn is specified, all frames above and including the call to errorOriginFn
// will be omitted from the stack trace.
/**
 * @internal
 */
function spawnErrorWithOriginOmittedFromStackTrace(
    errorMessageFormat: string,
    errorMessageArgs: ReadonlyArray<unknown> | null | undefined,
    errorOriginFn: (...args: Array<any>) => unknown,
): Error {
    const safeMessage = errorMessageFormat;
    let argIndex = 0;
    const formattedMessage = errorMessageFormat.replace(/%s/g, () => {
        const arg = errorMessageArgs ? errorMessageArgs[argIndex] : undefined;
        argIndex++;
        return String(arg);
    });

    const err = new Error(formattedMessage);

    // captureStackTrace is only available on v8. It captures the current stack trace
    // and sets the .stack property of the first argument. It will omit all frames above
    // and including "errorOriginFn", which is useful for hiding implementation details of our
    // error throwing helpers (e.g. assert and spawn variants).
    if (Error.captureStackTrace && errorOriginFn) {
        Error.captureStackTrace(err, errorOriginFn);
    }

    Object.defineProperty(err as any, '__safeMessage', {
        configurable: false,
        enumerable: false,
        value: safeMessage,
        writable: false,
    });

    return err;
}

/**
 * @hidden
 */
export function spawnError(
    errorMessageFormat: string,
    ...errorMessageArgs: ReadonlyArray<unknown>
) {
    return spawnErrorWithOriginOmittedFromStackTrace(
        errorMessageFormat,
        errorMessageArgs,
        spawnError,
    );
}

// istanbul ignore next
/**
 * Logs an error to Rollbar
 *
 * @hidden
 */
export function logErrorToRollbar(
    errorMessageFormat: string,
    ...errorMessageArgs: ReadonlyArray<unknown>
) {
    // See this comment for how to log via Rollbar: https://github.com/Hyperbase/hyperbase/blob/009dcd1dc4c5204277c2939e7f61dfce74535f30/client/run_block_frame.tsx#L548
    const rollbar = (window as any).Rollbar as undefined | {warn?: (error: Error) => void};
    if (rollbar?.warn) {
        rollbar.warn(spawnError(errorMessageFormat, ...errorMessageArgs));
    }
}

/**
 * An alternative to facebook's invariant that's safe to use with base data
 *
 * @hidden
 */
export function invariant(
    condition: unknown,
    errorMessageFormat: string,
    ...errorMessageArgs: Array<unknown>
): asserts condition {
    if (!condition) {
        throw spawnErrorWithOriginOmittedFromStackTrace(
            errorMessageFormat,
            errorMessageArgs,
            invariant,
        );
    }
}

/**
 * @internal
 */
export function spawnUnknownSwitchCaseError(
    valueDescription: string,
    providedValue: never,
    key: string,
): Error {
    const providedValueKey = providedValue[key];
    const providedValueKeyString =
        providedValueKey !== null && providedValueKey !== undefined ? providedValueKey : 'null';
    return spawnErrorWithOriginOmittedFromStackTrace(
        'Unknown value %s for %s',
        [providedValueKeyString, valueDescription],
        spawnUnknownSwitchCaseError as any,
    );
}

/**
 * @internal
 */
export function spawnAbstractMethodError(): Error {
    return spawnErrorWithOriginOmittedFromStackTrace(
        'Abstract method',
        undefined,
        spawnAbstractMethodError,
    );
}
