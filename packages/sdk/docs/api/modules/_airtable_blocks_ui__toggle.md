[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Toggle](_airtable_blocks_ui__toggle.md)

# External module: @airtable/blocks/ui: Toggle

## Index

### Classes

-   [Toggle](_airtable_blocks_ui__toggle.md#toggle)
-   [ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced)

### Interfaces

-   [SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops)
-   [ToggleSyncedProps](_airtable_blocks_ui__toggle.md#togglesyncedprops)

## Classes

### Toggle

• **Toggle**:

_Defined in
[src/ui/toggle.tsx:159](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L159)_

A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.

**`example`**

```js
import {Toggle} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function Block() {
    const [isEnabled, setIsEnabled] = useState(false);
    return <Toggle value={isEnabled} onChange={setIsEnabled} label={isEnabled ? 'On' : 'Off'} />;
}
```

### `Static` themes

▪ **themes**: _Object_ = themes

_Defined in
[src/ui/toggle.tsx:161](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L161)_

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/toggle.tsx:191](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L191)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/toggle.tsx:198](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L198)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/toggle.tsx:184](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L184)_

**Returns:** _void_

---

### ToggleSynced

• **ToggleSynced**:

_Defined in
[src/ui/toggle_synced.tsx:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L54)_

A toggleable switch for controlling boolean values, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). Functionally analogous to a
checkbox.

**`example`**

```js
import {ToggleSynced, useWatchable} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React from 'react';

function Block() {
    useWatchable(globalConfig, ['isEnabled']);
    return (
        <Toggle globalConfigKey="isEnabled" label={globalConfig.get('isEnabled') ? 'On' : 'Off'} />
    );
}
```

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L77)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L84)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L70)_

**Returns:** _void_

## Interfaces

### SharedToggleProps

• **SharedToggleProps**:

_Defined in
[src/ui/toggle.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L75)_

**`typedef`** {object} ToggleProps

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the switch.

**`property`** {string} [id] The ID of the switch element.

**`property`** {React.Node} [label] The label node for the switch.

**`property`** {Function} [onChange] A function to be called when the switch is toggled.

**`property`** {number} [tabIndex] Indicates if the switch can be focused and if/where it
participates in sequential keyboard navigation.

**`property`** {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW
| Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.

**`property`** {boolean} value If set to `true`, the switch will be toggled on.

**`property`** {string} [className] Additional class names to apply to the switch.

**`property`** {object} [style] Additional styles to apply to the switch.

**`property`** {string} [aria-label] The label for the switch. Use this if the switch lacks a
visible text label.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

---

### ToggleSyncedProps

• **ToggleSyncedProps**:

_Defined in
[src/ui/toggle_synced.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L30)_

**`typedef`** {object} ToggleSyncedProps

**`property`** {boolean} [disabled] If set to `true`, the user cannot interact with the switch.

**`property`** {GlobalConfigKey} globalConfigKey A string key or array key path in
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). The switch option will always
reflect the boolean value stored in `globalConfig` for this key. Toggling the switch will update
`globalConfig`.

**`property`** {string} [id] The ID of the switch element.

**`property`** {React.Node} [label] The label node for the switch.

**`property`** {Function} [onChange] A function to be called when the switch is toggled. This should
only be used for side effects.

**`property`** {number} [tabIndex] Indicates if the switch can be focused and if/where it
participates in sequential keyboard navigation.

**`property`** {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW
| Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.

**`property`** {string} [className] Additional class names to apply to the switch.

**`property`** {object} [style] Additional styles to apply to the switch.

**`property`** {string} [aria-label] The label for the switch. Use this if the switch lacks a
visible text label.

**`property`** {string} [aria-labelledby] A space separated list of label element IDs.

**`property`** {string} [aria-describedby] A space separated list of description element IDs.

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

### `Optional` padding

• **padding**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[padding](_airtable_blocks_ui_system__spacing.md#optional-padding)_

_Defined in
[src/ui/system/spacing/padding.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L17)_

Sets the padding area on all four sides of an element. It is a shorthand for `paddingTop`,
`paddingRight`, `paddingBottom`, and `paddingLeft`.

### `Optional` paddingBottom

• **paddingBottom**? : _Prop‹PaddingBottomProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingBottom](_airtable_blocks_ui_system__spacing.md#optional-paddingbottom)_

_Defined in
[src/ui/system/spacing/padding.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L23)_

Sets the height of the padding area on the bottom side of an element.

### `Optional` paddingLeft

• **paddingLeft**? : _Prop‹PaddingLeftProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingLeft](_airtable_blocks_ui_system__spacing.md#optional-paddingleft)_

_Defined in
[src/ui/system/spacing/padding.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L25)_

Sets the width of the padding area on the left side of an element.

### `Optional` paddingRight

• **paddingRight**? : _Prop‹PaddingRightProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingRight](_airtable_blocks_ui_system__spacing.md#optional-paddingright)_

_Defined in
[src/ui/system/spacing/padding.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L21)_

Sets the width of the padding area on the right side of an element.

### `Optional` paddingTop

• **paddingTop**? : _Prop‹PaddingTopProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingTop](_airtable_blocks_ui_system__spacing.md#optional-paddingtop)_

_Defined in
[src/ui/system/spacing/padding.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L19)_

Sets the height of the padding area on the top side of an element.

### `Optional` paddingX

• **paddingX**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingX](_airtable_blocks_ui_system__spacing.md#optional-paddingx)_

_Defined in
[src/ui/system/spacing/padding.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L27)_

Sets the width of the padding area on the left and right sides of an element.

### `Optional` paddingY

• **paddingY**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingY](_airtable_blocks_ui_system__spacing.md#optional-paddingy)_

_Defined in
[src/ui/system/spacing/padding.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L29)_

Sets the height of the padding area on the top and bottom sides of an element.

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
