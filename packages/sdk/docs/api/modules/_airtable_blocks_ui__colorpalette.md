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
[src/ui/color_palette.tsx:127](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L127)_

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
[src/ui/color_palette_synced.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette_synced.tsx#L40)_

A wrapper around the [ColorPalette](_airtable_blocks_ui__colorpalette.md#colorpalette) component
that syncs with global config.

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
[src/ui/color_palette.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L96)_

### allowedColors

• **allowedColors**: _Array‹string›_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[allowedColors](_airtable_blocks_ui__colorpalette.md#allowedcolors)_

_Defined in
[src/ui/color_palette.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L72)_

The list of {@link colors} to display in the color palette.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[className](_airtable_blocks_ui__colorpalette.md#optional-classname)_

_Defined in
[src/ui/color_palette.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L78)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` color

• **color**? : _string | null_

_Defined in
[src/ui/color_palette.tsx:98](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L98)_

The current selected [Color](_airtable_blocks_ui__colors.md#color) option.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[disabled](_airtable_blocks_ui__colorpalette.md#optional-disabled)_

_Defined in
[src/ui/color_palette.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L82)_

If set to `true`, the color palette will not allow color selection.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[onChange](_airtable_blocks_ui__colorpalette.md#optional-onchange)_

_Defined in
[src/ui/color_palette.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L74)_

A function to be called when the selected color changes.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[squareMargin](_airtable_blocks_ui__colorpalette.md#optional-squaremargin)_

_Defined in
[src/ui/color_palette.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L76)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[style](_airtable_blocks_ui__colorpalette.md#optional-style)_

_Defined in
[src/ui/color_palette.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L80)_

Additional styles to apply to the color palette.

---

### ColorPaletteStyleProps

• **ColorPaletteStyleProps**:

_Defined in
[src/ui/color_palette.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L43)_

### `Optional` alignSelf

• **alignSelf**? : _Prop‹AlignSelfProperty›_

_Inherited from
[AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops).[alignSelf](_airtable_blocks_ui_system__flex_item.md#optional-alignself)_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

### `Optional` bottom

• **bottom**? : _Prop‹BottomProperty‹Length››_

_Inherited from
[BottomProps](_airtable_blocks_ui_system__position.md#bottomprops).[bottom](_airtable_blocks_ui_system__position.md#optional-bottom)_

_Defined in
[src/ui/system/position/bottom.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/bottom.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` flex

• **flex**? : _Prop‹FlexProperty‹Length››_

_Inherited from
[FlexProps](_airtable_blocks_ui_system__flex_item.md#flexprops).[flex](_airtable_blocks_ui_system__flex_item.md#optional-flex)_

_Defined in
[src/ui/system/flex_item/flex.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex.ts#L10)_

Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a
shorthand for `flexGrow`, `flexShrink`, and `flexBasis`.

### `Optional` flexBasis

• **flexBasis**? : _Prop‹FlexBasisProperty‹Length››_

_Inherited from
[FlexBasisProps](_airtable_blocks_ui_system__flex_item.md#flexbasisprops).[flexBasis](_airtable_blocks_ui_system__flex_item.md#optional-flexbasis)_

_Defined in
[src/ui/system/flex_item/flex_basis.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L10)_

Sets the initial main size of a flex item.

### `Optional` flexGrow

• **flexGrow**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexGrowProps](_airtable_blocks_ui_system__flex_item.md#flexgrowprops).[flexGrow](_airtable_blocks_ui_system__flex_item.md#optional-flexgrow)_

_Defined in
[src/ui/system/flex_item/flex_grow.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L10)_

Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex
container, items grow to fit according to `flexGrow`.

### `Optional` flexShrink

• **flexShrink**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexShrinkProps](_airtable_blocks_ui_system__flex_item.md#flexshrinkprops).[flexShrink](_airtable_blocks_ui_system__flex_item.md#optional-flexshrink)_

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L10)_

Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex
container, items shrink to fit according to `flexShrink`.

### `Optional` left

• **left**? : _Prop‹LeftProperty‹Length››_

_Inherited from
[LeftProps](_airtable_blocks_ui_system__position.md#leftprops).[left](_airtable_blocks_ui_system__position.md#optional-left)_

_Defined in
[src/ui/system/position/left.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/left.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` margin

• **margin**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[margin](_airtable_blocks_ui_system__spacing.md#optional-margin)_

_Defined in
[src/ui/system/spacing/margin.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L17)_

Sets the margin area on all four sides of an element. It is a shorthand for `marginTop`,
`marginRight`, `marginBottom`, and `marginLeft`.

### `Optional` marginBottom

• **marginBottom**? : _Prop‹MarginBottomProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginBottom](_airtable_blocks_ui_system__spacing.md#optional-marginbottom)_

_Defined in
[src/ui/system/spacing/margin.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L23)_

Sets the margin area on the bottom of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginLeft

• **marginLeft**? : _Prop‹MarginLeftProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginLeft](_airtable_blocks_ui_system__spacing.md#optional-marginleft)_

_Defined in
[src/ui/system/spacing/margin.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L25)_

Sets the margin area on the left of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginRight

• **marginRight**? : _Prop‹MarginRightProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginRight](_airtable_blocks_ui_system__spacing.md#optional-marginright)_

_Defined in
[src/ui/system/spacing/margin.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L21)_

Sets the margin area on the right of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginTop

• **marginTop**? : _Prop‹MarginTopProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginTop](_airtable_blocks_ui_system__spacing.md#optional-margintop)_

_Defined in
[src/ui/system/spacing/margin.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L19)_

Sets the margin area on the top of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginX

• **marginX**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginX](_airtable_blocks_ui_system__spacing.md#optional-marginx)_

_Defined in
[src/ui/system/spacing/margin.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L27)_

Sets the margin area on the top and bottom of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` marginY

• **marginY**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginY](_airtable_blocks_ui_system__spacing.md#optional-marginy)_

_Defined in
[src/ui/system/spacing/margin.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L29)_

Sets the margin area on the left and right of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` maxWidth

• **maxWidth**? : _Prop‹MaxWidthProperty‹Length››_

_Inherited from
[MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops).[maxWidth](_airtable_blocks_ui_system__dimensions.md#optional-maxwidth)_

_Defined in
[src/ui/system/dimensions/max_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_width.ts#L10)_

Sets the maximum width of an element. It prevents the used value of the `width` property from
becoming larger than the value specified by `maxWidth`.

### `Optional` minWidth

• **minWidth**? : _Prop‹MinWidthProperty‹Length››_

_Inherited from
[MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops).[minWidth](_airtable_blocks_ui_system__dimensions.md#optional-minwidth)_

_Defined in
[src/ui/system/dimensions/min_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_width.ts#L10)_

Sets the minimum width of an element. It prevents the used value of the `width` property from
becoming smaller than the value specified for `minWidth`.

### `Optional` order

• **order**? : _Prop‹GlobalsNumber›_

_Inherited from
[OrderProps](_airtable_blocks_ui_system__flex_item.md#orderprops).[order](_airtable_blocks_ui_system__flex_item.md#optional-order)_

_Defined in
[src/ui/system/flex_item/order.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/order.ts#L10)_

Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value
and then by their source code order.

### `Optional` position

• **position**? : _Prop‹PositionProperty›_

_Inherited from
[PositionProps](_airtable_blocks_ui_system__position.md#positionprops).[position](_airtable_blocks_ui_system__position.md#optional-position)_

_Defined in
[src/ui/system/position/position.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/position.ts#L10)_

Sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties
determine the final location of positioned elements.

### `Optional` right

• **right**? : _Prop‹RightProperty‹Length››_

_Inherited from
[RightProps](_airtable_blocks_ui_system__position.md#rightprops).[right](_airtable_blocks_ui_system__position.md#optional-right)_

_Defined in
[src/ui/system/position/right.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/right.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` top

• **top**? : _Prop‹TopProperty‹Length››_

_Inherited from
[TopProps](_airtable_blocks_ui_system__position.md#topprops).[top](_airtable_blocks_ui_system__position.md#optional-top)_

_Defined in
[src/ui/system/position/top.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/top.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.

### `Optional` zIndex

• **zIndex**? : _Prop‹ZIndexProperty›_

_Inherited from
[ZIndexProps](_airtable_blocks_ui_system__position.md#zindexprops).[zIndex](_airtable_blocks_ui_system__position.md#optional-zindex)_

_Defined in
[src/ui/system/position/z_index.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/z_index.ts#L10)_

Sets the z-order of a positioned element and its descendants or flex items. Overlapping elements
with larger z-indexes cover those with smaller ones.

---

### ColorPaletteSyncedProps

• **ColorPaletteSyncedProps**:

_Defined in
[src/ui/color_palette_synced.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette_synced.tsx#L15)_

### `Optional` alignSelf

• **alignSelf**? : _Prop‹AlignSelfProperty›_

_Inherited from
[AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops).[alignSelf](_airtable_blocks_ui_system__flex_item.md#optional-alignself)_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

### allowedColors

• **allowedColors**: _Array‹string›_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[allowedColors](_airtable_blocks_ui__colorpalette.md#allowedcolors)_

_Defined in
[src/ui/color_palette.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L72)_

The list of {@link colors} to display in the color palette.

### `Optional` bottom

• **bottom**? : _Prop‹BottomProperty‹Length››_

_Inherited from
[BottomProps](_airtable_blocks_ui_system__position.md#bottomprops).[bottom](_airtable_blocks_ui_system__position.md#optional-bottom)_

_Defined in
[src/ui/system/position/bottom.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/bottom.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[className](_airtable_blocks_ui__colorpalette.md#optional-classname)_

_Defined in
[src/ui/color_palette.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L78)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[disabled](_airtable_blocks_ui__colorpalette.md#optional-disabled)_

_Defined in
[src/ui/color_palette.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L82)_

If set to `true`, the color palette will not allow color selection.

### `Optional` flex

• **flex**? : _Prop‹FlexProperty‹Length››_

_Inherited from
[FlexProps](_airtable_blocks_ui_system__flex_item.md#flexprops).[flex](_airtable_blocks_ui_system__flex_item.md#optional-flex)_

_Defined in
[src/ui/system/flex_item/flex.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex.ts#L10)_

Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a
shorthand for `flexGrow`, `flexShrink`, and `flexBasis`.

### `Optional` flexBasis

• **flexBasis**? : _Prop‹FlexBasisProperty‹Length››_

_Inherited from
[FlexBasisProps](_airtable_blocks_ui_system__flex_item.md#flexbasisprops).[flexBasis](_airtable_blocks_ui_system__flex_item.md#optional-flexbasis)_

_Defined in
[src/ui/system/flex_item/flex_basis.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L10)_

Sets the initial main size of a flex item.

### `Optional` flexGrow

• **flexGrow**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexGrowProps](_airtable_blocks_ui_system__flex_item.md#flexgrowprops).[flexGrow](_airtable_blocks_ui_system__flex_item.md#optional-flexgrow)_

_Defined in
[src/ui/system/flex_item/flex_grow.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L10)_

Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex
container, items grow to fit according to `flexGrow`.

### `Optional` flexShrink

• **flexShrink**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexShrinkProps](_airtable_blocks_ui_system__flex_item.md#flexshrinkprops).[flexShrink](_airtable_blocks_ui_system__flex_item.md#optional-flexshrink)_

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L10)_

Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex
container, items shrink to fit according to `flexShrink`.

### globalConfigKey

• **globalConfigKey**: _[GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)_

_Defined in
[src/ui/color_palette_synced.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette_synced.tsx#L17)_

The key, or path to a key, in global config.

### `Optional` left

• **left**? : _Prop‹LeftProperty‹Length››_

_Inherited from
[LeftProps](_airtable_blocks_ui_system__position.md#leftprops).[left](_airtable_blocks_ui_system__position.md#optional-left)_

_Defined in
[src/ui/system/position/left.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/left.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` margin

• **margin**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[margin](_airtable_blocks_ui_system__spacing.md#optional-margin)_

_Defined in
[src/ui/system/spacing/margin.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L17)_

Sets the margin area on all four sides of an element. It is a shorthand for `marginTop`,
`marginRight`, `marginBottom`, and `marginLeft`.

### `Optional` marginBottom

• **marginBottom**? : _Prop‹MarginBottomProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginBottom](_airtable_blocks_ui_system__spacing.md#optional-marginbottom)_

_Defined in
[src/ui/system/spacing/margin.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L23)_

Sets the margin area on the bottom of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginLeft

• **marginLeft**? : _Prop‹MarginLeftProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginLeft](_airtable_blocks_ui_system__spacing.md#optional-marginleft)_

_Defined in
[src/ui/system/spacing/margin.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L25)_

Sets the margin area on the left of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginRight

• **marginRight**? : _Prop‹MarginRightProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginRight](_airtable_blocks_ui_system__spacing.md#optional-marginright)_

_Defined in
[src/ui/system/spacing/margin.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L21)_

Sets the margin area on the right of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginTop

• **marginTop**? : _Prop‹MarginTopProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginTop](_airtable_blocks_ui_system__spacing.md#optional-margintop)_

_Defined in
[src/ui/system/spacing/margin.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L19)_

Sets the margin area on the top of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginX

• **marginX**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginX](_airtable_blocks_ui_system__spacing.md#optional-marginx)_

_Defined in
[src/ui/system/spacing/margin.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L27)_

Sets the margin area on the top and bottom of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` marginY

• **marginY**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginY](_airtable_blocks_ui_system__spacing.md#optional-marginy)_

_Defined in
[src/ui/system/spacing/margin.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L29)_

Sets the margin area on the left and right of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` maxWidth

• **maxWidth**? : _Prop‹MaxWidthProperty‹Length››_

_Inherited from
[MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops).[maxWidth](_airtable_blocks_ui_system__dimensions.md#optional-maxwidth)_

_Defined in
[src/ui/system/dimensions/max_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_width.ts#L10)_

Sets the maximum width of an element. It prevents the used value of the `width` property from
becoming larger than the value specified by `maxWidth`.

### `Optional` minWidth

• **minWidth**? : _Prop‹MinWidthProperty‹Length››_

_Inherited from
[MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops).[minWidth](_airtable_blocks_ui_system__dimensions.md#optional-minwidth)_

_Defined in
[src/ui/system/dimensions/min_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_width.ts#L10)_

Sets the minimum width of an element. It prevents the used value of the `width` property from
becoming smaller than the value specified for `minWidth`.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[onChange](_airtable_blocks_ui__colorpalette.md#optional-onchange)_

_Defined in
[src/ui/color_palette.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L74)_

A function to be called when the selected color changes.

### `Optional` order

• **order**? : _Prop‹GlobalsNumber›_

_Inherited from
[OrderProps](_airtable_blocks_ui_system__flex_item.md#orderprops).[order](_airtable_blocks_ui_system__flex_item.md#optional-order)_

_Defined in
[src/ui/system/flex_item/order.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/order.ts#L10)_

Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value
and then by their source code order.

### `Optional` position

• **position**? : _Prop‹PositionProperty›_

_Inherited from
[PositionProps](_airtable_blocks_ui_system__position.md#positionprops).[position](_airtable_blocks_ui_system__position.md#optional-position)_

_Defined in
[src/ui/system/position/position.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/position.ts#L10)_

Sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties
determine the final location of positioned elements.

### `Optional` right

• **right**? : _Prop‹RightProperty‹Length››_

_Inherited from
[RightProps](_airtable_blocks_ui_system__position.md#rightprops).[right](_airtable_blocks_ui_system__position.md#optional-right)_

_Defined in
[src/ui/system/position/right.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/right.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[squareMargin](_airtable_blocks_ui__colorpalette.md#optional-squaremargin)_

_Defined in
[src/ui/color_palette.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L76)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedColorPaletteProps](_airtable_blocks_ui__colorpalette.md#sharedcolorpaletteprops).[style](_airtable_blocks_ui__colorpalette.md#optional-style)_

_Defined in
[src/ui/color_palette.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L80)_

Additional styles to apply to the color palette.

### `Optional` top

• **top**? : _Prop‹TopProperty‹Length››_

_Inherited from
[TopProps](_airtable_blocks_ui_system__position.md#topprops).[top](_airtable_blocks_ui_system__position.md#optional-top)_

_Defined in
[src/ui/system/position/top.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/top.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.

### `Optional` zIndex

• **zIndex**? : _Prop‹ZIndexProperty›_

_Inherited from
[ZIndexProps](_airtable_blocks_ui_system__position.md#zindexprops).[zIndex](_airtable_blocks_ui_system__position.md#optional-zindex)_

_Defined in
[src/ui/system/position/z_index.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/z_index.ts#L10)_

Sets the z-order of a positioned element and its descendants or flex items. Overlapping elements
with larger z-indexes cover those with smaller ones.

---

### SharedColorPaletteProps

• **SharedColorPaletteProps**:

_Defined in
[src/ui/color_palette.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L70)_

### allowedColors

• **allowedColors**: _Array‹string›_

_Defined in
[src/ui/color_palette.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L72)_

The list of {@link colors} to display in the color palette.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/color_palette.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L78)_

Additional class names to apply to the color palette, separated by spaces.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/color_palette.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L82)_

If set to `true`, the color palette will not allow color selection.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/color_palette.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L74)_

A function to be called when the selected color changes.

### `Optional` squareMargin

• **squareMargin**? : _undefined | number_

_Defined in
[src/ui/color_palette.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L76)_

The margin between color squares in the color palette.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/color_palette.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/color_palette.tsx#L80)_

Additional styles to apply to the color palette.
