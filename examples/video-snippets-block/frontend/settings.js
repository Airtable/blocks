import {useBase, useGlobalConfig} from '@airtable/blocks/base/ui';
import {FieldType} from '@airtable/blocks/base/models';

export const ConfigKeys = Object.freeze({
    TABLE_ID: 'tableId',
    ATTACHMENT_FIELD_ID: 'attachmentFieldId',
    START_TIME_FIELD_ID: 'startTimeFieldId',
    END_TIME_FIELD_ID: 'endTimeFieldId',
    CAPTION_FIELD_ID: 'captionFieldId',
});

/**
 * Reads values from GlobalConfig and converts them to Airtable objects.
 * @param {GlobalConfig} globalConfig
 * @param {Base} base - The base being used by the extension in order to convert id's to objects
 * @returns {{
 *     table: Table | null,
 *     attachmentField: Field | null,
 *     startTimeField: Field | null,
 *     endTimeField: Field | null,
 *     captionField: Field | null,
 * }}
 */
function getSettings(globalConfig, base) {
    const table = base.getTableByIdIfExists(globalConfig.get(ConfigKeys.TABLE_ID));
    const attachmentField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.ATTACHMENT_FIELD_ID))
        : null;
    const startTimeField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.START_TIME_FIELD_ID))
        : null;
    const endTimeField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.END_TIME_FIELD_ID))
        : null;
    const captionField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.CAPTION_FIELD_ID))
        : null;
    return {
        table,
        attachmentField,
        startTimeField,
        endTimeField,
        captionField,
    };
}

function isValidAttachmentField(field) {
    switch (field.type) {
        case FieldType.MULTIPLE_ATTACHMENTS:
            return true;
        case FieldType.MULTIPLE_LOOKUP_VALUES:
            if (!field.options.isValid) {
                return false;
            }
            if (field.options.result.type !== FieldType.MULTIPLE_ATTACHMENTS) {
                return false;
            }
            return true;
        default:
            return false;
    }
}

/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: *, isValid: boolean}|{settings: *, isValid: boolean, message: string}}
 */
function getSettingsValidationResult(settings) {
    const {table, attachmentField} = settings;
    if (!table) {
        return {
            isValid: false,
            message: 'Pick a table',
            settings: settings,
        };
    }
    if (!attachmentField || !isValidAttachmentField(attachmentField)) {
        return {
            isValid: false,
            message: 'Pick an attachment field',
            settings: settings,
        };
    }
    return {
        isValid: true,
        settings: settings,
    };
}

/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{settings: *, isValid: boolean, message: string}|{settings: *, isValid: boolean}}
 */
export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = getSettings(globalConfig, base);
    return getSettingsValidationResult(settings);
}
