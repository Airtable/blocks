// @flow

export type GlobalConfigValue =
    | null
    | boolean
    | number
    | string
    | Array<GlobalConfigValue>
    | {[string]: GlobalConfigValue};

export type GlobalConfigData = {[string]: ?GlobalConfigValue};

export type GlobalConfigUpdate = {|
    path: Array<string>,
    value: GlobalConfigValue | void,
|};
