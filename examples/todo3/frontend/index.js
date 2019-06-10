import {UI, globalConfig} from '@airtable/blocks';
import React, {useState} from 'react';

// Renders all the records in the selected table and view.
function TodoBlock() {
    const base = UI.useBase();

    UI.useWatchable(globalConfig, ['tableId', 'viewId']);
    const tableId = globalConfig.get('tableId');
    const viewId = globalConfig.get('viewId');

    const table = tableId ? base.getTableByIdIfExists(tableId) : null;
    const view = table ? table.getViewByIdIfExists(viewId) : null;

    const queryResult = view ? view.selectRecords() : null;
    const records = UI.useRecords(queryResult);

    // Create a list of <Task /> components, one for each record.
    const tasks = records
        ? records.map(record => {
              return <Task key={record.id} record={record} />;
          })
        : null;

    return (
        <div>
            <UI.TablePickerSynced table={table} globalConfigKey="tableId" />
            {table && <UI.ViewPickerSynced table={table} globalConfigKey="viewId" />}
            {tasks}
        </div>
    );
}

// Renders a single record.
function Task({record}) {
    return (
        <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
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
