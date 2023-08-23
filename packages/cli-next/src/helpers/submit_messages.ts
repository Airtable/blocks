export enum SubmitCommandErrorName {
    SUBMIT_COMMAND_WINDOWS_MULTIPLE_DISKS = 'submitCommandWindowsMultipleDisks',
}

export interface SubmitCommandWindowsMultipleDisksError {
    type: SubmitCommandErrorName.SUBMIT_COMMAND_WINDOWS_MULTIPLE_DISKS;
}

export type SubmitCommandErrorInfo = SubmitCommandWindowsMultipleDisksError;

export enum SubmitCommandMessageName {
    SUBMIT_COMMAND_PACKAGED_CONTINUE_PROMPT = 'submitCommandPackagedContinuePrompt',
    SUBMIT_COMMAND_STOP_AFTER_PACKAGING = 'submitCommandStopAfterPackaging',
}

export interface SubmitCommandPackagedContinuePromptMessage {
    type: SubmitCommandMessageName.SUBMIT_COMMAND_PACKAGED_CONTINUE_PROMPT;
}

export interface SubmitCommandStopAfterPackagingMessage {
    type: SubmitCommandMessageName.SUBMIT_COMMAND_STOP_AFTER_PACKAGING;
}

export type SubmitCommandMessageInfo =
    | SubmitCommandPackagedContinuePromptMessage
    | SubmitCommandStopAfterPackagingMessage;
