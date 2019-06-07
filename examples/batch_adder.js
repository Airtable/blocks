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

// Gets the selected table based on the table id in globalConfig.
function getSelectedTable() {
    const base = UI.useBase();
    const tableId = globalConfig.get(GlobalConfigKeys.TABLE_ID);
    return base.getTableByIdIfExists(tableId);
}

// Gets the selected field based on the field id in globalConfig.
function getSelectedField() {
    const table = getSelectedTable();
    if (!table) {
        return null;
    }
    const fieldId = globalConfig.get(GlobalConfigKeys.FIELD_ID);
    return table.getFieldByIdIfExists(fieldId);
}

// Gets a query result with the records we want to edit.
function getQueryResult() {
    const table = getSelectedTable();
    if (!table) {
        return null;
    }
    const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);
    const view = table.getViewByIdIfExists(viewId);
    // If there's a view selected, only use the records in that view.
    // Otherwise, we'll use all records in the selected table.
    if (view) {
        return view.selectRecords();
    } else {
        return table.selectRecords();
    }
}

// Adds 1 to the cell values for the specified records and field.
function onAddClick(records, field) {
    let amountToAdd;
    if (field.type === models.fieldTypes.PERCENT) {
        // For percent fields, we only want to add 1%.
        amountToAdd = 1 / 100;
    } else {
        amountToAdd = 1;
    }
    for (const record of records) {
        record.setCellValue(field, record.getCellValue(field) + amountToAdd);
    }
}

// Index component. Adds 1 to all records in a selected table or view
// in a selected number/percent/currency field.
function BatchAdder() {
    const base = UI.useBase();
    const table = getSelectedTable();
    const queryResult = getQueryResult();
    const field = getSelectedField();
    const isReadOnly = !globalConfig.canSet(GlobalConfigKeys.TABLE_ID);

    // Re-render this component if:
    // (1) Any global config value changes (i.e. the table, view, or field changes)
    // (2) Records are added to or removed from the query result
    // (3) The current user's permission level changes
    // (4) The selected field's type changes
    UI.useWatchable(globalConfig, Object.values(GlobalConfigKeys));
    UI.useRecords(queryResult);
    UI.useWatchable(base, ['permissionLevel']);
    UI.useWatchable(field, ['type']);

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
                // Disable the button if:
                // (1) There's no table or field selected
                // (2) The field is of an unsupported type
                // (3) The user can't edit cell values in the base
                disabled={!field || !allowedFieldTypes.includes(field.type) || isReadOnly}
                onClick={() => onAddClick(queryResult.records, field)}
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
