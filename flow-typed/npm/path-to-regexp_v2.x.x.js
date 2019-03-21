// flow-typed signature: 34ce6a4306af61160b2da155b6a0da81
// flow-typed version: 8cfbec541d/path-to-regexp_v2.x.x/flow_>=v0.25.x

declare module "path-to-regexp" {
  declare export type Key = {
    name: string | number;
    prefix: string;
    delimiter: string;
    optional: boolean;
    repeat: boolean;
    pattern: string;
    partial: boolean;
  }

  declare export type RegExpOptions = {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
    start?: boolean;
    delimiter?: string;
    endsWith?: string | string[];
  }

  declare export type ParseOptions = {
    delimiter?: string;
    delimiters?: string | string[];
  }

  declare type PathFunctionOptions = {
    encode?: (value: string, token: Key) => string;
  }

  declare export type Token = string | Key;

  declare export type Path = string | RegExp | Array<string | RegExp>;

  declare export type PathFunction = (
    data?: {},
    options?: PathFunctionOptions
  ) => string;

  declare export var parse: (path: string, options?: ParseOptions) => Token[];

  declare export var compile: (path: string, options?: {}) => PathFunction;

  declare export var tokensToFunction: (tokens: Token[]) => PathFunction;

  declare export var tokensToRegExp: (
    tokens: Token[],
    keys?: Key[],
    options?: RegExpOptions
  ) => RegExp;

  declare export default (
    path: Path,
    keys?: Key[],
    options?: RegExpOptions & ParseOptions
  ) => RegExp;
}
