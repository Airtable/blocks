// @flow
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';
import ExampleManager from './ExampleManager';
import BaymaxExample from './BaymaxExample';
import BoxExample from './BoxExample';
import ButtonExample from './ButtonExample';
import CellRendererExample from './CellRendererExample';
import ColorPaletteExample from './ColorPaletteExample';
import ColorPaletteSyncedExample from './ColorPaletteSyncedExample';
import InputExample from './InputExample';
import InputSyncedExample from './InputSyncedExample';
import ConfirmationDialogExample from './ConfirmationDialogExample';
import DialogExample from './DialogExample';
import ModalExample from './ModalExample';
import IconExample from './IconExample';
import FieldIconExample from './FieldIconExample';
import RecordCardListExample from './RecordCardListExample';
import SelectButtonsExample from './SelectButtonsExample';
import SelectButtonsSyncedExample from './SelectButtonsSyncedExample';
import SelectExample from './SelectExample';
import SelectSyncedExample from './SelectSyncedExample';
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
        name: 'CellRenderer',
        component: CellRendererExample,
    },
    {
        name: 'ColorPalette',
        component: ColorPaletteExample,
    },
    {
        name: 'ColorPaletteSynced',
        component: ColorPaletteSyncedExample,
        hasSettings: true,
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
        name: 'FieldIcon',
        component: FieldIconExample,
    },
    {
        name: 'Icon',
        component: IconExample,
    },
    {
        name: 'Input',
        component: InputExample,
    },
    {
        name: 'Modal',
        component: ModalExample,
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
        name: 'SelectButtons',
        component: SelectButtonsExample,
    },
    {
        name: 'SelectButtonsSynced',
        component: SelectButtonsSyncedExample,
    },
    {
        name: 'Select',
        component: SelectExample,
    },
    {
        name: 'SelectSynced',
        component: SelectSyncedExample,
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
