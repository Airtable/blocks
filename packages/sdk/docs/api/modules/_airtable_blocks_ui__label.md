[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Label](_airtable_blocks_ui__label.md)

# External module: @airtable/blocks/ui: Label

## Index

### Interfaces

-   [LabelProps](_airtable_blocks_ui__label.md#labelprops)

### Variables

-   [Label](_airtable_blocks_ui__label.md#const-label)

## Interfaces

### LabelProps

• **LabelProps**:

_Defined in
[src/ui/label.tsx:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L12)_

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

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/label.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L20)_

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/label.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L22)_

Additional class names to apply, separated by spaces.

### `Optional` dataAttributes

• **dataAttributes**? :
_[DataAttributesProp](_airtable_blocks_ui_system__core.md#dataattributesprop)_

_Defined in
[src/ui/label.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L26)_

Data attributes that are spread onto the element `dataAttributes={{'data-*': '...'}}`.

### `Optional` htmlFor

• **htmlFor**? : _undefined | string_

_Defined in
[src/ui/label.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L16)_

The `for` attribute. Should contain the `id` of the input.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/label.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L18)_

The `id` attribute.

### `Optional` role

• **role**? : _undefined | string_

_Defined in
[src/ui/label.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L28)_

The `role` attribute.

### `Optional` size

• **size**? : _[TextSizeProp](_airtable_blocks_ui__text.md#textsizeprop)_

_Defined in
[src/ui/label.tsx:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L14)_

The `size` of the label. Defaults to `default`. Can be a responsive prop object.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/label.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L24)_

Additional styles.

## Variables

### `Const` Label

• **Label**: _ForwardRefExoticComponent‹[LabelProps](_airtable_blocks_ui__label.md#labelprops) &
RefAttributes‹HTMLLabelElement››_ = React.forwardRef<HTMLLabelElement, LabelProps>( ( { size =
TextSize.default, htmlFor, id, children, className, style, dataAttributes, role, 'aria-label':
ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, 'aria-controls':
ariaControls, 'aria-expanded': ariaExpanded, 'aria-haspopup': ariaHasPopup, 'aria-hidden':
ariaHidden, 'aria-live': ariaLive, ...styleProps }: LabelProps, ref: React.Ref<HTMLLabelElement>, )
=> { const classNameForTextStyle = useTextStyle(size); const classNameForStyleProps =
useStyledSystem({ display: 'inline-block', textColor: 'light', fontWeight: 'strong', marginBottom:
'6px', ...styleProps, }); return ( <label ref={ref} htmlFor={htmlFor} id={id}
className={cx(classNameForTextStyle, classNameForStyleProps, className)} style={style} role={role}
aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy}
aria-controls={ariaControls} aria-expanded={ariaExpanded} aria-haspopup={ariaHasPopup}
aria-hidden={ariaHidden} aria-live={ariaLive} {...dataAttributes} > {children} </label> ); }, )

_Defined in
[src/ui/label.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L48)_

A label component.

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
