// @flow
/**
 * @private
 */
function spawnErrorWithOriginOmittedFromStackTrace(
    errorMessageFormat: string,
    errorMessageArgs: ?$ReadOnlyArray<mixed>,
    errorOriginFn: (...args: Array<any>) => mixed,
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

    Object.defineProperty((err: any), '__safeMessage', {
        configurable: false,
        enumerable: false,
        value: safeMessage,
        writable: false,
    });

    return err;
}

/**
 * @private
 */
export function spawnError(errorMessageFormat: string, ...errorMessageArgs: $ReadOnlyArray<mixed>) {
    return spawnErrorWithOriginOmittedFromStackTrace(
        errorMessageFormat,
        errorMessageArgs,
        spawnError,
    );
}

/**
 * An alternative to facebook's invariant that's safe to use with base data
 * @private
 */
export function invariant(
    condition: mixed,
    errorMessageFormat: string,
    ...errorMessageArgs: Array<mixed>
) {
    if (!condition) {
        throw spawnErrorWithOriginOmittedFromStackTrace(
            errorMessageFormat,
            errorMessageArgs,
            invariant,
        );
    }
}

/**
 * @private
 */
export function spawnUnknownSwitchCaseError(valueDescription: string, providedValue: mixed): Error {
    const providedValueString =
        providedValue !== null && providedValue !== undefined ? providedValue : 'null';
    return spawnErrorWithOriginOmittedFromStackTrace(
        'Unknown value %s for %s',
        [providedValueString, valueDescription],
        spawnUnknownSwitchCaseError,
    );
}

/**
 * @private
 */
export function spawnAbstractMethodError(): Error {
    return spawnErrorWithOriginOmittedFromStackTrace(
        'Abstract method',
        undefined,
        spawnAbstractMethodError,
    );
}
