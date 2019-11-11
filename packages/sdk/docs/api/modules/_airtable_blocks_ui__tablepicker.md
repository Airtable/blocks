[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: TablePicker](_airtable_blocks_ui__tablepicker.md)

# External module: @airtable/blocks/ui: TablePicker

## Index

### Interfaces

-   [SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops)
-   [TablePickerProps](_airtable_blocks_ui__tablepicker.md#tablepickerprops)
-   [TablePickerSyncedProps](_airtable_blocks_ui__tablepicker.md#tablepickersyncedprops)

### Functions

-   [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker)
-   [TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced)

## Interfaces

### SharedTablePickerProps

• **SharedTablePickerProps**:

_Defined in
[src/ui/table_picker.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L16)_

Props shared between the [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker) and
[TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced) components. Also accepts:

-   [SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops)

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/table_picker.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L22)_

A function to be called when the selected table changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/table_picker.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L20)_

The placeholder text when no table is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Defined in
[src/ui/table_picker.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L18)_

If set to `true`, the user can unset the selected table.

---

### TablePickerProps

• **TablePickerProps**:

_Defined in
[src/ui/table_picker.tsx:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L39)_

Props for the [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker) component. Also
accepts:

-   [SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops)

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Defined in
[src/ui/table_picker.tsx:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L41)_

The selected table model.

---

### TablePickerSyncedProps

• **TablePickerSyncedProps**:

_Defined in
[src/ui/table_picker_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker_synced.tsx#L17)_

Props for the [TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced) component.
Also accepts:

-   [SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/table_picker_synced.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker_synced.tsx#L19)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected table will always reflect the table id stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new table
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

## Functions

### TablePicker

▸ **TablePicker**(`props`: [TablePickerProps](_airtable_blocks_ui__tablepicker.md#tablepickerprops),
`ref`: React.Ref‹HTMLSelectElement›): _Element_

_Defined in
[src/ui/table_picker.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker.tsx#L75)_

Dropdown menu component for selecting tables.

**Example:**

```js
import {TablePicker, useBase, useRecords} from '@airtable/blocks/ui';
import React, {Fragment, useState} from 'react';

function Block() {
    useBase();
    const [table, setTable] = useState(null);
    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    const summaryText = table
        ? `${table.name} has ${records.length} record(s).`
        : 'No table selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePicker
                    table={table}
                    onChange={newTable => setTable(newTable)}
                    shouldAllowPickingNone={true}
                />
            </label>
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| `props` | [TablePickerProps](_airtable_blocks_ui__tablepicker.md#tablepickerprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                             |

**Returns:** _Element_

---

### TablePickerSynced

▸ **TablePickerSynced**(`props`:
[TablePickerSyncedProps](_airtable_blocks_ui__tablepicker.md#tablepickersyncedprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element_

_Defined in
[src/ui/table_picker_synced.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/table_picker_synced.tsx#L60)_

A wrapper around the [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker) component that
syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {TablePickerSynced, useBase, useRecords, useWatchable} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React, {Fragment} from 'react';

function Block() {
    const base = useBase();
    const tableId = globalConfig.get('tableId');
    const table = base.getTableByIdIfExists(tableId);
    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);
    useWatchable(globalConfig, ['tableId']);

    const summaryText = table
        ? `${table.name} has ${records.length} record(s).`
        : 'No table selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePickerSynced globalConfigKey="tableId" shouldAllowPickingNone={true} />
            </label>
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                                 |
| ------- | ------------------------------------------------------------------------------------ |
| `props` | [TablePickerSyncedProps](_airtable_blocks_ui__tablepicker.md#tablepickersyncedprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                                         |

**Returns:** _Element_
