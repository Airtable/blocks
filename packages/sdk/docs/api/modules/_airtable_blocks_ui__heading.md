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

### Variables

-   [Heading](_airtable_blocks_ui__heading.md#const-heading)

## Interfaces

### HeadingProps

• **HeadingProps**:

_Defined in
[src/ui/heading.tsx:86](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L86)_

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

• **as**? : _"h1" | "h2" | "h3" | "h4" | "h5" | "h6"_

_Defined in
[src/ui/heading.tsx:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L90)_

The element that is rendered. Defaults to `h3`.

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/heading.tsx:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L94)_

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/heading.tsx:102](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L102)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? :
_[DataAttributesProp](_airtable_blocks_ui_system__core.md#dataattributesprop)_

_Defined in
[src/ui/heading.tsx:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L100)_

Data attributes that are spread onto the element `dataAttributes={{'data-*': '...'}}`.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/heading.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L96)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/heading.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L88)_

The `role` attribute.

### `Optional` size

• **size**? : _[HeadingSizeProp](_airtable_blocks_ui__heading.md#headingsizeprop)_

_Defined in
[src/ui/heading.tsx:98](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L98)_

The `size` of the heading. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/heading.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L104)_

Additional styles.

### `Optional` variant

• **variant**? : _[HeadingVariant](_airtable_blocks_ui__heading.md#headingvariant)_

_Defined in
[src/ui/heading.tsx:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L92)_

The `variant` of the heading. Defaults to `default`.

## Type aliases

### HeadingSize

Ƭ **HeadingSize**: _"small" | "default" | "large" | "xsmall" | "xlarge" | "xxlarge"_

_Defined in
[src/ui/heading.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L24)_

---

### HeadingSizeProp

Ƭ **HeadingSizeProp**: _ResponsiveProp‹[HeadingSize](_airtable_blocks_ui__heading.md#headingsize)›_

_Defined in
[src/ui/heading.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L28)_

---

### HeadingVariant

Ƭ **HeadingVariant**: _"default" | "caps"_

_Defined in
[src/ui/heading.tsx:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L32)_

## Variables

### `Const` Heading

• **Heading**:
_ForwardRefExoticComponent‹[HeadingProps](_airtable_blocks_ui__heading.md#headingprops) &
RefAttributes‹HTMLHeadingElement››_ = React.forwardRef<HTMLHeadingElement, HeadingProps>( ( { as:
Component = 'h3', size = HeadingSize.default, variant = HeadingVariant.default, children, id, role,
dataAttributes, className, style, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy,
'aria-describedby': ariaDescribedBy, 'aria-controls': ariaControls, 'aria-expanded': ariaExpanded,
'aria-haspopup': ariaHasPopup, 'aria-hidden': ariaHidden, 'aria-live': ariaLive, ...styleProps }:
HeadingProps, ref: React.Ref<HTMLHeadingElement>, ) => { const classNameForHeadingSize =
useHeadingStyle(size, variant); const classNameForStyleProps = useStyledSystem({ fontFamily:
'default', textColor: 'default', ...styleProps, }); return ( <Component ref={ref} id={id}
className={cx(classNameForHeadingSize, classNameForStyleProps, className)} style={style} role={role}
aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy}
aria-controls={ariaControls} aria-expanded={ariaExpanded} aria-haspopup={ariaHasPopup}
aria-hidden={ariaHidden} aria-live={ariaLive} {...dataAttributes} > {children} </Component> ); }, )

_Defined in
[src/ui/heading.tsx:132](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L132)_

A heading component with sizes and variants.

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
