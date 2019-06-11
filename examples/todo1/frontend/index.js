import {initializeBlock, useBase, useRecords, expandRecord} from '@airtable/blocks/ui';
import React from 'react';

// Renders all the records in the "Tasks" table.
function TodoBlock() {
    const base = useBase();
    const table = base.getTableByName('Tasks');
    
    const queryResult = table.selectRecords();
    const records = useRecords(queryResult);

    const tasks = records.map(record => {
        return <Task key={record.id} record={record} />;
    });

    return (
        <div>{tasks}</div>
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

initializeBlock(() => <TodoBlock />);
