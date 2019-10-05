[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Select](_airtable_blocks_ui__select.md)

# External module: @airtable/blocks/ui: Select

## Index

### Classes

-   [Select](_airtable_blocks_ui__select.md#select)
-   [SelectButtons](_airtable_blocks_ui__select.md#selectbuttons)
-   [SelectButtonsSynced](_airtable_blocks_ui__select.md#selectbuttonssynced)
-   [SelectSynced](_airtable_blocks_ui__select.md#selectsynced)

### Type aliases

-   [SelectButtonsProps](_airtable_blocks_ui__select.md#selectbuttonsprops)
-   [SelectButtonsSyncedProps](_airtable_blocks_ui__select.md#selectbuttonssyncedprops)
-   [SelectOption](_airtable_blocks_ui__select.md#selectoption)
-   [SelectProps](_airtable_blocks_ui__select.md#selectprops)
-   [SelectSyncedProps](_airtable_blocks_ui__select.md#selectsyncedprops)

## Classes

### Select

• **Select**:

_Defined in
[src/ui/select.tsx:173](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select.tsx#L173)_

Dropdown menu component. A wrapper around `<select>` that fits in with Airtable's user interface.

**`example`**

```js
import {Select} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function ColorPicker() {
    const [value, setValue] = useState(null);
    return (
        <label>
            <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
            <Select
                onChange={newValue => setValue(newValue)}
                value={value}
                options={[
                    {value: null, label: 'Pick a color...', disabled: true},
                    {value: 'red', label: 'red'},
                    {value: 'green', label: 'green'},
                    {value: 'blue', label: 'blue'},
                ]}
            />
        </label>
    );
}
```

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/select.tsx:207](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select.tsx#L207)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/select.tsx:214](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select.tsx#L214)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/select.tsx:200](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select.tsx#L200)_

**Returns:** _void_

---

### SelectButtons

• **SelectButtons**:

_Defined in
[src/ui/select_buttons.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_buttons.tsx#L114)_

---

### SelectButtonsSynced

• **SelectButtonsSynced**:

_Defined in
[src/ui/select_buttons_synced.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_buttons_synced.tsx#L30)_

---

### SelectSynced

• **SelectSynced**:

_Defined in
[src/ui/select_synced.tsx:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_synced.tsx#L59)_

Dropdown menu component synced with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
A wrapper around `<select>` that fits in with Airtable's user interface.

**`example`**

```js
import {SelectSynced} from '@airtable/blocks/ui';
import React from 'react';

function ColorPickerSynced() {
    return (
        <label>
            <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
            <SelectSynced
                globalConfigKey="color"
                options={[
                    {value: null, label: 'Pick a color...', disabled: true},
                    {value: 'red', label: 'red'},
                    {value: 'green', label: 'green'},
                    {value: 'blue', label: 'blue'},
                ]}
            />
        </label>
    );
}
```

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/select_synced.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_synced.tsx#L82)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/select_synced.tsx:89](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_synced.tsx#L89)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/select_synced.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_synced.tsx#L75)_

**Returns:** _void_

## Type aliases

### SelectButtonsProps

Ƭ **SelectButtonsProps**: _object & object & object_

_Defined in
[src/ui/select_buttons.tsx:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_buttons.tsx#L111)_

**`typedef`** {object} SelectButtonsProps

**`property`** {string | number | boolean | null} [value] The value of the selected option.

**`property`** {Array.<SelectOption>} options The list of select options.

**`property`** {Function} [onChange] A function to be called when the selected option changes.

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the select.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [className] Additional class names to apply to the select.

**`property`** {object} [style] Additional styles to apply to the select.

**`property`** {string} [aria-label] The `aria-label` attribute. Use this if the select is not
referenced by a label element.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### SelectButtonsSyncedProps

Ƭ **SelectButtonsSyncedProps**: _object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/select_buttons_synced.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_buttons_synced.tsx#L26)_

**`typedef`** {object} SelectButtonsSyncedProps

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The selected option will always
reflect the value stored in `globalConfig` for this key. Selecting a new option will update
`globalConfig`.

**`property`** {Array.<SelectOption>} options The list of select options.

**`property`** {Function} [onChange] A function to be called when the selected option changes.

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the select.

**`property`** {number} [tabIndex] The `tabindex` attribute.

**`property`** {string} [className] Additional class names to apply to the select.

**`property`** {object} [style] Additional styles to apply to the select.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### SelectOption

Ƭ **SelectOption**: _Object_

_Defined in
[src/ui/select_and_select_buttons_helpers.ts:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_and_select_buttons_helpers.ts#L26)_

**`typedef`** {object} SelectOption

**`property`** {string | number | boolean | null} value The value for the select option.

**`property`** {React.ReactNode} label The label for the select option.

**`property`** {boolean} [disabled=false] If set to `true`, this option will not be selectable.

---

### SelectProps

Ƭ **SelectProps**: _object & object & object & object_

_Defined in
[src/ui/select.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select.tsx#L112)_

**`typedef`** {object} SelectProps

**`property`** {string | number | boolean | null} [value] The value of the selected option.

**`property`** {Array.<SelectOption>} options The list of select options.

**`property`** {Function} [onChange] A function to be called when the selected option changes.

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

### SelectSyncedProps

Ƭ **SelectSyncedProps**: _object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/select_synced.tsx:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/select_synced.tsx#L31)_

**`typedef`** {object} SelectSyncedProps

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The selected option will always
reflect the value stored in `globalConfig` for this key. Selecting a new option will update
`globalConfig`.

**`property`** {Array.<SelectOption>} options The list of select options.

**`property`** {Function} [onChange] A function to be called when the selected option changes. This
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
