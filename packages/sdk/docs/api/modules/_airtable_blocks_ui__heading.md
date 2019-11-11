[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Heading](_airtable_blocks_ui__heading.md)

# External module: @airtable/blocks/ui: Heading

## Index

### Interfaces

-   [HeadingProps](_airtable_blocks_ui__heading.md#headingprops)

### Type aliases

-   [HeadingSize](_airtable_blocks_ui__heading.md#headingsize)
-   [HeadingSizeProp](_airtable_blocks_ui__heading.md#headingsizeprop)
-   [HeadingVariant](_airtable_blocks_ui__heading.md#headingvariant)

### Functions

-   [Heading](_airtable_blocks_ui__heading.md#heading)

## Interfaces

### HeadingProps

• **HeadingProps**:

_Defined in
[src/ui/heading.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L100)_

Props for the [Heading](_airtable_blocks_ui__heading.md#heading) component. Also supports:

-   [AllStylesProps](_airtable_blocks_ui_system__all_style_props.md#allstylesprops)
-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)

### `Optional` as

• **as**? : _"h1" | "h2" | "h3" | "h4" | "h5" | "h6"_

_Defined in
[src/ui/heading.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L104)_

The element that is rendered. Defaults to `h3`.

### `Optional` children

• **children**? : _React.ReactNode | string_

_Defined in
[src/ui/heading.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L108)_

The contents of the heading.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/heading.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L116)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? : _DataAttributesProp_

_Defined in
[src/ui/heading.tsx:114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L114)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/heading.tsx:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L110)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/heading.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L102)_

The `role` attribute.

### `Optional` size

• **size**? : _[HeadingSizeProp](_airtable_blocks_ui__heading.md#headingsizeprop)_

_Defined in
[src/ui/heading.tsx:112](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L112)_

The size of the heading. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/heading.tsx:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L118)_

Additional styles.

### `Optional` variant

• **variant**? : _[HeadingVariant](_airtable_blocks_ui__heading.md#headingvariant)_

_Defined in
[src/ui/heading.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L106)_

The variant of the heading. Defaults to `default`.

## Type aliases

### HeadingSize

Ƭ **HeadingSize**: _"small" | "default" | "large" | "xsmall" | "xlarge" | "xxlarge"_

_Defined in
[src/ui/heading.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L26)_

Sizes for the [Heading](_airtable_blocks_ui__heading.md#heading) component.

---

### HeadingSizeProp

Ƭ **HeadingSizeProp**:
_[ResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#responsiveprop)‹[HeadingSize](_airtable_blocks_ui__heading.md#headingsize)›_

_Defined in
[src/ui/heading.tsx:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L32)_

Size prop for the [Heading](_airtable_blocks_ui__heading.md#heading) component.

---

### HeadingVariant

Ƭ **HeadingVariant**: _"default" | "caps"_

_Defined in
[src/ui/heading.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L40)_

Variant prop for the [Heading](_airtable_blocks_ui__heading.md#heading) component. • **default** -
Headings typically used for titles. • **caps** - All-caps headings typically used for field names
and smaller section headings.

## Functions

### Heading

▸ **Heading**(`props`: [HeadingProps](_airtable_blocks_ui__heading.md#headingprops), `ref`:
React.Ref‹HTMLHeadingElement›): _Element_

_Defined in
[src/ui/heading.tsx:147](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/heading.tsx#L147)_

A heading component with sizes and variants.

**Example:**

```js
import {Heading} from '@airtable/blocks/ui';
import React, {Fragment} from 'react';

function HeadingExample() {
    return (
        <Fragment>
            <Heading>Default heading</Heading>
            <Heading size="small" variant="caps">
                Small all caps heading
            </Heading>
            <Heading
                size={{
                    xsmallViewport: 'xsmall',
                    smallViewport: 'xsmall',
                    mediumViewport: 'small',
                    largeViewport: 'default',
                }}
            >
                Responsive heading
            </Heading>
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                         |
| ------- | ------------------------------------------------------------ |
| `props` | [HeadingProps](_airtable_blocks_ui__heading.md#headingprops) |
| `ref`   | React.Ref‹HTMLHeadingElement›                                |

**Returns:** _Element_
