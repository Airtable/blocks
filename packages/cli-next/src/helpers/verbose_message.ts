import chalk from 'chalk';

import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    REMOTE_JSON_BASE_FILE_PATH,
    USER_CONFIG_FILE_NAME,
} from '../settings';

import {
    InitCommandMessageName,
    InitCommandErrorName,
    InitCommandErrorInfo,
    InitCommandMessageInfo,
} from './init_messages';

import {
    RemoteCommandErrorName,
    RemoteCommandErrorInfo,
    RemoteCommandMessageName,
    RemoteCommandMessageInfo,
} from './remote_messages';

import {
    ReleaseCommandErrorInfo,
    ReleaseCommandErrorName,
    ReleaseCommandMessageInfo,
    ReleaseCommandMessageName,
} from './release_messages';

import {
    SubmitCommandErrorInfo,
    SubmitCommandErrorName,
    SubmitCommandMessageInfo,
    SubmitCommandMessageName,
} from './submit_messages';

import * as renderMessage from './render_message';

import {AirtableApiErrorName, AirtableApiErrorInfo} from './airtable_api';
import {AppConfigErrorInfo, AppConfigErrorName} from './config_app';
import {BlockIdentifierErrorInfo, BlockIdentifierErrorName} from './block_identifier';
import {BuildErrorInfo, BuildErrorName} from './build_messages';
import {
    DevelopmentRunFrameMessageInfo,
    DevelopmentRunFrameMessageName,
} from './development_run_frame_routes';
import {FindPortErrorName, FindPortErrorInfo} from './find_port_async';
import {RemoteConfigErrorInfo, RemoteConfigErrorName} from './config_remote';
import {S3ApiErrorName, S3ApiErrorInfo} from './s3_api';
import {SystemApiKeyErrorName, SystemApiKeyErrorInfo} from './system_api_key';
import {SystemConfigErrorInfo, SystemConfigErrorName} from './system_config';
import {SystemExtraErrorInfo, SystemExtraErrorName} from './system_extra';
import {UserConfigErrorInfo, UserConfigErrorName} from './config_user';

export {
    AirtableApiErrorInfo,
    AirtableApiErrorName,
    AppConfigErrorInfo,
    AppConfigErrorName,
    BlockIdentifierErrorInfo,
    BlockIdentifierErrorName,
    BuildErrorName,
    BuildErrorInfo,
    DevelopmentRunFrameMessageInfo,
    DevelopmentRunFrameMessageName,
    FindPortErrorInfo,
    FindPortErrorName,
    InitCommandErrorInfo,
    InitCommandErrorName,
    InitCommandMessageInfo,
    InitCommandMessageName,
    ReleaseCommandErrorInfo,
    ReleaseCommandErrorName,
    ReleaseCommandMessageInfo,
    ReleaseCommandMessageName,
    RemoteCommandErrorInfo,
    RemoteCommandErrorName,
    RemoteCommandMessageInfo,
    RemoteCommandMessageName,
    RemoteConfigErrorInfo,
    RemoteConfigErrorName,
    S3ApiErrorInfo,
    S3ApiErrorName,
    SubmitCommandErrorInfo,
    SubmitCommandErrorName,
    SubmitCommandMessageInfo,
    SubmitCommandMessageName,
    SystemApiKeyErrorInfo,
    SystemApiKeyErrorName,
    SystemConfigErrorInfo,
    SystemConfigErrorName,
    SystemExtraErrorInfo,
    SystemExtraErrorName,
    UserConfigErrorInfo,
    UserConfigErrorName,
};

export const MessageName = {
    ...AirtableApiErrorName,
    ...AppConfigErrorName,
    ...BlockIdentifierErrorName,
    ...BuildErrorName,
    ...DevelopmentRunFrameMessageName,
    ...FindPortErrorName,
    ...InitCommandErrorName,
    ...InitCommandMessageName,
    ...ReleaseCommandErrorName,
    ...ReleaseCommandMessageName,
    ...RemoteCommandErrorName,
    ...RemoteCommandMessageName,
    ...RemoteConfigErrorName,
    ...S3ApiErrorName,
    ...SubmitCommandErrorName,
    ...SubmitCommandMessageName,
    ...SystemApiKeyErrorName,
    ...SystemConfigErrorName,
    ...SystemExtraErrorName,
    ...UserConfigErrorName,
} as const;

/* eslint-disable @typescript-eslint/no-redeclare */
export type MessageName = typeof MessageName[keyof typeof MessageName];
/* eslint-enable @typescript-eslint/no-redeclare */

