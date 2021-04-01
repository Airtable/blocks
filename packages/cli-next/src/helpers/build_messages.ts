export enum BuildErrorName {
    BUILD_NODE_MODULES_ABSENT = 'buildNodeModulesAbsent',
}

export interface NodeModulesAbsentInfo {
    type: BuildErrorName.BUILD_NODE_MODULES_ABSENT;
    appRootPath: string;
}

export type BuildErrorInfo = NodeModulesAbsentInfo;
