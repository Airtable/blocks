// @flow
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';
import ExampleManager, {type Example} from './ExampleManager';
import BaymaxExample from './BaymaxExample';
import BoxExample from './BoxExample';
import ColorPaletteSyncedExample from './ColorPaletteSyncedExample';
import TablePickerSyncedExample from './TablePickerSyncedExample';
import RecordCardListExample from './RecordCardListExample';

// Alphabetically ordered by name.
const examples: Array<Example> = [
    {
        name: 'Baymax namespacing',
        component: BaymaxExample,
    },
    {
        name: 'Box',
        component: BoxExample,
    },
    {
        name: 'ColorPaletteSynced',
        component: ColorPaletteSyncedExample,
        hasSettings: true,
    },
    {
        name: 'TablePickerSynced',
        component: TablePickerSyncedExample,
    },
    {
        name: 'RecordCardList',
        component: RecordCardListExample,
        hasSettings: true,
    },
];

function UIPlaygroundBlock() {
    return <ExampleManager examples={examples} />;
}

initializeBlock(() => <UIPlaygroundBlock />);
