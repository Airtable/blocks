export enum InitCommandMessageName {
    INIT_COMMAND_READY = 'initCommandReady',
}

export enum InitCommandErrorName {
    INIT_COMMAND_DIRECTORY_EXISTS = 'initCommandDirectoryExists',
    INIT_COMMAND_TEMPLATE_MISSING = 'initCommandTemplateMissing',
    INIT_COMMAND_TEMPLATE_NO_BLOCK_JSON = 'initCommandTemplateNoBlockJson',
    INIT_COMMAND_UNKNOWN_ERROR = 'initCommandUnknownError',
    INIT_COMMAND_INSTALLED_SDK_NO_VERSION = 'initCommandInstalledSdkNoVersion',
}

export interface InitCommandReadyInfo {
    type: InitCommandMessageName.INIT_COMMAND_READY;
    blockDirPath: string;
    platform: string;
}

export type InitCommandMessageInfo = InitCommandReadyInfo;

export interface InitCommandDirectoryExistsInfo {
    type: InitCommandErrorName.INIT_COMMAND_DIRECTORY_EXISTS;
    blockDirPath: string;
}

export interface InitCommandTemplateMissingInfo {
    type: InitCommandErrorName.INIT_COMMAND_TEMPLATE_MISSING;
    template: string;
}

export interface InitCommandTemplateNoBlockJsonInfo {
    type: InitCommandErrorName.INIT_COMMAND_TEMPLATE_NO_BLOCK_JSON;
    template: string;
}

export interface InitCommandUnknownErrorInfo {
    type: InitCommandErrorName.INIT_COMMAND_UNKNOWN_ERROR;
}

export interface InitCommandInstalledSdkVersionInfo {
    type: InitCommandErrorName.INIT_COMMAND_INSTALLED_SDK_NO_VERSION;
}

export type InitCommandErrorInfo =
    | InitCommandDirectoryExistsInfo
    | InitCommandTemplateMissingInfo
    | InitCommandTemplateNoBlockJsonInfo
    | InitCommandUnknownErrorInfo
    | InitCommandInstalledSdkVersionInfo;
