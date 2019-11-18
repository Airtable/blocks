[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: colorUtils](_airtable_blocks_ui__colorutils.md)

# External module: @airtable/blocks/ui: colorUtils

## Index

### Interfaces

-   [ColorUtils](_airtable_blocks_ui__colorutils.md#colorutils)
-   [RGB](_airtable_blocks_ui__colorutils.md#rgb)

## Interfaces

### ColorUtils

• **ColorUtils**:

_Defined in
[src/color_utils.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/color_utils.ts#L16)_

Utilities for working with [Color](_airtable_blocks_ui__colors.md#color) names from the {@link
colors} enum.

### shouldUseLightTextOnColor

▸ **shouldUseLightTextOnColor**(`colorString`: string): _boolean_

_Defined in
[src/color_utils.ts:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/color_utils.ts#L73)_

Given a [Color](_airtable_blocks_ui__colors.md#color), returns true or false to indicate whether
that color should have light text on top of it when used as a background color.

**Example:**

```js
import {colorUtils, colors} from '@airtable/blocks/ui';

colorUtils.shouldUseLightTextOnColor(colors.PINK_LIGHT_1);
// => false

colorUtils.shouldUseLightTextOnColor(colors.PINK_DARK_1);
// => true
```

**Parameters:**

| Name          | Type   |
| ------------- | ------ |
| `colorString` | string |

**Returns:** _boolean_

boolean

---

### RGB

• **RGB**:

_Defined in
[src/color_utils.ts:6](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/color_utils.ts#L6)_

A red/green/blue color object. Each property is a number from 0 to 255.

### b

• **b**: _number_

_Defined in
[src/color_utils.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/color_utils.ts#L12)_

The blue component.

### g

• **g**: _number_

_Defined in
[src/color_utils.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/color_utils.ts#L10)_

The green component.

### r

• **r**: _number_

_Defined in
[src/color_utils.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/color_utils.ts#L8)_

The red component.
