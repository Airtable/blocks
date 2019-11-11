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
[src/ui/box.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L18)_

Props for the Box component. Also accepts:

-   [AllStylesProps](_airtable_blocks_ui_system__all_style_props.md#allstylesprops)
-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)

### `Optional` as

• **as**? : _"div" | "span" | "section" | "main" | "nav" | "header" | "footer" | "aside" | "article"
| "address" | "hgroup" | "blockquote" | "figure" | "figcaption" | "ol" | "ul" | "li" | "pre"_

_Defined in
[src/ui/box.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L20)_

The element that is rendered. Defaults to `div`.

### `Optional` children

• **children**? : _React.ReactNode | string_

_Defined in
[src/ui/box.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L40)_

The contents of the box.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/box.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L48)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? : _DataAttributesProp_

_Defined in
[src/ui/box.tsx:52](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L52)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/box.tsx:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L46)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/box.tsx:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L44)_

The `role` attribute.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/box.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L50)_

Additional styles.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/box.tsx:42](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L42)_

The `tabIndex` attribute.

## Functions

### Box

▸ **Box**(`props`: [BoxProps](_airtable_blocks_ui__box.md#boxprops), `ref`: React.Ref‹HTMLElement›):
_Element_

_Defined in
[src/ui/box.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/box.tsx#L72)_

A box component for creating layouts.

**Example:**

```js
import {Box} from '@airtable/blocks/ui';
import React from 'react';

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
