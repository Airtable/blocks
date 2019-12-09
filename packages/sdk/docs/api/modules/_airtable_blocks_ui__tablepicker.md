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
[src/ui/table_picker.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L13)_

Props shared between the [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker) and
[TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced) components.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-describedby](_airtable_blocks_ui__select.md#optional-aria-describedby)_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-label](_airtable_blocks_ui__select.md#optional-aria-label)_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-labelledby](_airtable_blocks_ui__select.md#optional-aria-labelledby)_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[autoFocus](_airtable_blocks_ui__select.md#optional-autofocus)_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[className](_airtable_blocks_ui__select.md#optional-classname)_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[disabled](_airtable_blocks_ui__select.md#optional-disabled)_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[id](_airtable_blocks_ui__select.md#optional-id)_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[name](_airtable_blocks_ui__select.md#optional-name)_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/table_picker.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L19)_

A function to be called when the selected table changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/table_picker.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L17)_

The placeholder text when no table is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Defined in
[src/ui/table_picker.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L15)_

If set to `true`, the user can unset the selected table.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[size](_airtable_blocks_ui__select.md#optional-size)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[style](_airtable_blocks_ui__select.md#optional-style)_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[tabIndex](_airtable_blocks_ui__select.md#optional-tabindex)_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

---

### TablePickerProps

• **TablePickerProps**:

_Defined in
[src/ui/table_picker.tsx:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L34)_

Props for the [TablePicker](_airtable_blocks_ui__tablepicker.md#tablepicker) component. Also
accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-describedby](_airtable_blocks_ui__select.md#optional-aria-describedby)_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-label](_airtable_blocks_ui__select.md#optional-aria-label)_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-labelledby](_airtable_blocks_ui__select.md#optional-aria-labelledby)_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[autoFocus](_airtable_blocks_ui__select.md#optional-autofocus)_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[className](_airtable_blocks_ui__select.md#optional-classname)_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[disabled](_airtable_blocks_ui__select.md#optional-disabled)_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[id](_airtable_blocks_ui__select.md#optional-id)_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[name](_airtable_blocks_ui__select.md#optional-name)_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops).[onChange](_airtable_blocks_ui__tablepicker.md#optional-onchange)_

_Defined in
[src/ui/table_picker.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L19)_

A function to be called when the selected table changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops).[placeholder](_airtable_blocks_ui__tablepicker.md#optional-placeholder)_

_Defined in
[src/ui/table_picker.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L17)_

The placeholder text when no table is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Inherited from
[SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops).[shouldAllowPickingNone](_airtable_blocks_ui__tablepicker.md#optional-shouldallowpickingnone)_

_Defined in
[src/ui/table_picker.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L15)_

If set to `true`, the user can unset the selected table.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[size](_airtable_blocks_ui__select.md#optional-size)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[style](_airtable_blocks_ui__select.md#optional-style)_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[tabIndex](_airtable_blocks_ui__select.md#optional-tabindex)_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Defined in
[src/ui/table_picker.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L36)_

The selected table model.

---

### TablePickerSyncedProps

• **TablePickerSyncedProps**:

_Defined in
[src/ui/table_picker_synced.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker_synced.tsx#L15)_

Props for the [TablePickerSynced](_airtable_blocks_ui__tablepicker.md#tablepickersynced) component.
Also accepts:

-   [SelectStyleProps](_airtable_blocks_ui__select.md#selectstyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-describedby](_airtable_blocks_ui__select.md#optional-aria-describedby)_

_Defined in
[src/ui/select.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L120)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-label](_airtable_blocks_ui__select.md#optional-aria-label)_

_Defined in
[src/ui/select.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L116)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[aria-labelledby](_airtable_blocks_ui__select.md#optional-aria-labelledby)_

_Defined in
[src/ui/select.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L118)_

A space separated list of label element IDs.

### `Optional` autoFocus

• **autoFocus**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[autoFocus](_airtable_blocks_ui__select.md#optional-autofocus)_

_Defined in
[src/ui/select.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L104)_

The `autoFocus` attribute.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[className](_airtable_blocks_ui__select.md#optional-classname)_

_Defined in
[src/ui/select.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L102)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[disabled](_airtable_blocks_ui__select.md#optional-disabled)_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L112)_

If set to `true`, the user cannot interact with the select.

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/table_picker_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker_synced.tsx#L17)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected table will always reflect the table id stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new table
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[id](_airtable_blocks_ui__select.md#optional-id)_

_Defined in
[src/ui/select.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L106)_

The `id` attribute.

### `Optional` name

• **name**? : _undefined | string_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[name](_airtable_blocks_ui__select.md#optional-name)_

_Defined in
[src/ui/select.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L108)_

The `name` attribute.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops).[onChange](_airtable_blocks_ui__tablepicker.md#optional-onchange)_

_Defined in
[src/ui/table_picker.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L19)_

A function to be called when the selected table changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Inherited from
[SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops).[placeholder](_airtable_blocks_ui__tablepicker.md#optional-placeholder)_

_Defined in
[src/ui/table_picker.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L17)_

The placeholder text when no table is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Inherited from
[SharedTablePickerProps](_airtable_blocks_ui__tablepicker.md#sharedtablepickerprops).[shouldAllowPickingNone](_airtable_blocks_ui__tablepicker.md#optional-shouldallowpickingnone)_

_Defined in
[src/ui/table_picker.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L15)_

If set to `true`, the user can unset the selected table.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[size](_airtable_blocks_ui__select.md#optional-size)_

_Defined in
[src/ui/select.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L100)_

The size of the select.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[style](_airtable_blocks_ui__select.md#optional-style)_

_Defined in
[src/ui/select.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L114)_

Additional styles to apply to the select.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops).[tabIndex](_airtable_blocks_ui__select.md#optional-tabindex)_

_Defined in
[src/ui/select.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/select.tsx#L110)_

The `tabindex` attribute.

## Functions

### TablePicker

▸ **TablePicker**(`props`: [TablePickerProps](_airtable_blocks_ui__tablepicker.md#tablepickerprops),
`ref`: React.Ref‹HTMLSelectElement›): _Element‹›_

_Defined in
[src/ui/table_picker.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker.tsx#L70)_

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

**Returns:** _Element‹›_

---

### TablePickerSynced

▸ **TablePickerSynced**(`props`:
[TablePickerSyncedProps](_airtable_blocks_ui__tablepicker.md#tablepickersyncedprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element‹›_

_Defined in
[src/ui/table_picker_synced.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/table_picker_synced.tsx#L58)_

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

**Returns:** _Element‹›_
