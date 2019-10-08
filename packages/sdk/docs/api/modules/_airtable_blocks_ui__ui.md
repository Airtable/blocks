[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: UI](_airtable_blocks_ui__ui.md)

# External module: @airtable/blocks/ui: UI

## Index

### Type aliases

-   [BoxProps](_airtable_blocks_ui__ui.md#boxprops)
-   [HeadingProps](_airtable_blocks_ui__ui.md#headingprops)
-   [TextProps](_airtable_blocks_ui__ui.md#textprops)

### Functions

-   [Box](_airtable_blocks_ui__ui.md#box)
-   [Heading](_airtable_blocks_ui__ui.md#heading)
-   [Text](_airtable_blocks_ui__ui.md#text)

## Type aliases

### BoxProps

Ƭ **BoxProps**: _object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & TooltipAnchorProps & object_

_Defined in
[src/ui/box.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L28)_

**`typedef`** {object} BoxProps

**`property`** {'div' | 'span' | 'section' | 'main' | 'nav' | 'header' | 'footer' | 'aside' |
'article' | 'address' | 'hgroup' | 'blockquote' | 'figure' | 'figcaption' | 'ol' | 'ul' | 'li' |
'pre'} [as='div'] The element that is rendered. Defaults to `div`.

**`property`** {string} [id] The `id` attribute.

**`property`** {number} [tabIndex] The `tabIndex` attribute.

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

---

### HeadingProps

Ƭ **HeadingProps**: _object & object & object & object & object & object & object & object & object
& object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object_

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

---

### TextProps

Ƭ **TextProps**: _object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object_

_Defined in
[src/ui/text.tsx:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L62)_

**`typedef`** {object} TextProps

**`property`** {'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'li' | 'em' | 'strong' |
'kbd' | 'mark' | 'q' | 's' | 'samp' | 'small' | 'sub' | 'sup' | 'time' | 'var' | 'blockquote'}
[as='p'] The element that is rendered. Defaults to `p`.

**`property`** {'small' | 'default' | 'large' | 'xlarge'} [size='default'] The `size` of the text.
Defaults to `default`. Can be a responsive prop object.

**`property`** {'default' | 'paragraph'} [size='default'] The `variant` of the heading. Defaults to
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

## Functions

### Box

▸ **Box**(`props`: [BoxProps](_airtable_blocks_ui__ui.md#boxprops), `ref`: React.Ref‹HTMLElement›):
_Element_

_Defined in
[src/ui/box.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/box.tsx#L76)_

A box component for creating layouts.

**`reactcomponent`**

**`example`**

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

| Name    | Type                                            |
| ------- | ----------------------------------------------- |
| `props` | [BoxProps](_airtable_blocks_ui__ui.md#boxprops) |
| `ref`   | React.Ref‹HTMLElement›                          |

**Returns:** _Element_

---

### Heading

▸ **Heading**(`props`: [HeadingProps](_airtable_blocks_ui__ui.md#headingprops), `ref`:
React.Ref‹HTMLHeadingElement›): _Element_

_Defined in
[src/ui/heading.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/heading.tsx#L139)_

A heading component with sizes and variants.

**`reactcomponent`**

**`example`**

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

| Name    | Type                                                    |
| ------- | ------------------------------------------------------- |
| `props` | [HeadingProps](_airtable_blocks_ui__ui.md#headingprops) |
| `ref`   | React.Ref‹HTMLHeadingElement›                           |

**Returns:** _Element_

---

### Text

▸ **Text**(`props`: [TextProps](_airtable_blocks_ui__ui.md#textprops), `ref`:
React.Ref‹HTMLElement›): _Element_

_Defined in
[src/ui/text.tsx:123](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text.tsx#L123)_

A text component with sizes and variants.

**`reactcomponent`**

**`example`**

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

| Name    | Type                                              |
| ------- | ------------------------------------------------- |
| `props` | [TextProps](_airtable_blocks_ui__ui.md#textprops) |
| `ref`   | React.Ref‹HTMLElement›                            |

**Returns:** _Element_
