// @flow
import React from 'react';
import {RecordCard, useBase, useRecords} from '@airtable/blocks/ui';

export default function RecordCardExample() {
    const base = useBase();
    const table = base.getTableByIdIfExists(base.tables[0].id);
    const view = table ? table.getViewByIdIfExists(table.views[0].id) : null;
    const records = useRecords(view);

    return (
        records &&
        records[0] &&
        view && (
            <RecordCard
                record={records[0]}
                view={view}
                className="user-defined-class"
                height={120}
                margin={3}
            />
        )
    );
}
