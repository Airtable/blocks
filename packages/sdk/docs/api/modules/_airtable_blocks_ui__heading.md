[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Heading](_airtable_blocks_ui__heading.md)

# External module: @airtable/blocks/ui: Heading

## Index

### Interfaces

-   [HeadingProps](_airtable_blocks_ui__heading.md#headingprops)

### Functions

-   [Heading](_airtable_blocks_ui__heading.md#heading)

## Interfaces

### HeadingProps

• **HeadingProps**:

_Defined in
[src/ui/heading.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L99)_

**`typedef`** {object} HeadingProps

**`property`** {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} [as='h3'] The element that is rendered.
Defaults to `h3`.

**`property`** {'xsmall' | 'small' | 'default' | 'large' | 'xlarge' | 'xxlarge'} [size='default']
The `size` of the heading. Defaults to `default`. Can be a responsive prop object.

**`property`** {'default' | 'caps'} [size='default'] The `variant` of the heading. Defaults to
`default`.

**`property`** {string} [role] The `role` attribute.

**`property`** {string} [className] Additional class names to apply, separated by spaces.

**`property`** {object} [style] Additional styles.

**`property`** {object} [dataAttributes] Data attributes that are spread onto the element
`dataAttributes={{'data-*': '...'}}`.

**`property`** {string} [aria-label] The `aria-label` attribute.

**`property`** {string} [aria-labelledby] The `aria-labelledby` attribute. A space separated list of
label element IDs.

**`property`** {string} [aria-describedby] The `aria-describedby` attribute. A space separated list
of description element IDs.

**`property`** {string} [aria-controls] The `aria-controls` attribute.

**`property`** {string} [aria-expanded] The `aria-expanded` attribute.

**`property`** {string} [aria-haspopup] The `aria-haspopup` attribute.

**`property`** {string} [aria-hidden] The `aria-hidden` attribute.

**`property`** {string} [aria-live] The `aria-live` attribute.

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

## Functions

### Heading

▸ **Heading**(`props`: [HeadingProps](_airtable_blocks_ui__heading.md#headingprops), `ref`:
React.Ref‹HTMLHeadingElement›): _Element_

_Defined in
[src/ui/heading.tsx:136](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L136)_

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

**Parameters:**

| Name    | Type                                                         |
| ------- | ------------------------------------------------------------ |
| `props` | [HeadingProps](_airtable_blocks_ui__heading.md#headingprops) |
| `ref`   | React.Ref‹HTMLHeadingElement›                                |

**Returns:** _Element_
