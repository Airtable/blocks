export type Messages<Name extends string> = {
    format(messageFormat: string, ...args: any[]): string;
    formatMessage(message: [Name, ...any[]] | any): string;
    formatError(err: Error & {__messageArgs?: any[]}): string;
    supportsMessage(message: unknown): boolean;
    supportsError(err: Error & {__messageArgs?: any[]}): boolean;
} & {
    [key in Name]: (...args: any[]) => string;
};

export function format(message: string, args: ReadonlyArray<unknown> | null | undefined): string {
    let argIndex = 0;
    return message.replace(/%s/g, () => {
        const arg = args ? args[argIndex] : undefined;
        argIndex++;
        return String(arg);
    });
}

const formatToStringMixin = {
    toString: {
        enumerable: false,
        value(this: [string, ...any[]]) {
            return format(this[0], this.slice(1));
        },
    },
};

export function lazyFormat<Name extends string>(
    message: string,
    detailName: Name,
    ...args: any[]
): [string, ...any[]] {
    return Object.defineProperties(
        ['[%s] ' + message, detailName, ...args] as any,
        formatToStringMixin,
    );
}

export class FormatMessage {
    format(messageFormat: string, ...args: any[]): string {
        return format(messageFormat, args);
    }
    formatMessage(message: [string, ...any[]] | any): string {
        if (this.supportsMessage(message)) {
            const [name, ...args] = message as [string, ...any[]];
            return (this as any)[name](...args);
        }
        return JSON.stringify(message);
    }
    formatError(err: Error & {__messageArgs?: any[]}): string {
        if (this.supportsError(err)) {
            return this.formatMessage(err.__messageArgs ?? err.message);
        }
        return err.message;
    }
    supportsMessage(message: unknown): boolean {
        return Array.isArray(message) && message[0] in this;
    }
    supportsError(err: Error & {__messageArgs?: any[]}): boolean {
        if (Array.isArray(err?.__messageArgs)) {
            return this.supportsMessage(err.__messageArgs);
        } else if (Array.isArray(err?.message)) {
            return this.supportsMessage(err.message);
        }
        return false;
    }
}
