import {UI} from '@airtable/blocks';
import React from 'react';

// Renders all the records in the "Grid view" in the "Tasks" table.
function TodoBlock() {
    const base = UI.useBase();
    const table = base.getTableByName('Tasks');
    const view = table.getViewByName('Grid view');

    const queryResult = view.selectRecords();
    UI.useRecords(queryResult);

    // Create a list of <Task /> components, one for each record.
    const tasks = queryResult.records.map(record => {
        return <Task key={record.id} record={record} />;
    });

    return <div>{tasks}</div>;
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
