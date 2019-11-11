[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Icon](_airtable_blocks_ui__icon.md)

# External module: @airtable/blocks/ui: Icon

## Index

### Interfaces

-   [IconProps](_airtable_blocks_ui__icon.md#iconprops)
-   [IconStyleProps](_airtable_blocks_ui__icon.md#iconstyleprops)
-   [SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops)

### Functions

-   [Icon](_airtable_blocks_ui__icon.md#icon)

## Interfaces

### IconProps

• **IconProps**:

_Defined in
[src/ui/icon.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L88)_

Props for the [Icon](_airtable_blocks_ui__icon.md#icon) component. Also accepts:

-   [SharedIconProps](_airtable_blocks_ui__icon.md#sharediconprops)

### name

• **name**: _IconName_

_Defined in
[src/ui/icon.tsx:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L90)_

The name of the icon. For more details, see the
[list of supported icons](/packages/sdk/docs/icons.md).

---

### IconStyleProps

• **IconStyleProps**:

_Defined in
[src/ui/icon.tsx:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L33)_

Style props shared between the [Icon](_airtable_blocks_ui__icon.md#icon) and
[FieldIcon](_airtable_blocks_ui__fieldicon.md#const-fieldicon) components. Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)

---

### SharedIconProps

• **SharedIconProps**:

_Defined in
[src/ui/icon.tsx:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L56)_

Props shared between the [Icon](_airtable_blocks_ui__icon.md#icon) and
[FieldIcon](_airtable_blocks_ui__fieldicon.md#const-fieldicon) components. Also accepts:

-   [IconStyleProps](_airtable_blocks_ui__icon.md#iconstyleprops)

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/icon.tsx:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L62)_

Additional class names to apply to the icon.

### `Optional` fillColor

• **fillColor**? : _undefined | string_

_Defined in
[src/ui/icon.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L60)_

The color of the icon.

### `Optional` pathClassName

• **pathClassName**? : _undefined | string_

_Defined in
[src/ui/icon.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L66)_

Additional class names to apply to the icon path.

### `Optional` pathStyle

• **pathStyle**? : _React.CSSProperties_

_Defined in
[src/ui/icon.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L68)_

Additional styles to apply to the icon path.

### `Optional` size

• **size**? : _number | string_

_Defined in
[src/ui/icon.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L58)_

The width/height of the icon. Defaults to 16.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/icon.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L64)_

Additional styles to apply to the icon.

## Functions

### Icon

▸ **Icon**(`props`: [IconProps](_airtable_blocks_ui__icon.md#iconprops), `ref`:
React.Ref‹SVGSVGElement›): _null | Element_

_Defined in
[src/ui/icon.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/icon.tsx#L107)_

A vector icon from the Airtable icon set.

**Example:**

```js
import {Icon} from '@airtable/blocks/ui';

const MyIcon = <Icon name="heart" />;
```

**Parameters:**

| Name    | Type                                                |
| ------- | --------------------------------------------------- |
| `props` | [IconProps](_airtable_blocks_ui__icon.md#iconprops) |
| `ref`   | React.Ref‹SVGSVGElement›                            |

**Returns:** _null | Element_
