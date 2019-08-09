// @flow
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';
import TablePickerSyncedExample from './TablePickerSyncedExample';
import ColorPaletteSyncedExample from './ColorPaletteSyncedExample';
import ExampleManager from './ExampleManager';
import {type Example} from './Example';

const examples: Array<Example> = [
    {
        name: 'TablePickerSynced',
        component: TablePickerSyncedExample,
    },
    {
        name: 'ColorPaletteSynced',
        component: ColorPaletteSyncedExample,
    },
];

function UIPlaygroundBlock() {
    return <ExampleManager examples={examples} />;
}

initializeBlock(() => <UIPlaygroundBlock />);
