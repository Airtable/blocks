[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: TextButton](_airtable_blocks_ui__textbutton.md)

# External module: @airtable/blocks/ui: TextButton

## Index

### Interfaces

-   [TextButtonProps](_airtable_blocks_ui__textbutton.md#textbuttonprops)
-   [TextButtonStyleProps](_airtable_blocks_ui__textbutton.md#textbuttonstyleprops)

### Type aliases

-   [TextButtonVariant](_airtable_blocks_ui__textbutton.md#textbuttonvariant)

### Functions

-   [TextButton](_airtable_blocks_ui__textbutton.md#textbutton)

## Interfaces

### TextButtonProps

• **TextButtonProps**:

_Defined in
[src/ui/text_button.tsx:115](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L115)_

Props for the [TextButton](_airtable_blocks_ui__textbutton.md#textbutton) component. Also supports:

-   [AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops)
-   [TextButtonStyleProps](_airtable_blocks_ui__textbutton.md#textbuttonstyleprops)

### `Optional` aria-selected

• **aria-selected**? : _undefined | false | true_

_Defined in
[src/ui/text_button.tsx:145](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L145)_

The `aria-selected` attribute.

### children

• **children**: _React.ReactNode | string_

_Defined in
[src/ui/text_button.tsx:128](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L128)_

The contents of the button.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/text_button.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L139)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? : _DataAttributesProp_

_Defined in
[src/ui/text_button.tsx:143](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L143)_

Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/text_button.tsx:126](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L126)_

Indicates whether or not the user can interact with the button.

### `Optional` icon

• **icon**? : _IconName | ReactElement_

_Defined in
[src/ui/text_button.tsx:124](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L124)_

The name of the icon or a react node. For more details, see the
[list of supported icons](/packages/sdk/docs/icons.md).

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/text_button.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L135)_

The `id` attribute.

### `Optional` onClick

• **onClick**? : _undefined | function_

_Overrides void_

_Defined in
[src/ui/text_button.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L131)_

Click event handler. Also handles Space and Enter keypress events.

### `Optional` size

• **size**? : _[TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)_

_Defined in
[src/ui/text_button.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L120)_

The size of the button. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/text_button.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L141)_

Additional styles.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/text_button.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L137)_

The `tabIndex` attribute.

### `Optional` variant

• **variant**? : _[TextButtonVariant](_airtable_blocks_ui__textbutton.md#textbuttonvariant)_

_Defined in
[src/ui/text_button.tsx:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L122)_

The variant of the button, which defines the color. Defaults to `default`.

---

### TextButtonStyleProps

• **TextButtonStyleProps**:

_Defined in
[src/ui/text_button.tsx:52](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L52)_

Style props for the [TextButton](_airtable_blocks_ui__textbutton.md#textbutton) component. Also
accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"inline-flex"
| "flex" | "none"›_

_Defined in
[src/ui/text_button.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L60)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

## Type aliases

### TextButtonVariant

Ƭ **TextButtonVariant**: _"default" | "dark" | "light"_

_Defined in
[src/ui/text_button.tsx:98](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L98)_

Variants for the [TextButton](_airtable_blocks_ui__textbutton.md#textbutton) component:

• **default**

Blue text.

• **dark**

Dark gray text.

• **light**

Light gray text.

## Functions

### TextButton

▸ **TextButton**(`props`: [TextButtonProps](_airtable_blocks_ui__textbutton.md#textbuttonprops),
`ref`: React.Ref‹HTMLSpanElement›): _Element_

_Defined in
[src/ui/text_button.tsx:174](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/text_button.tsx#L174)_

A text button component with sizes and variants.

**Example:**

```js
import {TextButton} from '@airtable/blocks/ui';
import React, {Fragment} from 'react';

function TextButtonExample() {
    return (
        <Fragment>
            <TextButton>Default text, for single line text</TextButton>
            <TextButton size="small">Small text button</TextButton>
            <TextButton
                size={{
                    xsmallViewport: 'small',
                    smallViewport: 'small',
                    mediumViewport: 'default',
                    largeViewport: 'large',
                }}
            >
                Responsive text button
            </TextButton>
        </Fragment>
    );
}
```

**Parameters:**

| Name    | Type                                                                  |
| ------- | --------------------------------------------------------------------- |
| `props` | [TextButtonProps](_airtable_blocks_ui__textbutton.md#textbuttonprops) |
| `ref`   | React.Ref‹HTMLSpanElement›                                            |

**Returns:** _Element_
