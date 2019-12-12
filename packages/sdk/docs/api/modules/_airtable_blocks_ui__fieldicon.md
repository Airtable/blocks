[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: FieldIcon](_airtable_blocks_ui__fieldicon.md)

# External module: @airtable/blocks/ui: FieldIcon

## Index

### Interfaces

-   [FieldIconProps](_airtable_blocks_ui__fieldicon.md#fieldiconprops)

### Functions

-   [FieldIcon](_airtable_blocks_ui__fieldicon.md#const-fieldicon)

## Interfaces

### FieldIconProps

• **FieldIconProps**:

_Defined in
[src/ui/field_icon.tsx:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_icon.tsx#L14)_

Props for the [FieldIcon](_airtable_blocks_ui__fieldicon.md#const-fieldicon) component. Also
accepts:

-   [IconStyleProps](_airtable_blocks_ui__icon.md#iconstyleprops)

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops).[className](_airtable_blocks_ui__icon.md#optional-classname)_

_Defined in
[src/ui/icon.tsx:55](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/icon.tsx#L55)_

Additional class names to apply to the icon.

### field

• **field**: _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/ui/field_icon.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_icon.tsx#L16)_

The field model to display an icon for.

### `Optional` fillColor

• **fillColor**? : _undefined | string_

_Inherited from
[SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops).[fillColor](_airtable_blocks_ui__icon.md#optional-fillcolor)_

_Defined in
[src/ui/icon.tsx:53](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/icon.tsx#L53)_

The color of the icon.

### `Optional` pathClassName

• **pathClassName**? : _undefined | string_

_Inherited from
[SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops).[pathClassName](_airtable_blocks_ui__icon.md#optional-pathclassname)_

_Defined in
[src/ui/icon.tsx:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/icon.tsx#L59)_

Additional class names to apply to the icon path.

### `Optional` pathStyle

• **pathStyle**? : _React.CSSProperties_

_Inherited from
[SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops).[pathStyle](_airtable_blocks_ui__icon.md#optional-pathstyle)_

_Defined in
[src/ui/icon.tsx:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/icon.tsx#L61)_

Additional styles to apply to the icon path.

### `Optional` size

• **size**? : _number | string_

_Inherited from
[SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops).[size](_airtable_blocks_ui__icon.md#optional-size)_

_Defined in
[src/ui/icon.tsx:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/icon.tsx#L51)_

The width/height of the icon. Defaults to 16.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops).[style](_airtable_blocks_ui__icon.md#optional-style)_

_Defined in
[src/ui/icon.tsx:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/icon.tsx#L57)_

Additional styles to apply to the icon.

## Functions

### `Const` FieldIcon

▸ **FieldIcon**(`props`: [FieldIconProps](_airtable_blocks_ui__fieldicon.md#fieldiconprops)):
_Element‹›_

_Defined in
[src/ui/field_icon.tsx:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/field_icon.tsx#L48)_

A vector icon for a field's type.

**Parameters:**

| Name    | Type                                                               |
| ------- | ------------------------------------------------------------------ |
| `props` | [FieldIconProps](_airtable_blocks_ui__fieldicon.md#fieldiconprops) |

**Returns:** _Element‹›_
