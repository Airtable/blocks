// @flow
import React, {useState} from 'react';
import {Box, CellRenderer, FieldPicker, useBase, useRecords} from '@airtable/blocks/ui';

export default function CellRendererExample(props: void) {
    const [field, setField] = useState(null);
    const base = useBase();
    const table = base.tables[0];
    const queryResult = table.selectRecords();
    const records = useRecords(queryResult);
    return (
        <Box display="flex" flexDirection="column">
            <FieldPicker table={table} field={field} onChange={setField} />
            {field && (
                <CellRenderer
                    className="user-defined-class"
                    field={field}
                    record={records[0]}
                    margin={3}
                />
            )}
        </Box>
    );
}
