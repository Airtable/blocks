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
    key: PropertyKey,
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
