import {UI, base, globalConfig} from '@airtable/blocks';
import React, {useState} from 'react';

// Renders a single record.
function Task({record}) {
    return (
        <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
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
    UI.useWatchable(globalConfig, ['tableId', 'viewId']);
    const tableId = globalConfig.get('tableId');
    const viewId = globalConfig.get('viewId');

    const table = tableId ? base.getTableByIdIfExists(tableId) : null;
    const view = table ? table.getViewByIdIfExists(viewId) : null;

    const queryResult = view ? view.select() : null;
    UI.useWatchable(queryResult, ['records', 'cellValues']);

    let tasks = null;

    if (queryResult && queryResult.isDataLoaded) {
        // Create a list of <Task /> components, one for each record.
        tasks = queryResult.records.map(record => {
            return <Task key={record.id} record={record} />;
        });
    }

    return (
        <div>
            <UI.TablePickerSynced globalConfigKey="tableId" />
            {table && <UI.ViewPickerSynced table={table} globalConfigKey="viewId" />}
            {tasks}
        </div>
    );
}
export default TodoBlock;
