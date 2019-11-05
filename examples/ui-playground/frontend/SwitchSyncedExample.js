// @flow
import React from 'react';
import {SwitchSynced} from '@airtable/blocks/ui';

export default function SwitchSyncedExample(props: void) {
    return (
        <SwitchSynced globalConfigKey="isSyncedSwitchEnabled" label="Switch on/off" width="200px" />
    );
}
