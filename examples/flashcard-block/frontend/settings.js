import {useBase, useGlobalConfig} from '@airtable/blocks/ui';

export const ConfigKeys = Object.freeze({
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
    QUESTION_FIELD_ID: 'questionFieldId',
    ANSWER_FIELD_ID: 'answerFieldId',
});

/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{
 *  settings: {
 *      table: Table | null,
 *      view: View | null,
 *      questionField: Field | null,
 *      answerField: Field | null,
 *  },
 *  isValid: boolean,
 *  message?: string}}
 */
export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    const table = base.getTableByIdIfExists(globalConfig.get(ConfigKeys.TABLE_ID));
    const view = table ? table.getViewByIdIfExists(globalConfig.get(ConfigKeys.VIEW_ID)) : null;
    const questionField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.QUESTION_FIELD_ID))
        : null;
    const answerField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.ANSWER_FIELD_ID))
        : null;
    const settings = {
        table,
        view,
        questionField,
        answerField,
    };

    if (!table || !view || !questionField) {
        return {
            isValid: false,
            message: 'Pick a table, view, and question field',
            settings,
        };
    }
    return {
        isValid: true,
        settings,
    };
}
