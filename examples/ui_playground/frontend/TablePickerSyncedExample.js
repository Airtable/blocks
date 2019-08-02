// @flow
import * as React from 'react';
import {TablePickerSynced} from '@airtable/blocks/ui';

export default function TablePickerSyncedExample(props: void) {
    return (
        <div style={{width: 280}}>
            <TablePickerSynced globalConfigKey="table" style={{width: '100%'}} />
        </div>
    );
}
