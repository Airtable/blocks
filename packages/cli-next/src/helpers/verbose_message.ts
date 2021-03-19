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

import * as renderMessage from './render_message';

import {AirtableApiErrorName, AirtableApiErrorInfo} from './airtable_api';
import {AppConfigErrorInfo, AppConfigErrorName} from './config_app';
import {BlockIdentifierErrorInfo, BlockIdentifierErrorName} from './block_identifier';
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
    FindPortErrorInfo,
    FindPortErrorName,
    InitCommandErrorInfo,
    InitCommandErrorName,
    InitCommandMessageInfo,
    InitCommandMessageName,
    RemoteCommandErrorInfo,
    RemoteCommandErrorName,
    RemoteCommandMessageInfo,
    RemoteCommandMessageName,
    RemoteConfigErrorInfo,
    RemoteConfigErrorName,
    S3ApiErrorInfo,
    S3ApiErrorName,
    SystemApiKeyErrorInfo,
    SystemApiKeyErrorName,
    SystemConfigErrorInfo,
    SystemConfigErrorName,
    SystemExtraErrorInfo,
    SystemExtraErrorName,
    UserConfigErrorInfo,
    UserConfigErrorName,
};

// Merge the message name enums into one. MessageName is a value and a type like
// standard enums.
export const MessageName = {
    ...AirtableApiErrorName,
    ...AppConfigErrorName,
    ...BlockIdentifierErrorName,
    ...FindPortErrorName,
    ...InitCommandErrorName,
    ...InitCommandMessageName,
    ...RemoteCommandErrorName,
    ...RemoteCommandMessageName,
    ...RemoteConfigErrorName,
    ...S3ApiErrorName,
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
    | FindPortErrorInfo
    | InitCommandErrorInfo
    | InitCommandMessageInfo
    | RemoteCommandErrorInfo
    | RemoteCommandMessageInfo
    | RemoteConfigErrorInfo
    | S3ApiErrorInfo
    | SystemApiKeyErrorInfo
    | SystemConfigErrorInfo
    | SystemExtraErrorInfo
    | UserConfigErrorInfo;

export type Messages = renderMessage.Messages<MessageInfo>;

export const VerboseMessage = renderMessage.RenderMessage.extend<MessageInfo, {chalk: chalk.Chalk}>(
    {
        // airtable_api.ts
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

        // remote_messages.ts
        remoteCommandAddedNew({remoteFile}) {
            return this.util.chalk`✅ Successfully added a new remote at ${remoteFile}!`;
        },
        remoteCommandConfigExists({remoteName}) {
            return this.util.chalk`❌ The {bold ${remoteName}} remote already exists!
If you want to update the remote, please run {cyan.bold block remove-remote ${remoteName}} and re-run {cyan.bold block add-remote}!`;
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
