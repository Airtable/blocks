import {FieldType} from '@airtable/blocks/models';
import {useBase, useGlobalConfig} from '@airtable/blocks/ui';

export const ConfigKeys = {
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
    FIELD_ID: 'fieldId',
    CHART_ORIENTATION: 'chartOrientation',
    LINK_STYLE: 'linkStyle',
    RECORD_SHAPE: 'recordShape',
};

export const allowedFieldTypes = [FieldType.MULTIPLE_RECORD_LINKS];

export const RecordShape = Object.freeze({
    ROUNDED: 'rounded',
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    CIRCLE: 'circle',
    DIAMOND: 'diamond',
});

export const LinkStyle = Object.freeze({
    RIGHT_ANGLES: 'rightAngles',
    STRAIGHT_LINES: 'straightLines',
});

export const ChartOrientation = Object.freeze({
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
});

const defaults = Object.freeze({
    [ConfigKeys.CHART_ORIENTATION]: ChartOrientation.VERTICAL,
    [ConfigKeys.LINK_STYLE]: LinkStyle.RIGHT_ANGLES,
    [ConfigKeys.RECORD_SHAPE]: RecordShape.ROUNDED,
});

/**
 * Reads the values stored in GlobalConfig and inserts defaults for missing values
 * @param {GlobalConfig} globalConfig
 * @returns {{
 *     tableId?: string,
 *     viewId?: string,
 *     fieldId?: string,
 *     chartOrientation: ChartOrientation,
 *     linkStyle: LinkStyle,
 *     recordShape: RecordShape,
 * }}
 */
function getRawSettingsWithDefaults(globalConfig) {
    const rawSettings = {};
    for (const globalConfigKey of Object.values(ConfigKeys)) {
        const storedValue = globalConfig.get(globalConfigKey);
        if (
            storedValue === undefined &&
            Object.prototype.hasOwnProperty.call(defaults, globalConfigKey)
        ) {
            rawSettings[globalConfigKey] = defaults[globalConfigKey];
        } else {
            rawSettings[globalConfigKey] = storedValue;
        }
    }

    return rawSettings;
}

/**
 * Takes values read from GlobalConfig and converts them to Airtable objects where possible.
 * Also creates an extra key for queryResult which is derived from view and field.
 * @param {object} rawSettings - The object returned by getRawSettingsWithDefaults
 * @param {Base} base - The base being used by the app in order to convert id's to objects
 * @returns {{
 *     table: Table | null,
 *     view: View | null,
 *     field: Field | null,
 *     queryResult: RecordQueryResult | null,
 *     chartOrientation: ChartOrientation,
 *     linkStyle: LinkStyle,
 *     recordShape: RecordShape,
 * }}
 */
function getSettings(rawSettings, base) {
    const table = base.getTableByIdIfExists(rawSettings.tableId);
    const view = table ? table.getViewByIdIfExists(rawSettings.viewId) : null;
    const field = table ? table.getFieldByIdIfExists(rawSettings.fieldId) : null;
    const queryResult =
        view && field ? view.selectRecords({fields: [table.primaryField, field]}) : null;
    return {
        table,
        view,
        field,
        queryResult,
        chartOrientation: rawSettings.chartOrientation,
        linkStyle: rawSettings.linkStyle,
        recordShape: rawSettings.recordShape,
    };
}

/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: object, isValid: boolean} | {settings: object, isValid: boolean, message: string}}
 */
function getSettingsValidationResult(settings) {
    const {queryResult, table, field} = settings;
    if (!queryResult) {
        return {
            isValid: false,
            message: 'Pick a table, view, and linked record field',
            settings: settings,
        };
    } else if (field.type !== FieldType.MULTIPLE_RECORD_LINKS) {
        return {
            isValid: false,
            message: 'Select a linked record field',
            settings: settings,
        };
    } else if (field.options.linkedTableId !== table.id) {
        return {
            isValid: false,
            message: 'Linked record field must be linked to same table',
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
 * @returns {{settings: object, isValid: boolean, message: string} | {settings: object, isValid: boolean}}
 */
export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const rawSettings = getRawSettingsWithDefaults(globalConfig);
    const settings = getSettings(rawSettings, base);
    return getSettingsValidationResult(settings);
}
