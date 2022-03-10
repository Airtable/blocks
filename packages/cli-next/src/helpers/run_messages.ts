export enum RunCommandMessageName {
    RUN_COMMAND_INSTALLING_LOCAL_SDK = 'runCommandInstallingLocalSdk',
}

export interface RunCommandMessageInfo {
    type: RunCommandMessageName.RUN_COMMAND_INSTALLING_LOCAL_SDK;
    sdkPath: string;
}
