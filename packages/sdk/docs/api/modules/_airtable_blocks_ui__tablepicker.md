[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: TablePicker](_airtable_blocks_ui__tablepicker.md)

# External module: @airtable/blocks/ui: TablePicker

## Index

### Classes

-   [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker)
-   [TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced)

### Type aliases

-   [TablePickerProps](_airtable_blocks_ui__tablepicker.md#tablepickerprops)
-   [TablePickerSyncedProps](_airtable_blocks_ui__tablepicker.md#tablepickersyncedprops)

## Classes

### TablePicker

• **TablePicker**:

_Defined in
[src/ui/table_picker.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker.tsx#L84)_

Dropdown menu component for selecting tables.

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/table_picker.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker.tsx#L107)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/table_picker.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker.tsx#L114)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/table_picker.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker.tsx#L100)_

**Returns:** _void_

---

### TablePickerSynced

• **TablePickerSynced**:

_Defined in
[src/ui/table_picker_synced.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker_synced.tsx#L66)_

Dropdown menu component for selecting tables, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/table_picker_synced.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker_synced.tsx#L88)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/table_picker_synced.tsx:95](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker_synced.tsx#L95)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/table_picker_synced.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker_synced.tsx#L81)_

**Returns:** _void_

## Type aliases

### TablePickerProps

Ƭ **TablePickerProps**: _object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/table_picker.tsx:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker.tsx#L51)_

**`typedef`** {object} TablePickerProps

**`property`** {Table} [table] The selected table model.

**`property`** {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected
table.

**`property`** {string} [placeholder='Pick a table...'] The placeholder text when no table is
selected.

**`property`** {Function} [onChange] A function to be called when the selected table changes.

**`property`** {string} [autoFocus] The `autoFocus` attribute.

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the picker.

**`property`** {string} [id] The `id` attribute.

**`property`** {string} [name] The `name` attribute.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [className] Additional class names to apply to the picker.

**`property`** {object} [style] Additional styles to apply to the picker.

**`property`** {string} [aria-label] The `aria-label` attribute. Use this if the select is not
referenced by a label element.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### TablePickerSyncedProps

Ƭ **TablePickerSyncedProps**: _object & object & object & object & object & object & object & object
& object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/table_picker_synced.tsx:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/table_picker_synced.tsx#L31)_

**`typedef`** {object} TablePickerSyncedProps

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The selected table will always
reflect the table id stored in `globalConfig` for this key. Selecting a new table will update
`globalConfig`.

**`property`** {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected
table.

**`property`** {string} [placeholder='Pick a table...'] The placeholder text when no table is
selected.

**`property`** {Function} [onChange] A function to be called when the selected table changes. This
should only be used for side effects.

**`property`** {string} [autoFocus] The `autoFocus` attribute.

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the picker.

**`property`** {string} [id] The `id` attribute.

**`property`** {string} [name] The `name` attribute.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [className] Additional class names to apply to the picker.

**`property`** {object} [style] Additional styles to apply to the picker.

**`property`** {string} [aria-label] The `aria-label` attribute. Use this if the select is not
referenced by a label element.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.
