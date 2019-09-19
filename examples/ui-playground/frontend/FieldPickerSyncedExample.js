// @flow
import React, {useState} from 'react';
import {FieldPickerSynced, useBase} from '@airtable/blocks/ui';

export default function FieldPickerSyncedExample(props: void) {
    const base = useBase();
    const table = base.tables[0];

    return (
        <FieldPickerSynced
            globalConfigKey="FieldPickerSynced"
            table={base.tables[0]}
            margin={3}
            maxWidth="400px"
        />
    );
}
