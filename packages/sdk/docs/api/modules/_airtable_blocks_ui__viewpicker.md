[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ViewPicker](_airtable_blocks_ui__viewpicker.md)

# External module: @airtable/blocks/ui: ViewPicker

## Index

### Classes

-   [ViewPicker](_airtable_blocks_ui__viewpicker.md#viewpicker)
-   [ViewPickerSynced](_airtable_blocks_ui__viewpicker.md#viewpickersynced)

### Type aliases

-   [ViewPickerProps](_airtable_blocks_ui__viewpicker.md#viewpickerprops)
-   [ViewPickerSyncedProps](_airtable_blocks_ui__viewpicker.md#viewpickersyncedprops)

## Classes

### ViewPicker

• **ViewPicker**:

_Defined in
[src/ui/view_picker.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker.tsx#L110)_

Dropdown menu component for selecting views.

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/view_picker.tsx:138](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker.tsx#L138)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/view_picker.tsx:145](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker.tsx#L145)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/view_picker.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker.tsx#L131)_

**Returns:** _void_

---

### ViewPickerSynced

• **ViewPickerSynced**:

_Defined in
[src/ui/view_picker_synced.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker_synced.tsx#L82)_

Dropdown menu component for selecting views, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**`example`**

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

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/view_picker_synced.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker_synced.tsx#L104)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/view_picker_synced.tsx:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker_synced.tsx#L111)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/view_picker_synced.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker_synced.tsx#L97)_

**Returns:** _void_

## Type aliases

### ViewPickerProps

Ƭ **ViewPickerProps**: _object & object & object & TooltipAnchorProps‹HTMLElement› & object & object
& object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object_

_Defined in
[src/ui/view_picker.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker.tsx#L60)_

**`typedef`** {object} ViewPickerProps

**`property`** {View} [view] The selected view model.

**`property`** {Table} [table] The parent table model to select views from. If `null` or
`undefined`, the picker won't render.

**`property`** {Array.<ViewType>} [allowedTypes] An array indicating which view types can be
selected.

**`property`** {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected
view.

**`property`** {string} [placeholder='Pick a view...'] The placeholder text when no view is
selected.

**`property`** {Function} [onChange] A function to be called when the selected view changes.

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

### ViewPickerSyncedProps

Ƭ **ViewPickerSyncedProps**: _object & object & object & TooltipAnchorProps‹HTMLElement› & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object_

_Defined in
[src/ui/view_picker_synced.tsx:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/view_picker_synced.tsx#L33)_

**`typedef`** {object} ViewPickerSyncedProps

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The selected view will always
reflect the view id stored in `globalConfig` for this key. Selecting a new view will update
`globalConfig`.

**`property`** {Table} [table] The parent table model to select views from. If `null` or
`undefined`, the picker won't render.

**`property`** {Array.<ViewType>} [allowedTypes] An array indicating which view types can be
selected.

**`property`** {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected
view.

**`property`** {string} [placeholder='Pick a view...'] The placeholder text when no view is
selected.

**`property`** {Function} [onChange] A function to be called when the selected view changes. This
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
