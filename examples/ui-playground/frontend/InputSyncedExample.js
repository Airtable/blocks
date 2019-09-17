// @flow
import React, {useState} from 'react';
import {InputSynced} from '@airtable/blocks/ui';

export default function InputSyncedExample(props: void) {
    return <InputSynced globalConfigKey="InputSyncedExample" margin={3} maxWidth="400px" />;
}
