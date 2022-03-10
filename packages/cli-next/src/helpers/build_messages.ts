export enum BuildErrorName {
    BUILD_APP_CONFIG_MODIFIED = 'buildAppConfigModified',
    BUILD_NODE_MODULES_ABSENT = 'buildNodeModulesAbsent',
    BUILD_BLOCK_DIRECTORY_NOT_FOUND = 'buildBlockDirectoryNotFound',
}

export interface AppConfigModifiedInfo {
    type: BuildErrorName.BUILD_APP_CONFIG_MODIFIED;
}

export interface BlockDirectoryNotFoundInfo {
    type: BuildErrorName.BUILD_BLOCK_DIRECTORY_NOT_FOUND;
}

export interface NodeModulesAbsentInfo {
    type: BuildErrorName.BUILD_NODE_MODULES_ABSENT;
    appRootPath: string;
}

export type BuildErrorInfo =
    | AppConfigModifiedInfo
    | BlockDirectoryNotFoundInfo
    | NodeModulesAbsentInfo;
