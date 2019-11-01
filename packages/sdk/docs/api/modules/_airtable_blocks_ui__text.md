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

### Variables

-   [Text](_airtable_blocks_ui__text.md#const-text)

## Interfaces

### TextProps

• **TextProps**:

_Defined in
[src/ui/text.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L48)_

### `Optional` aria-controls

• **aria-controls**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-controls](_airtable_blocks_ui_types__aria_props.md#optional-aria-controls)_

_Defined in
[src/ui/types/aria_props.ts:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L14)_

Identifies the element (or elements) whose contents or presence are controlled by the current
element.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-describedby](_airtable_blocks_ui_types__aria_props.md#optional-aria-describedby)_

_Defined in
[src/ui/types/aria_props.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L12)_

Identifies the element (or elements) that describes the current object.

### `Optional` aria-expanded

• **aria-expanded**? : _undefined | false | true | "false" | "true"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-expanded](_airtable_blocks_ui_types__aria_props.md#optional-aria-expanded)_

_Defined in
[src/ui/types/aria_props.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L16)_

Indicates whether the element, or another grouping element it controls, is currently expanded or
collapsed.

### `Optional` aria-haspopup

• **aria-haspopup**? : _undefined | false | true | "grid" | "dialog" | "menu" | "listbox" | "false"
| "true" | "tree"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-haspopup](_airtable_blocks_ui_types__aria_props.md#optional-aria-haspopup)_

_Defined in
[src/ui/types/aria_props.ts:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L18)_

Indicates the availability and type of interactive popup element, such as menu or dialog, that can
be triggered by an element.

### `Optional` aria-hidden

• **aria-hidden**? : _undefined | false | true | "false" | "true"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-hidden](_airtable_blocks_ui_types__aria_props.md#optional-aria-hidden)_

_Defined in
[src/ui/types/aria_props.ts:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L20)_

Indicates whether the element is exposed to an accessibility API.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-label](_airtable_blocks_ui_types__aria_props.md#optional-aria-label)_

_Defined in
[src/ui/types/aria_props.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L8)_

Defines a string value that labels the current element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-labelledby](_airtable_blocks_ui_types__aria_props.md#optional-aria-labelledby)_

_Defined in
[src/ui/types/aria_props.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L10)_

Identifies the element (or elements) that labels the current object.

### `Optional` aria-live

• **aria-live**? : _undefined | "off" | "assertive" | "polite"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-live](_airtable_blocks_ui_types__aria_props.md#optional-aria-live)_

_Defined in
[src/ui/types/aria_props.ts:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L22)_

Indicates that an element will be updated, and describes the types of updates the user agents,
assistive technologies, and user can expect from the live region.

### `Optional` as

• **as**? : _"p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "li" | "em" | "strong" | "kbd"
| "mark" | "q" | "s" | "samp" | "small" | "sub" | "sup" | "time" | "var" | "blockquote"_

_Defined in
[src/ui/text.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L50)_

The element that is rendered. Defaults to `p`.

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/text.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L76)_

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/text.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L84)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? :
_[DataAttributesProp](_airtable_blocks_ui_system__core.md#dataattributesprop)_

_Defined in
[src/ui/text.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L82)_

Data attributes that are spread onto the element `dataAttributes={{'data-*': '...'}}`.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/text.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L78)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/text.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L88)_

The `role` attribute.

### `Optional` size

• **size**? : _[TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)_

_Defined in
[src/ui/text.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L80)_

The `size` of the text. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/text.tsx:86](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L86)_

Additional styles.

### `Optional` variant

• **variant**? : _[TextVariant](_airtable_blocks_ui__text.md#textvariant)_

_Defined in
[src/ui/text.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L74)_

The `variant` of the text. Defaults to `default`.

## Type aliases

### TextSize

Ƭ **TextSize**: _"small" | "default" | "large" | "xlarge"_

_Defined in
[src/ui/text.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L25)_

---

### TextSizeProp

Ƭ **TextSizeProp**: _ResponsiveProp‹[TextSize](_airtable_blocks_ui__text.md#textsize)›_

_Defined in
[src/ui/text.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L28)_

---

### TextVariant

Ƭ **TextVariant**: _"default" | "paragraph"_

_Defined in
[src/ui/text.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L20)_

## Variables

### `Const` Text

• **Text**: _ForwardRefExoticComponent‹[TextProps](_airtable_blocks_ui__text.md#textprops) &
RefAttributes‹HTMLElement››_ = React.forwardRef( ( { as: Component = 'p', size = TextSize.default,
variant = TextVariant.default, children, id, role, dataAttributes, className, style, 'aria-label':
ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, 'aria-controls':
ariaControls, 'aria-expanded': ariaExpanded, 'aria-haspopup': ariaHasPopup, 'aria-hidden':
ariaHidden, 'aria-live': ariaLive, ...styleProps }: TextProps, ref: React.Ref<HTMLElement>, ) => {
const classNameForTextStyle = useTextStyle(size, variant); const classNameForStyleProps =
useStyledSystem({ textColor: 'default', fontFamily: 'default', ...styleProps, }); return (
<Component ref={ref as any} id={id} className={cx(classNameForTextStyle, classNameForStyleProps,
className)} style={style} role={role} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
aria-describedby={ariaDescribedBy} aria-controls={ariaControls} aria-expanded={ariaExpanded}
aria-haspopup={ariaHasPopup} aria-hidden={ariaHidden} aria-live={ariaLive} {...dataAttributes} >
{children} </Component> ); }, )

_Defined in
[src/ui/text.tsx:116](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L116)_

A text component with sizes and variants.

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
