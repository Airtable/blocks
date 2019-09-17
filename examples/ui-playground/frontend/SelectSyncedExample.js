// @flow
import React, {useState} from 'react';
import {SelectSynced} from '@airtable/blocks/ui';

export default function SelectSyncedExample(props: void) {
    return (
        <SelectSynced
            globalConfigKey="SelectSyncedExample"
            options={[
                {value: 'foo', label: 'foo'},
                {value: 'bar', label: 'bar'},
                {value: 'baz', label: 'baz'},
            ]}
            margin={3}
            maxWidth="400px"
        />
    );
}
