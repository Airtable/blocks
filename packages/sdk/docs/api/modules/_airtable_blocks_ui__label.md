[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Label](_airtable_blocks_ui__label.md)

# External module: @airtable/blocks/ui: Label

## Index

### Type aliases

-   [LabelProps](_airtable_blocks_ui__label.md#labelprops)

### Functions

-   [Label](_airtable_blocks_ui__label.md#label)

## Type aliases

### LabelProps

Ƭ **LabelProps**: _object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object_

_Defined in
[src/ui/label.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L30)_

**`typedef`** {object} LabelProps

**`property`** {'small' | 'default' | 'large' | 'xlarge'} [size='default'] The `size` of the label.
Defaults to `default`. Can be a responsive prop object.

**`property`** {string} [htmlFor] The `for` attribute. Should contain the `id` of the input.

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

### Label

▸ **Label**(`props`: [LabelProps](_airtable_blocks_ui__label.md#labelprops), `ref`:
React.Ref‹HTMLLabelElement›): _Element_

_Defined in
[src/ui/label.tsx:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/label.tsx#L61)_

A label component.

**`reactcomponent`**

**`example`**

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

**Parameters:**

| Name    | Type                                                   |
| ------- | ------------------------------------------------------ |
| `props` | [LabelProps](_airtable_blocks_ui__label.md#labelprops) |
| `ref`   | React.Ref‹HTMLLabelElement›                            |

**Returns:** _Element_
