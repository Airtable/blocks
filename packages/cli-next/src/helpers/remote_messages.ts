export enum RemoteCommandErrorName {
    REMOTE_COMMAND_CONFIG_EXISTS = 'remoteCommandConfigExists',
    REMOTE_COMMAND_CONFIG_MISSING = 'remoteCommandConfigMissing',
    REMOTE_COMMAND_NO_CONFIGS = 'remoteCommandNoConfigs',
}

export interface RemoteCommandConfigExistsError {
    type: RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_EXISTS;
    remoteName: string;
}

export interface RemoteCommandConfigMissingError {
    type: RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_MISSING;
    remoteName: string;
}

export interface RemoteCommandNoConfigsError {
    type: RemoteCommandErrorName.REMOTE_COMMAND_NO_CONFIGS;
}

export type RemoteCommandErrorInfo =
    | RemoteCommandConfigExistsError
    | RemoteCommandConfigMissingError
    | RemoteCommandNoConfigsError;

export enum RemoteCommandMessageName {
    REMOTE_COMMAND_ADDED_NEW = 'remoteCommandAddedNew',
    REMOTE_COMMAND_REMOVED_EXISTING = 'remoteCommandRemovedExisting',
    REMOTE_COMMAND_BETA_WARNING = 'remoteCommandBetaWarning',
}

export interface RemoteCommandAddedNewMessage {
    type: RemoteCommandMessageName.REMOTE_COMMAND_ADDED_NEW;
    remoteFile: string;
}

export interface RemoteCommandRemovedExistingMessage {
    type: RemoteCommandMessageName.REMOTE_COMMAND_REMOVED_EXISTING;
    remoteFile: string;
}

export interface RemoteCommandBetaWarningMessage {
    type: RemoteCommandMessageName.REMOTE_COMMAND_BETA_WARNING;
}

export type RemoteCommandMessageInfo =
    | RemoteCommandAddedNewMessage
    | RemoteCommandRemovedExistingMessage
    | RemoteCommandBetaWarningMessage;
