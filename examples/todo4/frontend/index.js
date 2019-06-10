import {UI, models, globalConfig} from '@airtable/blocks';
import React, {useState} from 'react';

function getCheckboxField(table, fieldId) {
    const field = table.getFieldByIdIfExists(fieldId);
    if (!field) {
        return null;
    }

    // Only return the field if it's a checkbox field.
    // Field types can be changed by users.
    if (field.type !== models.fieldTypes.CHECKBOX) {
        console.log(field.type);
        return null;
    }
    return field;
}

// Renders all the records in the selected table and view.
function TodoBlock() {
    const base = UI.useBase();

    UI.useWatchable(globalConfig, ['tableId', 'viewId', 'fieldId']);
    const tableId = globalConfig.get('tableId');
    const viewId = globalConfig.get('viewId');
    const fieldId = globalConfig.get('fieldId');

    const table = tableId ? base.getTableByIdIfExists(tableId) : null;
    const view = table ? table.getViewByIdIfExists(viewId) : null;
    const field = table ? getCheckboxField(table, fieldId) : null;

    const queryResult = view ? view.selectRecords() : null;
    const records = UI.useRecords(queryResult);

    const tasks = records
        ? records.map(record => {
              return <Task key={record.id} record={record} checkboxField={field} />;
          })
        : null;

    return (
        <div>
            <UI.TablePickerSynced table={table} globalConfigKey="tableId" />
            {table && <UI.ViewPickerSynced table={table} globalConfigKey="viewId" />}
            {table && (
                <UI.FieldPickerSynced
                    table={table}
                    globalConfigKey="fieldId"
                    allowedTypes={[models.fieldTypes.CHECKBOX]}
                    shouldAllowPickingNone={true}
                />
            )}
            {tasks}
        </div>
    );
}

// Renders a single record.
function Task({record, checkboxField}) {
    return (
        <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
            {checkboxField && (
                <input
                    type="checkbox"
                    checked={record.getCellValue(checkboxField) ? true : false}
                    disabled={!record.canSetCellValue(checkboxField)}
                    onChange={e => {
                        record.setCellValue(checkboxField, e.target.checked);
                    }}
                />
            )}
            <a
                style={{cursor: 'pointer'}}
                onClick={() => {
                    UI.expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || 'Unnamed record'}
            </a>
        </div>
    );
}

UI.initializeBlock(() => <TodoBlock />);
