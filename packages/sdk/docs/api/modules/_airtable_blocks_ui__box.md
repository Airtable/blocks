[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Box](_airtable_blocks_ui__box.md)

# External module: @airtable/blocks/ui: Box

## Index

### Interfaces

-   [BoxProps](_airtable_blocks_ui__box.md#boxprops)

### Functions

-   [Box](_airtable_blocks_ui__box.md#box)

## Interfaces

### BoxProps

• **BoxProps**:

_Defined in
[src/ui/box.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L16)_

Props for the Box component. Also accepts:

-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)
-   [AllStylesProps](_airtable_blocks_ui_system__all_style_props.md#allstylesprops)

### `Optional` as

• **as**? : _"div" | "span" | "section" | "main" | "nav" | "header" | "footer" | "aside" | "article"
| "address" | "hgroup" | "blockquote" | "figure" | "figcaption" | "ol" | "ul" | "li" | "pre"_

_Defined in
[src/ui/box.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L18)_

The element that is rendered. Defaults to `div`.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/box.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L45)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? : _undefined | object_

_Defined in
[src/ui/box.tsx:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L49)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/box.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L43)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/box.tsx:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L41)_

The `role` attribute.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/box.tsx:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L47)_

Additional styles.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/box.tsx:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L39)_

The `tabIndex` attribute.

## Functions

### Box

▸ **Box**(`props`: [BoxProps](_airtable_blocks_ui__box.md#boxprops), `ref`: React.Ref‹HTMLElement›):
_Element_

_Defined in
[src/ui/box.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L68)_

A box component for creating layouts.

```js
import {Box} from '@airtable/blocks/ui';
import React, {Fragment} from 'react';

function BoxExample() {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" padding={3} margin={3}>
            Hello world
        </Box>
    );
}
```

**Parameters:**

| Name    | Type                                             |
| ------- | ------------------------------------------------ |
| `props` | [BoxProps](_airtable_blocks_ui__box.md#boxprops) |
| `ref`   | React.Ref‹HTMLElement›                           |

**Returns:** _Element_
