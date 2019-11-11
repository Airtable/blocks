[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: FieldPicker](_airtable_blocks_ui__fieldpicker.md)

# External module: @airtable/blocks/ui: FieldPicker

## Index

### Interfaces

-   [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops)
-   [FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops)
-   [SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops)

### Functions

-   [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker)
-   [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced)

## Interfaces

### FieldPickerProps

• **FieldPickerProps**:

_Defined in
[src/ui/field_picker.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L48)_

Props for the [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker) component. Also
accepts:

-   [SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops)

### `Optional` field

• **field**? : _[Field](_airtable_blocks_models__field.md#field) | null_

_Defined in
[src/ui/field_picker.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L50)_

The selected field model.

---

### FieldPickerSyncedProps

• **FieldPickerSyncedProps**:

_Defined in
[src/ui/field_picker_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker_synced.tsx#L17)_

Props for the [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced) component.
Also accepts:

-   [SharedFieldPickerProps](_airtable_blocks_ui__fieldpicker.md#sharedfieldpickerprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/field_picker_synced.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker_synced.tsx#L19)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected field will always reflect the field id stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new field
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

---

### SharedFieldPickerProps

• **SharedFieldPickerProps**:

_Defined in
[src/ui/field_picker.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L19)_

Props shared between the [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker) and
[FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced) components. Also accepts:

-   [SharedSelectBaseProps](_airtable_blocks_ui__select.md#sharedselectbaseprops)

### `Optional` allowedTypes

• **allowedTypes**? : _Array‹[FieldType](_airtable_blocks_models__field.md#fieldtype)›_

_Defined in
[src/ui/field_picker.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L23)_

An array indicating which field types can be selected.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/field_picker.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L29)_

A function to be called when the selected field changes.

### `Optional` placeholder

• **placeholder**? : _undefined | string_

_Defined in
[src/ui/field_picker.tsx:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L27)_

The placeholder text when no field is selected.

### `Optional` shouldAllowPickingNone

• **shouldAllowPickingNone**? : _undefined | false | true_

_Defined in
[src/ui/field_picker.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L25)_

If set to `true`, the user can unset the selected field.

### `Optional` table

• **table**? : _[Table](_airtable_blocks_models__table.md#table) | null_

_Defined in
[src/ui/field_picker.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L21)_

The parent table model to select fields from. If `null` or `undefined`, the picker won't render.

## Functions

### FieldPicker

▸ **FieldPicker**(`props`: [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops),
`ref`: React.Ref‹HTMLSelectElement›): _null | Element_

_Defined in
[src/ui/field_picker.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker.tsx#L105)_

Dropdown menu component for selecting fields.

**Example:**

```js
import {TablePicker, FieldPicker, useBase} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';
import React, {Fragment, useState} from 'react';

function Block() {
    useBase();
    const [table, setTable] = useState(null);
    const [field, setField] = useState(null);

    const summaryText = field
        ? `The field type for ${field.name} is ${field.type}.`
        : 'No field selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePicker
                    table={table}
                    onChange={newTable => {
                        setTable(newTable);
                        setField(null);
                    }}
                    shouldAllowPickingNone={true}
                />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
                    <FieldPicker
                        table={table}
                        field={field}
                        onChange={newField => setField(newField)}
                        allowedTypes={[
                            fieldTypes.SINGLE_LINE_TEXT,
                            fieldTypes.MULTILINE_TEXT,
                            fieldTypes.EMAIL,
                            fieldTypes.URL,
                            fieldTypes.PHONE_NUMBER,
                        ]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| `props` | [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                             |

**Returns:** _null | Element_

---

### FieldPickerSynced

▸ **FieldPickerSynced**(`props`:
[FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops), `ref`:
React.Ref‹HTMLSelectElement›): _Element_

_Defined in
[src/ui/field_picker_synced.tsx:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/field_picker_synced.tsx#L73)_

A wrapper around the [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker) component that
syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {TablePickerSynced, FieldPickerSynced, useBase, useWatchable} from '@airtable/blocks/ui';
import {fieldTypes} from '@airtable/blocks/models';
import {globalConfig} from '@airtable/blocks';
import React, {Fragment} from 'react';

function Block() {
    const base = useBase();
    const tableId = globalConfig.get('tableId');
    const table = base.getTableByIdIfExists(tableId);
    const fieldId = globalConfig.get('fieldId');
    const field = table.getFieldByIdIfExists(fieldId);
    useWatchable(globalConfig, ['tableId', 'fieldId']);

    const summaryText = field
        ? `The field type for ${field.name} is ${field.type}.`
        : 'No field selected.';
    return (
        <Fragment>
            <p style={{marginBottom: 16}}>{summaryText}</p>
            <label style={{display: 'block', marginBottom: 16}}>
                <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
                <TablePickerSynced globalConfigKey="tableId" shouldAllowPickingNone={true} />
            </label>
            {table && (
                <label>
                    <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
                    <FieldPickerSynced
                        table={table}
                        globalConfigKey="fieldId"
                        allowedTypes={[
                            fieldTypes.SINGLE_LINE_TEXT,
                            fieldTypes.MULTILINE_TEXT,
                            fieldTypes.EMAIL,
                            fieldTypes.URL,
                            fieldTypes.PHONE_NUMBER,
                        ]}
                        shouldAllowPickingNone={true}
                    />
                </label>
            )}
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                                 |
| ------- | ------------------------------------------------------------------------------------ |
| `props` | [FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops) |
| `ref`   | React.Ref‹HTMLSelectElement›                                                         |

**Returns:** _Element_
