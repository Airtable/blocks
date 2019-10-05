[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ColorPalette](_airtable_blocks_ui__colorpalette.md)

# External module: @airtable/blocks/ui: ColorPalette

## Index

### Classes

-   [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette)
-   [ColorPaletteSynced](_airtable_blocks_ui__colorpalette.md#colorpalettesynced)

### Type aliases

-   [ColorPaletteProps](_airtable_blocks_ui__colorpalette.md#colorpaletteprops)
-   [ColorPaletteSyncedProps](_airtable_blocks_ui__colorpalette.md#colorpalettesyncedprops)

## Classes

### ColorPalette

• **ColorPalette**:

_Defined in
[src/ui/color_palette.tsx:123](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L123)_

A color selection component. Accepts a list of `allowedColors` to be displayed as selectable color
squares.

**`example`**

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
[src/ui/color_palette_synced.tsx:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette_synced.tsx#L47)_

A wrapper around the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) component
that syncs with global config.

**`example`**

```js
import {ColorPaletteSynced, colors} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React from 'react';

function DisplayOptions() {
    const allowedColors = [colors.GREEN, colors.BLUE, colors.RED];
    return <ColorPaletteSynced allowedColors={allowedColors} globalConfigKey="displayColor" />;
}
```

## Type aliases

### ColorPaletteProps

Ƭ **ColorPaletteProps**: _object & object & object_

_Defined in
[src/ui/color_palette.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L96)_

**`typedef`** {object} ColorPaletteProps

**`property`** {string} [color] The current selected [Color](_airtable_blocks__colors.md#color)
option.

**`property`** {Array<string>} allowedColors The list of {@link colors} to display in the color
palette.

**`property`** {Function} [onChange] A function to be called when the selected color changes.

**`property`** {number} [squareMargin] The margin between color squares in the color palette.

**`property`** {string} [className] Additional class names to apply to the color palette, separated
by spaces.

**`property`** {object} [style] Additional styles to apply to the color palette.

**`property`** {boolean} [disabled] If set to `true`, the color palette will not allow color
selection.

---

### ColorPaletteSyncedProps

Ƭ **ColorPaletteSyncedProps**: _object & object & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/color_palette_synced.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette_synced.tsx#L24)_

**`typedef`** {object} ColorPaletteSyncedProps

**`property`** {GlobalConfigKey} globalConfigKey The key, or path to a key, in global config.

**`property`** {Array<string>} allowedColors The list of {@link colors} to display in the color
palette.

**`property`** {number} [squareMargin] The margin between color squares in the color palette.

**`property`** {string} [className=''] Additional class names to apply to the color palette,
separated by spaces.

**`property`** {object} [style={}] Additional styles to apply to the color palette.

**`property`** {boolean} [disabled=false] If set to `true`, the color palette will not allow color
selection.

**`property`** {Function} [onChange] A function to be called when the selected color changes.
