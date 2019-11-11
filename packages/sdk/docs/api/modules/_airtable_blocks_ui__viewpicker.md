[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ViewPicker](_airtable_blocks_ui__viewpicker.md)

# External module: @airtable/blocks/ui: ViewPicker

## Index

### Interfaces

-   [SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops)
-   [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops)
-   [ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops)

### Functions

-   [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker)
-   [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced)

## Interfaces

### SharedViewPickerProps

• **SharedViewPickerProps**:

_Defined in
[src/ui/view_picker.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L19)_

Props shared between the [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker) and
[ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced) components. Also accepts:

-   [SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops)

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[ViewType](_airtable_blocks_models__view.md#viewtype)›_

_Defined in
[src/ui/view_picker.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L23)_

An array indicating which view types can be selected.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/view_picker.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L29)_

A function to be called when the selected view changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/view_picker.tsx:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L27)_

The placeholder text when no view is selected. Defaults to `'Pick a view...'`

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Defined in
[src/ui/view_picker.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L25)_

If set to `true`, the user can unset the selected view.

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Defined in
[src/ui/view_picker.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L21)_

The parent table model to select views from. If `null` or `undefined`, the picker won't render.

---

### ViewPickerProps

• **ViewPickerProps**:

_Defined in
[src/ui/view_picker.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L48)_

Props for the [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker) component. Also accepts:

-   [SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops)

### `Optional` view

• **view**? : _[View](_airtable_blocks_models__view.md#view) | null_

_Defined in
[src/ui/view_picker.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L50)_

The selected view model.

---

### ViewPickerSyncedProps

• **ViewPickerSyncedProps**:

_Defined in
[src/ui/view_picker_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker_synced.tsx#L17)_

Props for the [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced) component.
Also accepts:

-   [SharedViewPickerProps](_airtable_blocks_ui__viewpicker.md#sharedviewpickerprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/view_picker_synced.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker_synced.tsx#L19)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected view will always reflect the view id stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new view
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

## Functions

### ViewPicker

▸ **ViewPicker**(`props`: [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops),
`ref`: React.Ref‹HTMLSelectElement›): _null | Element_

_Defined in
[src/ui/view_picker.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker.tsx#L101)_

Dropdown menu component for selecting views.

**Example:**

```js
import {TablePicker, ViewPicker, useBase, useRecords} from '@airtable/blocks/ui';
import {viewTypes} from '@airtable/blocks/models';
import React, {Fragment, useState} from 'react';

function Block() {
    useBase();
    const [table, setTable] = useState(null);
    const [view, setView] = useState(null);
    const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);

    const summaryText = view
        ? `${view.name} has ${records.length} record(s).`
        : 'No view selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePicker
                    table={table}
                    onChange={newTable => {
                        setTable(newTable);
                        setView(null);
                    }}
                    shouldAllowPickingNone={true}
                />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
                    <ViewPicker
                        table={table}
                        view={view}
                        onChange={newView => setView(newView)}
                        allowedTypes={[viewTypes.GRID]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                  |
| ------- | --------------------------------------------------------------------- |
| `props` | [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                          |

**Returns:** _null | Element_

---

### ViewPickerSynced

▸ **ViewPickerSynced**(`props`:
[ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element_

_Defined in
[src/ui/view_picker_synced.tsx:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/view_picker_synced.tsx#L69)_

A wrapper around the [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker) component that
syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {
    TablePickerSynced,
    ViewPickerSynced,
    useBase,
    useRecords,
    useWatchable,
} from '@airtable/blocks/ui';
import {viewTypes} from '@airtable/blocks/models';
import {globalConfig} from '@airtable/blocks';
import React, {Fragment} from 'react';

function Block() {
    const base = useBase();
    const tableId = globalConfig.get('tableId');
    const table = base.getTableByIdIfExists(tableId);
    const viewId = globalConfig.get('viewId');
    const view = table.getViewByIdIfExists(viewId);
    const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);
    useWatchable(globalConfig, ['tableId', 'viewId']);

    const summaryText = view
        ? `${view.name} has ${records.length} record(s).`
        : 'No view selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePickerSynced globalConfigKey="tableId" shouldAllowPickingNone={true} />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
                    <ViewPickerSynced
                        table={table}
                        globalConfigKey="viewId"
                        allowedTypes={[viewTypes.GRID]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| `props` | [ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                                      |

**Returns:** _Element_
