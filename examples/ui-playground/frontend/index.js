// @flow
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';
import BaymaxExample from './BaymaxExample';
import BoxExample from './BoxExample';
import ButtonExample from './ButtonExample';
import ChoiceTokenExample from './ChoiceTokenExample';
import CellRendererExample from './CellRendererExample';
import CollaboratorTokenExample from './CollaboratorTokenExample';
import ColorPaletteExample from './ColorPaletteExample';
import ColorPaletteSyncedExample from './ColorPaletteSyncedExample';
import ConfirmationDialogExample from './ConfirmationDialogExample';
import DialogExample from './DialogExample';
import ExampleManager from './ExampleManager';
import FieldIconExample from './FieldIconExample';
import FieldPickerExample from './FieldPickerExample';
import FieldPickerSyncedExample from './FieldPickerSyncedExample';
import IconExample from './IconExample';
import InputExample from './InputExample';
import InputSyncedExample from './InputSyncedExample';
import LoaderExample from './LoaderExample';
import ModalExample from './ModalExample';
import ProgressBarExample from './ProgressBarExample';
import RecordCardExample from './RecordCardExample';
import RecordCardListExample from './RecordCardListExample';
import SelectButtonsExample from './SelectButtonsExample';
import SelectButtonsSyncedExample from './SelectButtonsSyncedExample';
import SelectExample from './SelectExample';
import SelectSyncedExample from './SelectSyncedExample';
import TablePickerExample from './TablePickerExample';
import TablePickerSyncedExample from './TablePickerSyncedExample';
import ToggleExample from './ToggleExample';
import ToggleSyncedExample from './ToggleExample';
import TooltipExample from './TooltipExample';
import ViewPickerExample from './ViewPickerExample';
import ViewPickerSyncedExample from './ViewPickerSyncedExample';
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
        name: 'ChoiceToken',
        component: ChoiceTokenExample,
    },
    {
        name: 'CollaboratorToken',
        component: CollaboratorTokenExample,
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
        name: 'FieldPicker',
        component: FieldPickerExample,
    },
    {
        name: 'FieldPickerSynced',
        component: FieldPickerSyncedExample,
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
        name: 'Loader',
        component: LoaderExample,
    },
    {
        name: 'Modal',
        component: ModalExample,
    },
    {
        name: 'ProgressBar',
        component: ProgressBarExample,
    },
    {
        name: 'RecordCard',
        component: RecordCardExample,
    },
    {
        name: 'RecordCardList',
        component: RecordCardListExample,
        hasSettings: true,
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
        name: 'TablePicker',
        component: TablePickerExample,
    },
    {
        name: 'TablePickerSynced',
        component: TablePickerSyncedExample,
    },
    {
        name: 'Toggle',
        component: ToggleExample,
    },
    {
        name: 'ToggleSynced',
        component: ToggleSyncedExample,
    },
    {
        name: 'Tooltip',
        component: TooltipExample,
    },
    {
        name: 'ViewPicker',
        component: ViewPickerExample,
    },
    {
        name: 'ViewPickerSynced',
        component: ViewPickerSyncedExample,
    },
];

function UIPlaygroundBlock() {
    return <ExampleManager examples={examples} />;
}

initializeBlock(() => <UIPlaygroundBlock />);
