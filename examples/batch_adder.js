import {globalConfig, models, UI} from '@airtable/blocks';
import React from 'react';

// Keys we're storing in globalConfig. Using an enum instead of
// raw strings enables better autocomplete and typechecking.
const GlobalConfigKeys = {
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
    FIELD_ID: 'fieldId',
};

// List of field types that this block supports.
const allowedFieldTypes = [
    models.fieldTypes.CURRENCY,
    models.fieldTypes.NUMBER,
    models.fieldTypes.PERCENT,
];

// Index component. Adds 1 to all records in a selected table or view
// in a selected number/percent/currency field.
function BatchAdder() {
    const base = UI.useBase();

    // Get the selected table based on the table id in globalConfig.
    const tableId = globalConfig.get(GlobalConfigKeys.TABLE_ID);
    const table = base.getTableByIdIfExists(tableId);

    // Get a query result with the records we want to edit.
    let queryResult;
    if (table) {
        // If there's a view selected, only use the records in that view.
        // Otherwise, we'll use all records in the selected table.
        const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);
        const view = table.getViewByIdIfExists(viewId);
        if (view) {
            queryResult = view.selectRecords();
        } else {
            queryResult = table.selectRecords();
        }
    } else {
        queryResult = null;
    }

    // Get the selected field based on the field id in globalConfig.
    const fieldId = globalConfig.get(GlobalConfigKeys.FIELD_ID);
    const field = table ? table.getFieldByIdIfExists(fieldId) : null;

    // Re-render this component if:
    // (1) Any global config value changes (i.e. the table, view, or field changes)
    // (2) The selected field's type changes
    // (3) The current user's permission level changes
    // (4) The records in the query result change
    UI.useWatchable(globalConfig, Object.values(GlobalConfigKeys));
    UI.useWatchable(field, ['type']);
    UI.useWatchable(base, ['permissionLevel']);
    const records = UI.useRecords(queryResult);

    // Disable the add button if:
    // (1) The field (or table) isn't selected
    // (2) The field is of an unsupported type
    // (3) The user doesn't have permission to update the cell values in the field
    // (4) The query result isn't loaded yet
    const canAdd =
        field &&
        allowedFieldTypes.includes(field.type) &&
        field.canSetCellValues() &&
        queryResult.isDataLoaded;

    // Adds 1 to the cell values for the specified records and field.
    function onAddClick() {
        let amountToAdd;
        if (field.type === models.fieldTypes.PERCENT) {
            // For percent fields, we only want to add 1%.
            amountToAdd = 1 / 100;
        } else {
            amountToAdd = 1;
        }
        for (const record of records) {
            record.setCellValue(field.id, record.getCellValue(field) + amountToAdd);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 16,
            }}
        >
            <Label text="Table">
                <UI.TablePickerSynced globalConfigKey={GlobalConfigKeys.TABLE_ID} />
            </Label>
            <Label text="View">
                <UI.ViewPickerSynced
                    table={table}
                    globalConfigKey={GlobalConfigKeys.VIEW_ID}
                    // This prop allows the user to deselect the view.
                    // For this block, clicking the button with no view
                    // selected will add 1 to all records in the table.
                    shouldAllowPickingNone={true}
                />
            </Label>
            <Label text="Field">
                <UI.FieldPickerSynced
                    table={table}
                    globalConfigKey={GlobalConfigKeys.FIELD_ID}
                    // This prop allows the user to specify a set of
                    // allowed field types.
                    allowedTypes={allowedFieldTypes}
                />
            </Label>
            <UI.Button
                theme={UI.Button.themes.BLUE}
                style={{justifyContent: 'center'}}
                disabled={!canAdd}
                onClick={onAddClick}
            >
                + Add
            </UI.Button>
        </div>
    );
}

// Wrapper component for labeled model pickers.
function Label({text, children}) {
    return (
        <label
            style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 16,
            }}
        >
            <p style={{fontWeight: 500, marginBottom: 8}}>{text}</p>
            {children}
        </label>
    );
}

UI.initializeBlock(() => <BatchAdder />);
