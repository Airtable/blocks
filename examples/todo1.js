import {UI, base} from '@airtable/blocks';
import React from 'react';

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

// Renders all the records in the "Grid view" in the "Tasks" table.
function TodoBlock() {
    const table = base.getTableByName('Tasks');
    const view = table.getViewByName('Grid view');

    const queryResult = view.select();
    UI.useWatchable(queryResult, ['records', 'cellValues']);

    let tasks = null;
    if (queryResult.isDataLoaded) {
        // Create a list of <Task /> components, one for each record.
        tasks = queryResult.records.map(record => {
            return <Task key={record.id} record={record} />;
        });
    }

    return <div>{tasks}</div>;
}
export default TodoBlock;
