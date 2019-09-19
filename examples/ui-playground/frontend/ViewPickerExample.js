// @flow
import React, {useState} from 'react';
import {ViewPicker, useBase} from '@airtable/blocks/ui';

export default function ViewPickerExample(props: void) {
    const base = useBase();
    const [view, setView] = useState(null);
    const table = base.tables[0];

    return (
        <ViewPicker
            table={base.tables[0]}
            view={view}
            onChange={newView => setView(newView)}
            margin={3}
            maxWidth="400px"
        />
    );
}
