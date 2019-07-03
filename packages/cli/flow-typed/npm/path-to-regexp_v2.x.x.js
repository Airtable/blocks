// flow-typed signature: 8efce3fb6b6a08c019aaf24a67c8f474
// flow-typed version: 256ef26117/path-to-regexp_v2.x.x/flow_>=v0.25.x

declare module 'path-to-regexp' {
    declare export type Key = {
        name: string | number,
        prefix: string,
        delimiter: string,
        optional: boolean,
        repeat: boolean,
        pattern: string,
        partial: boolean,
    };

    declare export type RegExpOptions = {
        sensitive?: boolean,
        strict?: boolean,
        end?: boolean,
        start?: boolean,
        delimiter?: string,
        endsWith?: string | string[],
    };

    declare export type ParseOptions = {
        delimiter?: string,
        delimiters?: string | string[],
    };

    declare export type PathFunctionOptions = {
        encode?: (value: string, token: Key) => string,
    };

    declare export type Token = string | Key;

    declare export type Path = string | RegExp | Array<string | RegExp>;

    declare export type PathFunction = (data?: {}, options?: PathFunctionOptions) => string;

    declare module.exports: {
        (path: Path, keys?: Key[], options?: RegExpOptions & ParseOptions): RegExp,
        parse: (path: string, options?: ParseOptions) => Token[],
        compile: (path: string, options?: {}) => PathFunction,
        tokensToFunction: (tokens: Token[]) => PathFunction,
        tokensToRegExp: (tokens: Token[], keys?: Key[], options?: RegExpOptions) => RegExp,
    };
}
