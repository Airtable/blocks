// @flow
import React, {useState} from 'react';
import {TablePicker} from '@airtable/blocks/ui';

export default function TablePickerExample(props: void) {
    const [table, setTable] = useState(null);
    return (
        <TablePicker
            table={table}
            onChange={newTable => setTable(newTable)}
            margin={3}
            maxWidth="400px"
        />
    );
}
