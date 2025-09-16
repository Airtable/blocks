export enum ReleaseCommandErrorName {
    RELEASE_COMMAND_BLOCK1_COMMENT_UNSUPPORTED = 'releaseCommandBlock1CommentUnsupported',
}

export interface ReleaseCommandBlock1CommentUnsupportedError {
    type: ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK1_COMMENT_UNSUPPORTED;
}

export type ReleaseCommandErrorInfo = ReleaseCommandBlock1CommentUnsupportedError;

export enum ReleaseCommandMessageName {
    RELEASE_COMMAND_DEVELOPER_COMMENT_PROMPT = 'releaseCommandDeveloperCommentPrompt',
}

export interface ReleaseCommandDeveloperCommentPromptMessage {
    type: ReleaseCommandMessageName.RELEASE_COMMAND_DEVELOPER_COMMENT_PROMPT;
}

export type ReleaseCommandMessageInfo = ReleaseCommandDeveloperCommentPromptMessage;
