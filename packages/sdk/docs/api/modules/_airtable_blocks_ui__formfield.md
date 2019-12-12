[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: FormField](_airtable_blocks_ui__formfield.md)

# External module: @airtable/blocks/ui: FormField

## Index

### Interfaces

-   [FormFieldProps](_airtable_blocks_ui__formfield.md#formfieldprops)
-   [FormFieldStyleProps](_airtable_blocks_ui__formfield.md#formfieldstyleprops)

### Functions

-   [FormField](_airtable_blocks_ui__formfield.md#formfield)

## Interfaces

### FormFieldProps

• **FormFieldProps**:

_Defined in
[src/ui/form_field.tsx:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L69)_

Props for the [FormField](_airtable_blocks_ui__formfield.md#formfield) component. Also accepts:

-   [FormFieldStyleProps](_airtable_blocks_ui__formfield.md#formfieldstyleprops)

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/form_field.tsx:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L83)_

The contents of the form field.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/form_field.tsx:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L73)_

Additional class names to apply to the form field.

### `Optional` description

• **description**? : _React.ReactNode | string | null_

_Defined in
[src/ui/form_field.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L81)_

The description content for the form field. Displayed beneath the label and above the wrapped
control field.

### `Optional` htmlFor

• **htmlFor**? : _undefined | string_

_Defined in
[src/ui/form_field.tsx:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L79)_

The `for` attribute to be applied to the inner label. By default, the form field will automatically
generate a random ID and set it on both the label and the wrapped input/select. Only use this
property if you want to override the generated ID with your own custom ID.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/form_field.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L71)_

The `id` attribute.

### `Optional` label

• **label**? : _React.ReactNode_

_Defined in
[src/ui/form_field.tsx:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L77)_

The label content for the form field.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/form_field.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L75)_

Additional styles to apply to the form field.

---

### FormFieldStyleProps

• **FormFieldStyleProps**:

_Defined in
[src/ui/form_field.tsx:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L44)_

Style props for the [FormField](_airtable_blocks_ui__formfield.md#formfield) component. Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [SpacingSetProps](_airtable_blocks_ui_system__spacing.md#spacingsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

## Functions

### FormField

▸ **FormField**(`props`: [FormFieldProps](_airtable_blocks_ui__formfield.md#formfieldprops), `ref`:
React.Ref‹HTMLDivElement›): _Element‹›_

_Defined in
[src/ui/form_field.tsx:119](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/form_field.tsx#L119)_

A form field component that wraps any control field, supplying a provided label and optional
description.

This will automatically set up the `for` attribute on the outputted label with the `id` attribute on
the wrapped control field for the following UI components: Label, Select, FieldPicker, ModelPicker,
and ViewPicker. If you'd like to manually override this behavior, you can provide an `htmlFor` prop
to this component and manually set the `id` attribute on your wrapped control to the same value.

**Example:**

```js
import {useBase, Box, FormField, ViewPicker, TablePicker} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function SettingsForm() {
    const base = useBase();
    const [name, setName] = useState('');
    const [table, setTable] = useState(base.tables[0]);
    const [view, setView] = useState(null);
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" width="400px">
            <FormField label="Table" description="Select a table from your base">
                <TablePicker table={table} onChange={setTable} />
            </FormField>
            <FormField label="View" description="Select a view from your table">
                <ViewPicker table={table} view={view} onChange={setView} />
            </FormField>
        </Box>
    );
}
```

**Parameters:**

| Name    | Type                                                               |
| ------- | ------------------------------------------------------------------ |
| `props` | [FormFieldProps](_airtable_blocks_ui__formfield.md#formfieldprops) |
| `ref`   | React.Ref‹HTMLDivElement›                                          |

**Returns:** _Element‹›_