export type MessageInfo =
    | AirtableApiErrorInfo
    | AppConfigErrorInfo
    | BlockIdentifierErrorInfo
    | BuildErrorInfo
    | DevelopmentRunFrameMessageInfo
    | FindPortErrorInfo
    | InitCommandErrorInfo
    | InitCommandMessageInfo
    | ReleaseCommandErrorInfo
    | ReleaseCommandMessageInfo
    | RemoteCommandErrorInfo
    | RemoteCommandMessageInfo
    | RemoteConfigErrorInfo
    | S3ApiErrorInfo
    | SubmitCommandErrorInfo
    | SubmitCommandMessageInfo
    | SystemApiKeyErrorInfo
    | SystemConfigErrorInfo
    | SystemExtraErrorInfo
    | UserConfigErrorInfo;

export type Messages = renderMessage.Messages<MessageInfo>;

export const VerboseMessage = renderMessage.RenderMessage.extend<MessageInfo, {chalk: chalk.Chalk}>(
    {
        airtableApiBaseNotFound() {
            return this.util
                .chalk`❌ The base could not be found. Make sure you have access to the base in which this block was created.`;
        },
        airtableApiErrorStatusAndMessages({status, errors}) {
            return this.util
                .chalk`Airtable server responded with status ${status}:\n\n${JSON.stringify(
                errors,
            )}`;
        },
        airtableApiKeyMalformed() {
            return this.util
                .chalk`❌ Invalid Airtable API key specified. Make sure you copied it correctly from airtable.com/account.`;
        },
        airtableApiKeyNameInvalid({name}) {
            return this.util.chalk`❌ Invalid Airtable API key name specified: "${name}".`;
        },
        airtableApiMultipleErrors({errors}) {
            return this.util.chalk`Airtable server responded with multiple errors:\n\n${errors
                .map(this.renderMessage, this)
                .join('\n')}`;
        },
        airtableApiUnsupportedBlocksCliVersion(info) {
            return this.util
                .chalk`❌ ${info.serverMessage}\n\nRun {cyan.bold npm i -g @airtable/blocks} to update.\n`;
        },
        airtableApiWithInvalidApiKey() {
            return this.util
                .chalk`❌ Your Airtable API key is invalid. Please use {cyan.bold block set-api-key} to update it.`;
        },
        airtableApiUnexpectedError({serverMessage}) {
            return this.util.chalk`❌ Airtable server returned an error.\n${serverMessage}`;
        },

        // config_app.ts
        appConfigIsNotValid({message, file}) {
            return this.util.chalk`❌ ${file ?? BLOCK_FILE_NAME} ${message}`;
        },

        blockIdentifierInvalidFormat() {
            return this.util.chalk`Block identifier must be in the format <baseId>/<blockId>.`;
        },
        blockIdentifierInvalidBaseId() {
            return this.util.chalk`Block identifier\'s must start with "app".`;
        },
        blockIdentifierInvalidBlockId() {
            return this.util.chalk`Block identifier\'s must start with "blk" after "/".`;
        },

        buildAppConfigModified() {
            return this.util
                .chalk`Detected changes to '${BLOCK_FILE_NAME}' file. Please restart {cyan.bold block run}.`;
        },
        buildNodeModulesAbsent({appRootPath}) {
            return this.util
                .chalk`Please run {cyan.bold npm install} in ${appRootPath} to install packages before running.`;
        },

        // development_run_frame_routes.ts
        developmentRunFrameNewBlockInstallation() {
            return this.util.chalk`Switched to a new block installation.`;
        },
        developmentRunFrameOriginalBlockOnly() {
            return this.util
                .chalk`You can only run your development block in the original base where it was created.`;
        },

        // find_port_async.ts
        findPortAsyncPortIsNotNumber(info) {
            return this.util
                .chalk`❌ Cannot listen to port {underline ${info.port}}. {underline ${info.port}} is not a number.`;
        },

        initCommandReady({blockDirPath, platform}) {
            let blockRunMessage;
            if (platform === 'win32') {
                // In Windows, chaining commands differ between PowerShell and
                // CMD.exe. There is neither a canonical nor simple way to detect if
                // this process is being run in PowerShell or CMD.exe so we present
                // a generic message for Windows.
                blockRunMessage = this.util
                    .chalk`{cyan.bold cd ${blockDirPath}} then {cyan.bold block run}`;
            } else {
                blockRunMessage = this.util.chalk`{cyan.bold cd ${blockDirPath} && block run}`;
            }

            return this.util
                .chalk`✅ Your block is ready! ${blockRunMessage} to start developing, and {cyan.bold npm run lint} to lint.`;
        },
        initCommandDirectoryExists({blockDirPath}) {
            return this.util.chalk`A directory already exists at ${blockDirPath}.`;
        },
        initCommandTemplateMissing({template}) {
            return this.util
                .chalk`Could not get template ${template} - please check you entered the name correctly.`;
        },
        initCommandTemplateNoBlockJson({template}) {
            return this.util.chalk`${template} does not seem to be a block template.`;
        },
        initCommandUnknownError() {
            return this.util.chalk`❌ Something failed! Cleaning up...`;
        },
        initCommandInstalledSdkNoVersion() {
            return this.util.chalk`Installed @airtable/blocks dependency has no version.`;
        },

        // release_messages.ts
        releaseCommandBlock1CommentUnsupported() {
            return this.util
                .chalk`❌ This block cannot be released with a comment. Run {cyan.bold block release} without {cyan.bold --comment}.`;
        },
        releaseCommandBlock2BackendUnsupported() {
            return this.util.chalk`❌ V2 blocks does not support backend routes.`;
        },
        releaseCommandDeveloperCommentPrompt() {
            return this.util.chalk`Enter a comment describing the changes in this release`;
        },

        remoteCommandAddedNew({remoteFile}) {
            return this.util.chalk`✅ Successfully added a new remote at ${remoteFile}!`;
        },
        remoteCommandBetaWarning() {
            return this.util.chalk`{yellowBright Note:} The remotes feature is still in beta.\n`;
        },
        remoteCommandConfigExists({remoteName}) {
            return this.util.chalk`❌ The {bold ${remoteName}} remote already exists!
If you want to update the remote, please run {cyan.bold block remove-remote ${remoteName}} and re-run {cyan.bold block add-remote}!`;
        },
        remoteCommandConfigMissing({remoteName}) {
            return this.util.chalk`❌ The {bold ${remoteName}} remote does not exist.`;
        },
        remoteCommandNoConfigs() {
            return this.util
                .chalk`❌ This project has no remotes. Use {bold block add-remote} to add one.`;
        },
        remoteCommandRemovedExisting({remoteFile}) {
            return this.util.chalk`✅ Successfully removed the remote from ${remoteFile}!`;
        },

        // config_remote.ts
        remoteConfigIsNotValid({message, file}) {
            return this.util.chalk`❌ ${file ??
                `${BLOCK_CONFIG_DIR_NAME}/${REMOTE_JSON_BASE_FILE_PATH}`} ${message}`;
        },

        // s3_api.ts
        s3ApiBundleTooLarge() {
            return this.util.chalk`❌ Could not upload bundle. The bundle's size is too big.`;
        },
        s3ApiFailed() {
            return this.util.chalk`❌ Could not upload bundle. Failed to upload.`;
        },

        // submit_message.ts
        submitCommandPackagedContinuePrompt() {
            return this.util
                .chalk`\nThe project source code has been packaged for review by Airtable.\nAre you ready to submit it for review? (Enter {cyan.bold y} to continue)`;
        },
        submitCommandStopAfterPackaging() {
            return this.util.chalk`Quitting. If you want to submit later run this command again.`;
        },
        submitCommandWindowsMultipleDisks() {
            return this.util.chalk`Dependencies cannot be on multiple disks.`;
        },

        // system_api_key.ts
        systemApiKeyNotFound() {
            return this.util
                .chalk`❌ An airtable api key is not set. Please use {cyan.bold block set-api-key} to set it.`;
        },

        // system_config.ts
        systemConfigInvalidRemoteName() {
            return this.util
                .chalk`❌ Incorrect characters for the name! Only alphanumeric, -, or _ characters are allowed`;
        },
        systemConfigAppDirectoryNotFound() {
            return this.util
                .chalk`❌ Could not find the root of an Airtable project. Please run again from an Airtable project.`;
        },

        // system_extra.ts
        systemExtraDirWithFileNotFound({file}) {
            return this.util.chalk`❌ Could not find directory that includes a ${file} entry.`;
        },

        // config_user.ts
        userConfigIsNotValid({message, file}) {
            return this.util.chalk`❌ ${file ?? `~/.config/${USER_CONFIG_FILE_NAME}`} ${message}`;
        },
    },
);
