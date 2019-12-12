[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Text](_airtable_blocks_ui__text.md)

# External module: @airtable/blocks/ui: Text

## Index

### Interfaces

-   [TextProps](_airtable_blocks_ui__text.md#textprops)

### Type aliases

-   [TextSize](_airtable_blocks_ui__text.md#textsize)
-   [TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)
-   [TextVariant](_airtable_blocks_ui__text.md#textvariant)

### Functions

-   [Text](_airtable_blocks_ui__text.md#text)

## Interfaces

### TextProps

• **TextProps**:

_Defined in
[src/ui/text.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L66)_

Props for the [Text](_airtable_blocks_ui__text.md#text) component. Also supports:

-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)
-   [AllStylesProps](_airtable_blocks_ui_system__all_style_props.md#allstylesprops)

### `Optional` as

• **as**? : _"p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "li" | "em" | "strong" | "kbd"
| "mark" | "q" | "s" | "samp" | "small" | "sub" | "sup" | "time" | "var" | "blockquote"_

_Defined in
[src/ui/text.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L68)_

The element that is rendered. Defaults to `p`.

### `Optional` children

• **children**? : _React.ReactNode | string_

_Defined in
[src/ui/text.tsx:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L94)_

The contents of the text.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/text.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L102)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? : _DataAttributesProp_

_Defined in
[src/ui/text.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L100)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/text.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L96)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/text.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L106)_

The `role` attribute.

### `Optional` size

• **size**? : _[TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)_

_Defined in
[src/ui/text.tsx:98](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L98)_

The size of the text. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/text.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L104)_

Additional styles.

### `Optional` variant

• **variant**? : _[TextVariant](_airtable_blocks_ui__text.md#textvariant)_

_Defined in
[src/ui/text.tsx:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L92)_

The variant of the text. Defaults to `default`.

## Type aliases

### TextSize

Ƭ **TextSize**: _"small" | "default" | "large" | "xlarge"_

_Defined in
[src/ui/text.tsx:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L37)_

Sizes for the [Text](_airtable_blocks_ui__text.md#text) component.

---

### TextSizeProp

Ƭ **TextSizeProp**:
_[ResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#responsiveprop)‹[TextSize](_airtable_blocks_ui__text.md#textsize)›_

_Defined in
[src/ui/text.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L40)_

---

### TextVariant

Ƭ **TextVariant**: _"default" | "paragraph"_

_Defined in
[src/ui/text.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L30)_

Variants for the [Text](_airtable_blocks_ui__text.md#text) component:

• **default**

Single-line text.

• **paragraph**

Multi-line text such as body copy.

## Functions

### Text

▸ **Text**(`props`: [TextProps](_airtable_blocks_ui__text.md#textprops), `ref`:
React.Ref‹HTMLElement›): _Element‹›_

_Defined in
[src/ui/text.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text.tsx#L135)_

A text component with sizes and variants.

**Example:**

```js
import {Text} from '@airtable/blocks/ui';
import React, {Fragment} from 'react';

function TextExample() {
    return (
        <Fragment>
            <Text>Default text, for single line text</Text>
            <Text size="small" variant="paragraph">
                Small paragraph, for multiline paragraphs
            </Text>
            <Text
                size={{
                    xsmallViewport: 'small',
                    smallViewport: 'small',
                    mediumViewport: 'default',
                    largeViewport: 'large',
                }}
            >
                Responsive text
            </Text>
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                |
| ------- | --------------------------------------------------- |
| `props` | [TextProps](_airtable_blocks_ui__text.md#textprops) |
| `ref`   | React.Ref‹HTMLElement›                              |

**Returns:** _Element‹›_
