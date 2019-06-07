import {UI, base, models, globalConfig} from '@airtable/blocks';
import React, {useState} from 'react';

// Renders a single record.
function Task({record, checkboxField}) {
    return (
        <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
            {checkboxField && (
                <input
                    type="checkbox"
                    checked={record.getCellValue(checkboxField)}
                    disabled={!record.canSetCellValue(checkboxField)}
                    onChange={e => {
                        record.setCellValue(checkboxField, e.target.checked);
                    }}
                />
            )}
            <a
                onClick={() => {
                    UI.expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || 'Unnamed record'}
            </a>
        </div>
    );
}

// Renders all the records in the selected table and view.
function TodoBlock() {
    UI.useWatchable(globalConfig, ['tableId', 'viewId', 'fieldId']);
    const tableId = globalConfig.get('tableId');
    const viewId = globalConfig.get('viewId');
    const fieldId = globalConfig.get('fieldId');

    const table = tableId ? base.getTableByIdIfExists(tableId) : null;
    const view = table ? table.getViewByIdIfExists(viewId) : null;
    const field = table ? table.getFieldByIdIfExists(fieldId) : null;

    const queryResult = view ? view.select() : null;
    UI.useWatchable(queryResult, ['records', 'cellValues']);

    let tasks = null;

    if (queryResult && queryResult.isDataLoaded) {
        // Create a list of <Task /> components, one for each record.
        tasks = queryResult.records.map(record => {
            return <Task key={record.id} record={record} checkboxField={field} />;
        });
    }

    return (
        <div>
            <UI.TablePickerSynced globalConfigKey="tableId" />
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
export default TodoBlock;
