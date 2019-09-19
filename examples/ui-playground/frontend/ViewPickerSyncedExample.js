// @flow
import React, {useState} from 'react';
import {ViewPickerSynced, useBase} from '@airtable/blocks/ui';

export default function ViewPickerSyncedExample(props: void) {
    const base = useBase();
    const [view, setView] = useState(null);
    const table = base.tables[0];

    return (
        <ViewPickerSynced
            globalConfigKey="ViewPickerSynced"
            table={base.tables[0]}
            margin={3}
            maxWidth="400px"
        />
    );
}
