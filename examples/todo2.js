import {UI, base} from '@airtable/blocks';
import React, {useState} from 'react';

// Renders all the records in the selected table and view.
function TodoBlock() {
    const [tableId, setTableId] = useState(null);
    const [viewId, setViewId] = useState(null);

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
            <UI.TablePicker table={table} onChange={table => setTableId(table.id)} />
            {table && (
                <UI.ViewPicker table={table} view={view} onChange={view => setViewId(view.id)} />
            )}
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
