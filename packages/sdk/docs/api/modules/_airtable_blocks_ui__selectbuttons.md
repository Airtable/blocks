[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: SelectButtons](_airtable_blocks_ui__selectbuttons.md)

# External module: @airtable/blocks/ui: SelectButtons

## Index

### Interfaces

-   [SelectButtonsProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonsprops)
-   [SelectButtonsStyleProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonsstyleprops)
-   [SelectButtonsSyncedProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonssyncedprops)
-   [SharedSelectButtonsProps](_airtable_blocks_ui__selectbuttons.md#sharedselectbuttonsprops)

### Functions

-   [SelectButtons](_airtable_blocks_ui__selectbuttons.md#selectbuttons)
-   [SelectButtonsSynced](_airtable_blocks_ui__selectbuttons.md#selectbuttonssynced)

## Interfaces

### SelectButtonsProps

• **SelectButtonsProps**:

_Defined in
[src/ui/select_buttons.tsx:147](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L147)_

Props for the [SelectButtons](_airtable_blocks_ui__selectbuttons.md#selectbuttons) component. Also
accepts:

-   [SharedSelectButtonsProps](_airtable_blocks_ui__selectbuttons.md#sharedselectbuttonsprops)

### value

• **value**: _[SelectOptionValue](_airtable_blocks_ui__select.md#selectoptionvalue)_

_Defined in
[src/ui/select_buttons.tsx:149](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L149)_

The value of the selected option.

---

### SelectButtonsStyleProps

• **SelectButtonsStyleProps**:

_Defined in
[src/ui/select_buttons.tsx:67](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L67)_

Style props shared between the [SelectButtons](_airtable_blocks_ui__selectbuttons.md#selectbuttons)
and [SelectButtonsSynced](_airtable_blocks_ui__selectbuttons.md#selectbuttonssynced) components.
Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

---

### SelectButtonsSyncedProps

• **SelectButtonsSyncedProps**:

_Defined in
[src/ui/select_buttons_synced.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons_synced.tsx#L18)_

Props for the [SelectButtonsSynced](_airtable_blocks_ui__selectbuttons.md#selectbuttonssynced)
component. Also accepts:

-   [SharedSelectButtonsProps](_airtable_blocks_ui__selectbuttons.md#sharedselectbuttonsprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/select_buttons_synced.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons_synced.tsx#L20)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected option will always reflect the value stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new option
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

---

### SharedSelectButtonsProps

• **SharedSelectButtonsProps**:

_Defined in
[src/ui/select_buttons.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L99)_

Props shared between the [SelectButtons](_airtable_blocks_ui__selectbuttons.md#selectbuttons) and
[SelectButtonsSynced](_airtable_blocks_ui__selectbuttons.md#selectbuttonssynced) components. Also
accepts:

-   [SelectButtonsStyleProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonsstyleprops)

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/select_buttons.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L117)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Defined in
[src/ui/select_buttons.tsx:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L113)_

The `aria-label` attribute. Use this if the select is not referenced by a label element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/select_buttons.tsx:115](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L115)_

A space separated list of label element IDs.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/select_buttons.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L107)_

Additional class names to apply to the select.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/select_buttons.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L105)_

If set to `true`, the user cannot interact with the select.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/select_buttons.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L103)_

A function to be called when the selected option changes.

### options

• **options**: _Array‹[SelectOption](_airtable_blocks_ui__select.md#selectoption)›_

_Defined in
[src/ui/select_buttons.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L101)_

The list of select options.

### `Optional` size

• **size**? : _[ControlSizeProp](_airtable_blocks_ui_system__control_sizes.md#controlsizeprop)_

_Defined in
[src/ui/select_buttons.tsx:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L109)_

The size of the select buttons.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/select_buttons.tsx:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L111)_

Additional styles to apply to the select.

## Functions

### SelectButtons

▸ **SelectButtons**(`props`:
[SelectButtonsProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonsprops), `ref`:
React.Ref‹HTMLDivElement›): _Element_

_Defined in
[src/ui/select_buttons.tsx:176](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons.tsx#L176)_

A segmented control for selecting one value from a set of options.

**Example:**

```js
import {SelectButtons} from '@airtable/blocks/ui';
import React from 'react';

function ChartTypePicker() {
    const [chartType, setChartType] = useState('bar');
    return (
        <SelectButtons
            value={chartType}
            options={[
                {value: 'bar', label: 'Bar'},
                {value: 'line', label: 'Line'},
                {value: 'scatter', label: 'Scatter'},
            ]}
            onChange={setChartType}
        />
    );
}
```

**Parameters:**

| Name    | Type                                                                           |
| ------- | ------------------------------------------------------------------------------ |
| `props` | [SelectButtonsProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonsprops) |
| `ref`   | React.Ref‹HTMLDivElement›                                                      |

**Returns:** _Element_

---

### SelectButtonsSynced

▸ **SelectButtonsSynced**(`props`:
[SelectButtonsSyncedProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonssyncedprops), `ref`:
React.Ref‹HTMLDivElement›): _Element_

_Defined in
[src/ui/select_buttons_synced.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/select_buttons_synced.tsx#L45)_

A wrapper around the [SelectButtons](_airtable_blocks_ui__selectbuttons.md#selectbuttons) component
that syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {SelectButtonsSynced} from '@airtable/blocks/ui';
import React from 'react';

function ChartTypePicker() {
    return (
        <SelectButtonsSynced
            globalConfigKey="chartType"
            options={[
                {value: 'bar', label: 'Bar'},
                {value: 'line', label: 'Line'},
                {value: 'scatter', label: 'Scatter'},
            ]}
        />
    );
}
```

**Parameters:**

| Name    | Type                                                                                       |
| ------- | ------------------------------------------------------------------------------------------ |
| `props` | [SelectButtonsSyncedProps](_airtable_blocks_ui__selectbuttons.md#selectbuttonssyncedprops) |
| `ref`   | React.Ref‹HTMLDivElement›                                                                  |

**Returns:** _Element_
