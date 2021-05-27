export enum BuildErrorName {
    BUILD_APP_CONFIG_MODIFIED = 'buildAppConfigModified',
    BUILD_NODE_MODULES_ABSENT = 'buildNodeModulesAbsent',
}

export interface AppConfigModifiedInfo {
    type: BuildErrorName.BUILD_APP_CONFIG_MODIFIED;
}

export interface NodeModulesAbsentInfo {
    type: BuildErrorName.BUILD_NODE_MODULES_ABSENT;
    appRootPath: string;
}

export type BuildErrorInfo = AppConfigModifiedInfo | NodeModulesAbsentInfo;
