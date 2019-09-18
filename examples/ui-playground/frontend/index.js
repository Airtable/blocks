// @flow
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';
import ExampleManager from './ExampleManager';
import BaymaxExample from './BaymaxExample';
import BoxExample from './BoxExample';
import ButtonExample from './ButtonExample';
import ColorPaletteSyncedExample from './ColorPaletteSyncedExample';
import InputExample from './InputExample';
import InputSyncedExample from './InputSyncedExample';
import ConfirmationDialogExample from './ConfirmationDialogExample';
import DialogExample from './DialogExample';
import ModalExample from './ModalExample';
import RecordCardListExample from './RecordCardListExample';
import SelectExample from './SelectExample';
import TablePickerSyncedExample from './TablePickerSyncedExample';
import {type Example} from './Example';

// Alphabetically ordered by name.
const examples: Array<Example> = [
    {
        name: 'All Baymax components',
        component: BaymaxExample,
    },
    {
        name: 'Box',
        component: BoxExample,
    },
    {
        name: 'Button',
        component: ButtonExample,
    },
    {
        name: 'ConfirmationDialog',
        component: ConfirmationDialogExample,
    },
    {
        name: 'Dialog',
        component: DialogExample,
    },
    {
        name: 'ColorPaletteSynced',
        component: ColorPaletteSyncedExample,
        hasSettings: true,
    },
    {
        name: 'Input',
        component: InputExample,
    },
    {
        name: 'InputSynced',
        component: InputSyncedExample,
    },
    {
        name: 'RecordCardList',
        component: RecordCardListExample,
        hasSettings: true,
    },
    {
        name: 'Modal',
        component: ModalExample,
    },
    {
        name: 'Select',
        component: SelectExample,
    },
    {
        name: 'TablePickerSynced',
        component: TablePickerSyncedExample,
    },
];

function UIPlaygroundBlock() {
    return <ExampleManager examples={examples} />;
}

initializeBlock(() => <UIPlaygroundBlock />);
