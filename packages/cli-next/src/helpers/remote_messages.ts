export enum RemoteCommandErrorName {
    REMOTE_COMMAND_CONFIG_EXISTS = 'remoteCommandConfigExists',
}

export interface RemoteCommandConfigExistsError {
    type: RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_EXISTS;
    remoteName: string;
}

export type RemoteCommandErrorInfo = RemoteCommandConfigExistsError;

export enum RemoteCommandMessageName {
    REMOTE_COMMAND_ADDED_NEW = 'remoteCommandAddedNew',
}

export interface RemoteCommandAddedNewMessage {
    type: RemoteCommandMessageName.REMOTE_COMMAND_ADDED_NEW;
    remoteFile: string;
}

export type RemoteCommandMessageInfo = RemoteCommandAddedNewMessage;
