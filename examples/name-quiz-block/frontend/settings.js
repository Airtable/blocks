/* eslint-disable react/prop-types */
// import {globalConfig, base} from '@airtable/blocks';
import {useBase, useGlobalConfig} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';

// Constants that determine when more pictures are shown in the game.
export const MIN_AMOUNT_OF_PICTURES = 2;
export const MAX_AMOUNT_OF_PICTURES = 4;
export const COMPLETED_NAMES_BEFORE_MAX_AMOUNT_OF_PICTURES = 10;

/**
 * The keys that will be used to store fields in global config.
 */
export const ConfigKeys = Object.freeze({
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
    ATTACHMENT_FIELD_ID: 'attachmentFieldId',
    NAME_FIELD_ID: 'nameFieldId',
});

/**
 * @typedef {Object} Settings - The settings object.
 * @property {Table | null} table - The selected table.
 * @property {View  | null} view - The selected view.
 * @property {RecordQueryResult | null} queryResult - The query result that is used to get records from.
 * @property {Field | null} nameField - The name field.
 * @property {Field | null} attachmentField - The attachment field.
 */

/**
 * A React hook to access settings configured by the SettingsForm.
 * This will re-render when base schema changes, records change, or changes to global config happen.
 * This hook will also check for the existence of enough records to play the game.
 * @return {{isValid: boolean, message: string | null, settings: Settings}}
 */
export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    // Get all the settings.
    const table = base.getTableByIdIfExists(globalConfig.get(ConfigKeys.TABLE_ID));
    const view = table ? table.getViewByIdIfExists(globalConfig.get(ConfigKeys.VIEW_ID)) : null;
    const nameField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.NAME_FIELD_ID))
        : null;
    const attachmentField = table
        ? table.getFieldByIdIfExists(globalConfig.get(ConfigKeys.ATTACHMENT_FIELD_ID))
        : null;

    const queryResult = view ? view.selectRecords({fields: [nameField, attachmentField]}) : null;

    // Validate the settings.
    const isNameFieldValid = nameField && nameField.type === FieldType.SINGLE_LINE_TEXT;
    const isAttachmentFieldValid =
        attachmentField && attachmentField.type === FieldType.MULTIPLE_ATTACHMENTS;
    const isValid = queryResult && isNameFieldValid && isAttachmentFieldValid;

    // Create a validation message if needed.
    let message;
    if (!table) {
        message = 'Pick a table';
    } else if (!view) {
        message = 'Pick a view';
    } else if (!nameField) {
        message = 'Pick a name field';
    } else if (!isNameFieldValid) {
        message = 'The name field should be single line text field';
    } else if (!attachmentField) {
        message = 'Pick a attachment field';
    } else if (!isAttachmentFieldValid) {
        message = 'The profile picture field should be a attachment field ';
    } else {
        message = null;
    }

    return {
        isValid,
        message,
        settings: {
            table,
            view,
            queryResult,
            nameField,
            attachmentField,
        },
    };
}
