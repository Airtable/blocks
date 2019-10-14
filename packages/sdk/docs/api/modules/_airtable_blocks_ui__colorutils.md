[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: colorUtils](_airtable_blocks_ui__colorutils.md)

# External module: @airtable/blocks/ui: colorUtils

## Index

### Type aliases

-   [RGB](_airtable_blocks_ui__colorutils.md#rgb)

### Object literals

-   [colorUtils](_airtable_blocks_ui__colorutils.md#const-colorutils)

## Type aliases

### RGB

Ƭ **RGB**: _Object_

_Defined in
[src/color_utils.ts:6](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/color_utils.ts#L6)_

**`typedef`**

## Object literals

### `Const` colorUtils

### ▪ **colorUtils**: _object_

_Defined in
[src/color_utils.ts:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/color_utils.ts#L13)_

Utilities for working with [Color](_airtable_blocks_ui__colors.md#color) names from the {@link
colors} enum.

### getHexForColor

• **getHexForColor**: _function & function_ = ((colorString: string) => { const color =
getEnumValueIfExists(Colors, colorString); if (!color) { return null; } const rgbTuple =
rgbTuplesByColor[color];

        const hexNumber = (rgbTuple[0] << 16) | (rgbTuple[1] << 8) | rgbTuple[2];
        return `#${hexNumber.toString(16).padStart(6, '0')}`;
    }) as GetHexForColorType

_Defined in
[src/color_utils.ts:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/color_utils.ts#L31)_

Given a [Color](_airtable_blocks_ui__colors.md#color), return the hex color value for that color, or
null if the value isn't a [Color](_airtable_blocks_ui__colors.md#color)

**`function`**

**`param`**

**`returns`** the color hex string or null

**`example`**

```js
import {colorUtils, colors} from '@airtable/blocks/ui';

colorUtils.getHexForColor(colors.RED);
// => '#ef3061'

colorUtils.getHexForColor('uncomfortable beige');
// => null
```

### getRgbForColor

• **getRgbForColor**: _function & function_ = ((colorString: string) => { const color =
getEnumValueIfExists(Colors, colorString); if (!color) { return null; } const rgbTuple =
rgbTuplesByColor[color]; return {r: rgbTuple[0], g: rgbTuple[1], b: rgbTuple[2]}; }) as
GetRgbForColorType

_Defined in
[src/color_utils.ts:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/color_utils.ts#L58)_

Given a [Color](_airtable_blocks_ui__colors.md#color), return an
[RGB](_airtable_blocks_ui__colorutils.md#rgb) object representing it, or null if the value isn't a
[Color](_airtable_blocks_ui__colors.md#color)

**`function`**

**`param`**

**`returns`** the color object or null

**`example`**

```js
import {colorUtils, colors} from '@airtable/blocks/ui';

colorUtils.getRgbForColor(colors.PURPLE_DARK_1);
// => {r: 107, g: 28, b: 176}

colorUtils.getRgbForColor('disgruntled pink');
// => null
```

### shouldUseLightTextOnColor

▸ **shouldUseLightTextOnColor**(`colorString`: string): _boolean_

_Defined in
[src/color_utils.ts:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/color_utils.ts#L83)_

Given a [Color](_airtable_blocks_ui__colors.md#color), returns true or false to indicate whether
that color should have light text on top of it when used as a background color.

**`function`**

**`example`**

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
