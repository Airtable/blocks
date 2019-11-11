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
[src/ui/color_palette.tsx:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L151)_

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
[src/ui/color_palette_synced.tsx:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette_synced.tsx#L46)_

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
[src/ui/color_palette.tsx:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L120)_

Props for the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) component. Also
accepts:

-   [SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops)

### `Optional` color

• **color**? : _string | null_

_Defined in
[src/ui/color_palette.tsx:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L122)_

The current selected [Color](_airtable_blocks_ui__colors.md#color) option.

---

### ColorPaletteStyleProps

• **ColorPaletteStyleProps**:

_Defined in
[src/ui/color_palette.tsx:53](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L53)_

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
[src/ui/color_palette_synced.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette_synced.tsx#L21)_

Props for the [ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced)
component. Also accepts:

-   [SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops)

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/color_palette_synced.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette_synced.tsx#L23)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The selected color will always reflect the value stored in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) for this key. Selecting a new color
will update [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).

---

### SharedColorPaletteProps

• **SharedColorPaletteProps**:

_Defined in
[src/ui/color_palette.tsx:89](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L89)_

Props shared between the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) and
[ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced) components. Also
accepts:

-   [ColorPaletteStyleProps](_airtable_blocks_ui__colorpalette.md#colorpalettestyleprops)

### allowedColors

• **allowedColors**: _Array‹string›_

_Defined in
[src/ui/color_palette.tsx:91](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L91)_

The list of [colors](_airtable_blocks_ui__colors.md#color) to display in the color palette.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/color_palette.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L97)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/color_palette.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L101)_

If set to `true`, the color palette will not allow color selection.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/color_palette.tsx:93](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L93)_

A function to be called when the selected color changes.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Defined in
[src/ui/color_palette.tsx:95](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L95)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/color_palette.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/color_palette.tsx#L99)_

Additional styles to apply to the color palette.
