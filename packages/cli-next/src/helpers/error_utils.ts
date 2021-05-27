
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
 * Spawn an error replacing %s in format string with other arguments.
 *
 * @hidden
 */
export function spawnUnexpectedError(
    errorMessageFormat: string,
    ...errorMessageArgs: ReadonlyArray<unknown>
) {
    return spawnErrorWithOriginOmittedFromStackTrace(
        errorMessageFormat,
        errorMessageArgs,
        spawnUnexpectedError,
    );
}

export interface UserError<T extends {type: string}> extends Error {
    __userInfo: T;
}

/**
 * Spawn an error with an object with error info to render to the user.
 *
 * @hidden
 */
export function spawnUserError<T extends {type: string}>(errorInfo: T): UserError<T> {
    const err = spawnErrorWithOriginOmittedFromStackTrace(
        `UserError: ${errorInfo.type}`,
        null,
        spawnUserError,
    );

    Object.defineProperty(err, '__userInfo', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: errorInfo,
    });

    return (err as unknown) as UserError<T>;
}

/**
 * An alternative to facebook's invariant that's safe to use with base data
 *
 * If the first argument after the format string may be used to look up a way to
 * format the arguments into a more human digestible message that can include
 * links, styling, or emojis. See {@link verbose_message.ts} and
 * {@link airtable_api.ts} for examples.
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
