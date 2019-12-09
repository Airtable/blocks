[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ColorPalette](_airtable_blocks_ui__colorpalette.md)

# External module: @airtable/blocks/ui: ColorPalette

## Index

### Classes

-   [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette)
-   [ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced)

### Interfaces

-   [ColorPaletteProps](_airtable_blocks_ui__colorpalette.md#colorpaletteprops)
-   [ColorPaletteStyleProps](_airtable_blocks_ui__colorpalette.md#colorpalettestyleprops)
-   [ColorPaletteSyncedProps](_airtable_blocks_ui__colorpalette.md#colorpalettesyncedprops)
-   [SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops)

## Classes

### ColorPalette

• **ColorPalette**:

_Defined in
[src/ui/color_palette.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L135)_

A color selection component. Accepts a list of `allowedColors` to be displayed as selectable color
squares.

**Example:**

```js
import {ColorPalette, colors} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function DisplayOptions() {
    const allowedColors = [colors.GREEN, colors.BLUE, colors.RED];
    const [selectedColor, setSelectedColor] = useState(colors.GREEN);
    return <ColorPalette allowedColors={allowedColors} onChange={setSelectedColor} />;
}
```

---

### ColorPaletteSynced

• **ColorPaletteSynced**:

_Defined in
[src/ui/color_palette_synced.tsx:42](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette_synced.tsx#L42)_

A wrapper around the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) component
that syncs with [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

**Example:**

```js
import {ColorPaletteSynced, colors} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React from 'react';

function DisplayOptions() {
    const allowedColors = [colors.GREEN, colors.BLUE, colors.RED];
    return <ColorPaletteSynced allowedColors={allowedColors} globalConfigKey="displayColor" />;
}
```

## Interfaces

### ColorPaletteProps

• **ColorPaletteProps**:

_Defined in
[src/ui/color_palette.tsx:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L104)_

Props for the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) component. Also
accepts:

-   [ColorPaletteStyleProps](_airtable_blocks_ui__colorpalette.md#colorpalettestyleprops)

### allowedColors

• **allowedColors**: _Array‹string›_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[allowedColors](_airtable_blocks_ui__colorpalette.md#allowedcolors)_

_Defined in
[src/ui/color_palette.tsx:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L77)_

The list of [colors](_airtable_blocks_ui__colors.md#color) to display in the color palette.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[className](_airtable_blocks_ui__colorpalette.md#optional-classname)_

_Defined in
[src/ui/color_palette.tsx:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L83)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` color

• **color**? : _string | null_

_Defined in
[src/ui/color_palette.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L106)_

The current selected [Color](_airtable_blocks_ui__colors.md#color) option.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[disabled](_airtable_blocks_ui__colorpalette.md#optional-disabled)_

_Defined in
[src/ui/color_palette.tsx:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L87)_

If set to `true`, the color palette will not allow color selection.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[onChange](_airtable_blocks_ui__colorpalette.md#optional-onchange)_

_Defined in
[src/ui/color_palette.tsx:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L79)_

A function to be called when the selected color changes.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[squareMargin](_airtable_blocks_ui__colorpalette.md#optional-squaremargin)_

_Defined in
[src/ui/color_palette.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L81)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[style](_airtable_blocks_ui__colorpalette.md#optional-style)_

_Defined in
[src/ui/color_palette.tsx:85](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L85)_

Additional styles to apply to the color palette.

---

### ColorPaletteStyleProps

• **ColorPaletteStyleProps**:

_Defined in
[src/ui/color_palette.tsx:53](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L53)_

Style props shared between the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) and
[ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced) components. Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

---

### ColorPaletteSyncedProps

• **ColorPaletteSyncedProps**:

_Defined in
[src/ui/color_palette_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette_synced.tsx#L17)_

Props for the [ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced)
component. Also accepts:

-   [ColorPaletteStyleProps](_airtable_blocks_ui__colorpalette.md#colorpalettestyleprops)

### allowedColors

• **allowedColors**: _Array‹string›_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[allowedColors](_airtable_blocks_ui__colorpalette.md#allowedcolors)_

_Defined in
[src/ui/color_palette.tsx:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L77)_

The list of [colors](_airtable_blocks_ui__colors.md#color) to display in the color palette.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[className](_airtable_blocks_ui__colorpalette.md#optional-classname)_

_Defined in
[src/ui/color_palette.tsx:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L83)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[disabled](_airtable_blocks_ui__colorpalette.md#optional-disabled)_

_Defined in
[src/ui/color_palette.tsx:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L87)_

If set to `true`, the color palette will not allow color selection.

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/color_palette_synced.tsx:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette_synced.tsx#L19)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected color will always reflect the value stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new color
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[onChange](_airtable_blocks_ui__colorpalette.md#optional-onchange)_

_Defined in
[src/ui/color_palette.tsx:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L79)_

A function to be called when the selected color changes.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[squareMargin](_airtable_blocks_ui__colorpalette.md#optional-squaremargin)_

_Defined in
[src/ui/color_palette.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L81)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[style](_airtable_blocks_ui__colorpalette.md#optional-style)_

_Defined in
[src/ui/color_palette.tsx:85](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L85)_

Additional styles to apply to the color palette.

---

### SharedColorPaletteProps

• **SharedColorPaletteProps**:

_Defined in
[src/ui/color_palette.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L75)_

Props shared between the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) and
[ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced) components.

### allowedColors

• **allowedColors**: _Array‹string›_

_Defined in
[src/ui/color_palette.tsx:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L77)_

The list of [colors](_airtable_blocks_ui__colors.md#color) to display in the color palette.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/color_palette.tsx:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L83)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/color_palette.tsx:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L87)_

If set to `true`, the color palette will not allow color selection.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/color_palette.tsx:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L79)_

A function to be called when the selected color changes.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Defined in
[src/ui/color_palette.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L81)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/color_palette.tsx:85](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/color_palette.tsx#L85)_

Additional styles to apply to the color palette.
