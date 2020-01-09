/** @module @airtable/blocks/models: globalConfig */ /** */

/** A path of keys indexing into the global config object */
export type GlobalConfigPath = ReadonlyArray<string>;
/** A single top level key or a path into the global config object */
export type GlobalConfigKey = GlobalConfigPath | string;
/** A {@link GlobalConfigPath}, with some parts of the path unknown (`undefined`) */
export type PartialGlobalConfigPath = ReadonlyArray<string | undefined>;
/** A {@link GlobalConfigKey} with some parts of the path/key unknown (`undefined`) */
export type PartialGlobalConfigKey = PartialGlobalConfigPath | string | undefined;
/** An array of {@link GlobalConfigValue}s */
export interface GlobalConfigArray extends ReadonlyArray<GlobalConfigValue> {}
/** An object containing {@GlobalConfigValue}s */
export interface GlobalConfigObject {
    readonly [key: string]: GlobalConfigValue | undefined;
}

/** The types of value that can be stored in globalConfig. */
export type GlobalConfigValue =
    | null
    | boolean
    | number
    | string
    | GlobalConfigArray
    | GlobalConfigObject;

/** @hidden */
export interface GlobalConfigData {
    [key: string]: GlobalConfigValue | undefined;
}

/** An instruction to set `path` within globalConfig to `value`. */
export interface GlobalConfigUpdate {
    /** The path to update. */
    readonly path: GlobalConfigPath;
    /** The value at `path` after updating. */
    readonly value: GlobalConfigValue | undefined;
}

/** A version of {@link GlobalConfigUpdate} where not all values are yet known. */
export interface PartialGlobalConfigUpdate {
    /** The path to update. */
    readonly path?: PartialGlobalConfigPath | undefined;
    /** The value at `path` after updating. */
    readonly value?: GlobalConfigValue | undefined;
}

/** @hidden */
export type GlobalConfigPathValidationResult = {isValid: true} | {isValid: false; reason: string};
