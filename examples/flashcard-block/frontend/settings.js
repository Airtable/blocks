import {useBase, useGlobalConfig} from '@airtable/blocks/ui';

export const ConfigKeys = Object.freeze({
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
    TITLE_FIELD_ID: 'titleFieldId',
    DETAILS_FIELD_ID: 'detailsFieldId',
});

/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{
 *  settings: {
 *      table: Table | null,
 *      view: View | null,
 *      titleField: Field | null,
 *      detailsField: Field | null,
 *  },
 *  isValid: boolean,
 *  message?: string}}
 */
export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    const table = base.getTableByIdIfExists(globalConfig.get(ConfigKeys.TABLE_ID));
    const view = table ? table.getViewByIdIfExists(globalConfig.get(ConfigKeys.VIEW_ID)) : null;
    const titleField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.TITLE_FIELD_ID))
        : null;
    const detailsField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.DETAILS_FIELD_ID))
        : null;
    const settings = {
        table,
        view,
        titleField,
        detailsField,
    };

    if (!table || !view || !titleField) {
        return {
            isValid: false,
            message: 'Pick a table, view, and title field',
            settings,
        };
    }
    return {
        isValid: true,
        settings,
    };
}
