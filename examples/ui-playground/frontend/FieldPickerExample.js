// @flow
import React, {useState} from 'react';
import {FieldPicker, useBase} from '@airtable/blocks/ui';

export default function FieldPickerExample(props: void) {
    const base = useBase();
    const [field, setField] = useState(null);
    const table = base.tables[0];

    return (
        <FieldPicker
            table={base.tables[0]}
            field={field}
            onChange={newField => setField(newField)}
            margin={3}
            maxWidth="400px"
        />
    );
}
