import React from 'react';
import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    expandRecord,
    TablePickerSynced,
    ViewPickerSynced,
} from '@airtable/blocks/ui';

function TodoBlock() {
    const base = useBase();

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const viewId = globalConfig.get('selectedViewId');

    const table = base.getTableByIdIfExists(tableId);
    const view = table ? table.getViewByIdIfExists(viewId) : null;

    const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records
        ? records.map(record => {
              return <Task key={record.id} record={record} />;
          })
        : null;

    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
            <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
            {tasks}
        </div>
    );
}

function Task({record}) {
    return (
        <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
            <a
                style={{cursor: 'pointer'}}
                onClick={() => {
                    expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || 'Unnamed record'}
            </a>
        </div>
    );
}

initializeBlock(() => <TodoBlock />);
