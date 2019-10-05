[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: FieldPicker](_airtable_blocks_ui__fieldpicker.md)

# External module: @airtable/blocks/ui: FieldPicker

## Index

### Classes

-   [FieldPicker](_airtable_blocks_ui__fieldpicker.md#fieldpicker)
-   [FieldPickerSynced](_airtable_blocks_ui__fieldpicker.md#fieldpickersynced)

### Type aliases

-   [FieldPickerProps](_airtable_blocks_ui__fieldpicker.md#fieldpickerprops)
-   [FieldPickerSyncedProps](_airtable_blocks_ui__fieldpicker.md#fieldpickersyncedprops)

## Classes

### FieldPicker

• **FieldPicker**:

_Defined in
[src/ui/field_picker.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker.tsx#L114)_

Dropdown menu component for selecting fields.

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/field_picker.tsx:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker.tsx#L142)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/field_picker.tsx:149](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker.tsx#L149)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/field_picker.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker.tsx#L135)_

**Returns:** _void_

---

### FieldPickerSynced

• **FieldPickerSynced**:

_Defined in
[src/ui/field_picker_synced.tsx:86](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker_synced.tsx#L86)_

Dropdown menu component for selecting fields, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/field_picker_synced.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker_synced.tsx#L108)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/field_picker_synced.tsx:115](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker_synced.tsx#L115)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/field_picker_synced.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker_synced.tsx#L101)_

**Returns:** _void_

## Type aliases

### FieldPickerProps

Ƭ **FieldPickerProps**: _object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/field_picker.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker.tsx#L60)_

**`typedef`** {object} FieldPickerProps

**`property`** {Field} [field] The selected field model.

**`property`** {Table} [table] The parent table model to select fields from. If `null` or
`undefined`, the picker won't render.

**`property`** {Array.<FieldType>} [allowedTypes] An array indicating which field types can be
selected.

**`property`** {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected
field.

**`property`** {string} [placeholder='Pick a field...'] The placeholder text when no field is
selected.

**`property`** {Function} [onChange] A function to be called when the selected field changes.

**`property`** {string} [autoFocus] The `autoFocus` attribute.

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the select.

**`property`** {string} [id] The `id` attribute.

**`property`** {string} [name] The `name` attribute.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [className] Additional class names to apply to the select.

**`property`** {object} [style] Additional styles to apply to the select.

**`property`** {string} [aria-label] The `aria-label` attribute. Use this if the select is not
referenced by a label element.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### FieldPickerSyncedProps

Ƭ **FieldPickerSyncedProps**: _object & object & object & object & object & object & object & object
& object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/field_picker_synced.tsx:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/field_picker_synced.tsx#L33)_

**`typedef`** {object} FieldPickerSyncedProps

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The selected field will always
reflect the field id stored in `globalConfig` for this key. Selecting a new field will update
`globalConfig`.

**`property`** {Table} [table] The parent table model to select fields from. If `null` or
`undefined`, the picker won't render.

**`property`** {Array.<FieldType>} [allowedTypes] An array indicating which field types can be
selected.

**`property`** {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected
field.

**`property`** {string} [placeholder='Pick a field...'] The placeholder text when no field is
selected.

**`property`** {Function} [onChange] A function to be called when the selected field changes. This
should only be used for side effects.

**`property`** {string} [autoFocus] The `autoFocus` attribute.

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the select.

**`property`** {string} [id] The `id` attribute.

**`property`** {string} [name] The `name` attribute.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [className] Additional class names to apply to the select.

**`property`** {object} [style] Additional styles to apply to the select.

**`property`** {string} [aria-label] The `aria-label` attribute. Use this if the select is not
referenced by a label element.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.
