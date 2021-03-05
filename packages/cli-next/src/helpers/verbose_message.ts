import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    REMOTE_JSON_BASE_FILE_PATH,
    USER_CONFIG_FILE_NAME,
} from '../settings';

import * as renderMessage from './render_message';

import {AirtableApiErrorName, AirtableApiErrorInfo} from './airtable_api';
import {FindPortErrorName, FindPortErrorInfo} from './find_port_async';
import {S3ApiErrorName, S3ApiErrorInfo} from './s3_api';
import {SystemApiKeyErrorName, SystemApiKeyErrorInfo} from './system_api_key';
import {AppConfigErrorInfo, AppConfigErrorName} from './config_app';
import {UserConfigErrorInfo, UserConfigErrorName} from './config_user';
import {RemoteConfigErrorInfo, RemoteConfigErrorName} from './config_remote';

export {
    AirtableApiErrorInfo,
    AirtableApiErrorName,
    FindPortErrorInfo,
    FindPortErrorName,
    S3ApiErrorInfo,
    S3ApiErrorName,
};

// Merge the message name enums into one. MessageName is a value and a type like
// standard enums.
export const MessageName = {
    ...AirtableApiErrorName,
    ...AppConfigErrorName,
    ...FindPortErrorName,
    ...RemoteConfigErrorName,
    ...S3ApiErrorName,
    ...SystemApiKeyErrorName,
    ...UserConfigErrorName,
} as const;
/* eslint-disable no-redeclare */
export type MessageName = typeof MessageName[keyof typeof MessageName];
/* eslint-enable no-redeclare */

export type MessageInfo =
    | AirtableApiErrorInfo
    | AppConfigErrorInfo
    | FindPortErrorInfo
    | RemoteConfigErrorInfo
    | S3ApiErrorInfo
    | SystemApiKeyErrorInfo
    | UserConfigErrorInfo;

export type Messages = renderMessage.Messages<MessageInfo>;

export const VerboseMessage = renderMessage.RenderMessage.extend<MessageInfo>({
    // airtable_api.ts
    airtableApiBaseNotFound() {
        return '❌ The base could not be found. Make sure you have access to the base in which this block was created.';
    },
    airtableApiErrorStatusAndMessages({status, errors}) {
        return `Airtable server responded with status ${status}:\n\n${JSON.stringify(errors)}`;
    },
    airtableApiMultipleErrors({errors}) {
        return `Airtable server responded with multiple errors:\n\n${errors
            .map(this.renderMessage, this)
            .join('\n')}`;
    },
    airtableApiUnsupportedBlocksCliVersion(info) {
        return `❌ ${info.serverMessage}\n\nRun {cyan.bold npm i -g @airtable/blocks} to update.\n`;
    },
    airtableApiWithInvalidApiKey() {
        return '❌ Your Airtable API key is invalid. Please use {cyan.bold block set-api-key} to update it.';
    },
    airtableApiUnexpectedError({serverMessage}) {
        return `❌ Airtable server returned an error.\n${serverMessage}`;
    },

    // config_app.ts
    appConfigIsNotValid({message, file}) {
        return `❌ ${file ?? BLOCK_FILE_NAME} ${message}`;
    },

    // find_port_async.ts
    findPortAsyncPortIsNotNumber(info) {
        return `❌ Cannot listen to port {underline ${info.port}}. {underline ${info.port}} is not a number.`;
    },

    // config_remote.ts
    remoteConfigIsNotValid({message, file}) {
        return `❌ ${file ?? `${BLOCK_CONFIG_DIR_NAME}/${REMOTE_JSON_BASE_FILE_PATH}`} ${message}`;
    },

    // s3_api.ts
    s3ApiBundleTooLarge() {
        return `❌ Could not upload bundle. The bundle's size is too big.`;
    },
    s3ApiFailed() {
        return '❌ Could not upload bundle. Failed to upload.';
    },

    // system_api_key.ts
    systemApiKeyNotFound() {
        return '❌ An airtable api key is not set. Please use {cyan.bold block set-api-key} to set it.';
    },

    // config_user.ts
    userConfigIsNotValid({message, file}) {
        return `❌ ${file ?? USER_CONFIG_FILE_NAME} ${message}`;
    },
});
