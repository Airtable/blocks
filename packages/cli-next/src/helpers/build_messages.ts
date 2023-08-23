export enum BuildErrorName {
    BUILD_APP_CONFIG_MODIFIED = 'buildAppConfigModified',
    BUILD_BLOCK_DIRECTORY_NOT_FOUND = 'buildBlockDirectoryNotFound',
}

export interface AppConfigModifiedInfo {
    type: BuildErrorName.BUILD_APP_CONFIG_MODIFIED;
}

export interface BlockDirectoryNotFoundInfo {
    type: BuildErrorName.BUILD_BLOCK_DIRECTORY_NOT_FOUND;
}

export type BuildErrorInfo = AppConfigModifiedInfo | BlockDirectoryNotFoundInfo;
