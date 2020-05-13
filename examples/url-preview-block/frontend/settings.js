import {useBase, useGlobalConfig} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';

export const ConfigKeys = {
    IS_ENFORCED: 'isEnforced',
    URL_TABLE_ID: 'urlTableId',
    URL_FIELD_ID: 'urlFieldId',
};

export const allowedUrlFieldTypes = [
    FieldType.FORMULA,
    FieldType.SINGLE_LINE_TEXT,
    FieldType.MULTILINE_TEXT,
    FieldType.URL,
];

/**
 * Return settings from GlobalConfig with defaults, and converts them to Airtable objects.
 * @param {object} globalConfig
 * @param {Base} base - The base being used by the block in order to convert id's to objects
 * @returns {{
 *     isEnforced: true | false,
 *     urlTable: Table | null,
 *     urlField: Field | null,
 * }}
 */
function getSettings(globalConfig, base) {
    const isEnforced = Boolean(globalConfig.get(ConfigKeys.IS_ENFORCED));
    const urlFieldId = globalConfig.get(ConfigKeys.URL_FIELD_ID);
    const urlTableId = globalConfig.get(ConfigKeys.URL_TABLE_ID);

    const urlTable = base.getTableByIdIfExists(urlTableId);
    const urlField = urlTable ? urlTable.getFieldByIdIfExists(urlFieldId) : null;
    return {
        isEnforced,
        urlField,
        urlTable,
    };
}

/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: *, isValid: boolean}|{settings: *, isValid: boolean, message: string}}
 */
function getSettingsValidationResult(settings) {
    const {isEnforced, urlTable, urlField} = settings;
    let isValid = true;
    let message = null;
    // If the enforcement switch is set to "Yes"...
    if (isEnforced) {
        if (!urlTable) {
            // If table has not yet been selected...
            isValid = false;
            message = 'Please select a table for previews';
        } else if (!urlField) {
            // If a table has been selected, but no field...
            isValid = false;
            message = 'Please select a field for previews';
        } else if (!allowedUrlFieldTypes.includes(urlField.type)) {
            isValid = false;
            message = 'Please select a supported field for previews';
        }
    }

    return {
        isValid,
        message,
        settings,
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
