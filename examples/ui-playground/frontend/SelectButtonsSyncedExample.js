// @flow
import React, {useState} from 'react';
import {SelectButtonsSynced} from '@airtable/blocks/ui';

export default function SelectButtonsSyncedExample(props: void) {
    return (
        <SelectButtonsSynced
            globalConfigKey="SelectButtonsSynced"
            options={[
                {value: 'foo', label: 'foo'},
                {value: 'bar', label: 'bar'},
                {value: 'baz', label: 'baz'},
            ]}
        />
    );
}
