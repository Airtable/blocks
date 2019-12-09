[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Label](_airtable_blocks_ui__label.md)

# External module: @airtable/blocks/ui: Label

## Index

### Interfaces

-   [LabelProps](_airtable_blocks_ui__label.md#labelprops)

### Functions

-   [Label](_airtable_blocks_ui__label.md#label)

## Interfaces

### LabelProps

• **LabelProps**:

_Defined in
[src/ui/label.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L18)_

Props for the [Label](_airtable_blocks_ui__label.md#label) component. Also accepts:

-   [AllStylesProps](_airtable_blocks_ui_system__all_style_props.md#allstylesprops)
-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)

### `Optional` children

• **children**? : _React.ReactNode | string_

_Defined in
[src/ui/label.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L26)_

The contents of the label.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/label.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L28)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? : _DataAttributesProp_

_Defined in
[src/ui/label.tsx:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L32)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### `Optional` htmlFor

• **htmlFor**? : _undefined | string_

_Defined in
[src/ui/label.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L22)_

The `for` attribute. Should contain the `id` of the input.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/label.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L24)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/label.tsx:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L34)_

The `role` attribute.

### `Optional` size

• **size**? : _[TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)_

_Defined in
[src/ui/label.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L20)_

The size of the label. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/label.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L30)_

Additional styles.

## Functions

### Label

▸ **Label**(`props`: [LabelProps](_airtable_blocks_ui__label.md#labelprops), `ref`:
React.Ref‹HTMLLabelElement›): _Element‹›_

_Defined in
[src/ui/label.tsx:55](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/label.tsx#L55)_

A label component.

**Example:**

```js
import {Label, Input} from '@airtable/blocks/ui';
import React, {Fragment} from 'react';

function LabelExample() {
    return (
        <Fragment>
            <Label htmlFor="my-input">Label</Label>
            <Input id="my-input" onChange={() => {}} value="" />
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                   |
| ------- | ------------------------------------------------------ |
| `props` | [LabelProps](_airtable_blocks_ui__label.md#labelprops) |
| `ref`   | React.Ref‹HTMLLabelElement›                            |

**Returns:** _Element‹›_
