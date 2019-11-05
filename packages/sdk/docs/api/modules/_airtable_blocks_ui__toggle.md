[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Toggle](_airtable_blocks_ui__toggle.md)

# External module: @airtable/blocks/ui: Toggle

## Index

### Classes

-   [Toggle](_airtable_blocks_ui__toggle.md#toggle)
-   [ToggleSynced](_airtable_blocks_ui__toggle.md#togglesynced)

### Interfaces

-   [SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops)
-   [ToggleProps](_airtable_blocks_ui__toggle.md#toggleprops)
-   [ToggleStyleProps](_airtable_blocks_ui__toggle.md#togglestyleprops)
-   [ToggleSyncedProps](_airtable_blocks_ui__toggle.md#togglesyncedprops)

### Type aliases

-   [ToggleTheme](_airtable_blocks_ui__toggle.md#toggletheme)

## Classes

### Toggle

• **Toggle**:

_Defined in
[src/ui/toggle.tsx:161](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L161)_

A toggleable switch for controlling boolean values. Functionally analogous to a checkbox.

**Example:**

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
[src/ui/toggle.tsx:163](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L163)_

### blur

▸ **blur**(): _void_

_Defined in
[src/ui/toggle.tsx:193](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L193)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/toggle.tsx:200](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L200)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/toggle.tsx:186](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L186)_

**Returns:** _void_

---

### ToggleSynced

• **ToggleSynced**:

_Defined in
[src/ui/toggle_synced.tsx:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L41)_

A toggleable switch for controlling boolean values, synced with
[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig). Functionally analogous to a
checkbox.

**Example:**

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
[src/ui/toggle_synced.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L64)_

**Returns:** _void_

### click

▸ **click**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L71)_

**Returns:** _void_

### focus

▸ **focus**(): _void_

_Defined in
[src/ui/toggle_synced.tsx:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L57)_

**Returns:** _void_

## Interfaces

### SharedToggleProps

• **SharedToggleProps**:

_Defined in
[src/ui/toggle.tsx:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L62)_

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L84)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L80)_

The label for the switch. Use this if the switch lacks a visible text label.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L82)_

A space separated list of label element IDs.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L64)_

Additional class names to apply to the switch.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/toggle.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L66)_

If set to `true`, the user cannot interact with the switch.

### `Optional` id

• **id**? : _undefined | string_

_Defined in
[src/ui/toggle.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L76)_

The ID of the switch element.

### `Optional` label

• **label**? : _React.ReactNode_

_Defined in
[src/ui/toggle.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L68)_

The label node for the switch.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Defined in
[src/ui/toggle.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L70)_

A function to be called when the switch is toggled.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/toggle.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L78)_

Additional styles to apply to the switch.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Defined in
[src/ui/toggle.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L72)_

Indicates if the switch can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` theme

• **theme**? : _[ToggleTheme](_airtable_blocks_ui__toggle.md#toggletheme)_

_Defined in
[src/ui/toggle.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L74)_

The color theme for the switch. Defaults to Toggle.themes.GREEN.

---

### ToggleProps

• **ToggleProps**:

_Defined in
[src/ui/toggle.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L88)_

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[aria-describedby](_airtable_blocks_ui__toggle.md#optional-aria-describedby)_

_Defined in
[src/ui/toggle.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L84)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[aria-label](_airtable_blocks_ui__toggle.md#optional-aria-label)_

_Defined in
[src/ui/toggle.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L80)_

The label for the switch. Use this if the switch lacks a visible text label.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[aria-labelledby](_airtable_blocks_ui__toggle.md#optional-aria-labelledby)_

_Defined in
[src/ui/toggle.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L82)_

A space separated list of label element IDs.

### `Optional` className

• **className**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[className](_airtable_blocks_ui__toggle.md#optional-classname)_

_Defined in
[src/ui/toggle.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L64)_

Additional class names to apply to the switch.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[disabled](_airtable_blocks_ui__toggle.md#optional-disabled)_

_Defined in
[src/ui/toggle.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L66)_

If set to `true`, the user cannot interact with the switch.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[id](_airtable_blocks_ui__toggle.md#optional-id)_

_Defined in
[src/ui/toggle.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L76)_

The ID of the switch element.

### `Optional` label

• **label**? : _React.ReactNode_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[label](_airtable_blocks_ui__toggle.md#optional-label)_

_Defined in
[src/ui/toggle.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L68)_

The label node for the switch.

### `Optional` onChange

• **onChange**? : _undefined | function_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[onChange](_airtable_blocks_ui__toggle.md#optional-onchange)_

_Defined in
[src/ui/toggle.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L70)_

A function to be called when the switch is toggled.

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[style](_airtable_blocks_ui__toggle.md#optional-style)_

_Defined in
[src/ui/toggle.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L78)_

Additional styles to apply to the switch.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[tabIndex](_airtable_blocks_ui__toggle.md#optional-tabindex)_

_Defined in
[src/ui/toggle.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L72)_

Indicates if the switch can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` theme

• **theme**? : _[ToggleTheme](_airtable_blocks_ui__toggle.md#toggletheme)_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[theme](_airtable_blocks_ui__toggle.md#optional-theme)_

_Defined in
[src/ui/toggle.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L74)_

The color theme for the switch. Defaults to Toggle.themes.GREEN.

### value

• **value**: _boolean_

_Defined in
[src/ui/toggle.tsx:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L90)_

If set to `true`, the switch will be toggled on.

---

### ToggleStyleProps

• **ToggleStyleProps**:

_Defined in
[src/ui/toggle.tsx:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L109)_

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

### `Optional` display

• **display**? : _Prop‹"flex" | "inline-flex"›_

_Defined in
[src/ui/toggle.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L117)_

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

---

### ToggleSyncedProps

• **ToggleSyncedProps**:

_Defined in
[src/ui/toggle_synced.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L16)_

### `Optional` alignSelf

• **alignSelf**? : _Prop‹AlignSelfProperty›_

_Inherited from
[AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops).[alignSelf](_airtable_blocks_ui_system__flex_item.md#optional-alignself)_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[aria-describedby](_airtable_blocks_ui__toggle.md#optional-aria-describedby)_

_Defined in
[src/ui/toggle.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L84)_

A space separated list of description element IDs.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[aria-label](_airtable_blocks_ui__toggle.md#optional-aria-label)_

_Defined in
[src/ui/toggle.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L80)_

The label for the switch. Use this if the switch lacks a visible text label.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[aria-labelledby](_airtable_blocks_ui__toggle.md#optional-aria-labelledby)_

_Defined in
[src/ui/toggle.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L82)_

A space separated list of label element IDs.

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
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[className](_airtable_blocks_ui__toggle.md#optional-classname)_

_Defined in
[src/ui/toggle.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L64)_

Additional class names to apply to the switch.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[disabled](_airtable_blocks_ui__toggle.md#optional-disabled)_

_Defined in
[src/ui/toggle.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L66)_

If set to `true`, the user cannot interact with the switch.

### `Optional` display

• **display**? : _Prop‹"flex" | "inline-flex"›_

_Inherited from
[ToggleStyleProps](_airtable_blocks_ui__toggle.md#togglestyleprops).[display](_airtable_blocks_ui__toggle.md#optional-display)_

_Defined in
[src/ui/toggle.tsx:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L117)_

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
[src/ui/toggle_synced.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle_synced.tsx#L18)_

A string key or array key path in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig).
The switch option will always reflect the boolean value stored in `globalConfig` for this key.
Toggling the switch will update `globalConfig`.

### `Optional` id

• **id**? : _undefined | string_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[id](_airtable_blocks_ui__toggle.md#optional-id)_

_Defined in
[src/ui/toggle.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L76)_

The ID of the switch element.

### `Optional` label

• **label**? : _React.ReactNode_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[label](_airtable_blocks_ui__toggle.md#optional-label)_

_Defined in
[src/ui/toggle.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L68)_

The label node for the switch.

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
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[onChange](_airtable_blocks_ui__toggle.md#optional-onchange)_

_Defined in
[src/ui/toggle.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L70)_

A function to be called when the switch is toggled.

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

### `Optional` style

• **style**? : _React.CSSProperties_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[style](_airtable_blocks_ui__toggle.md#optional-style)_

_Defined in
[src/ui/toggle.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L78)_

Additional styles to apply to the switch.

### `Optional` tabIndex

• **tabIndex**? : _undefined | number_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[tabIndex](_airtable_blocks_ui__toggle.md#optional-tabindex)_

_Defined in
[src/ui/toggle.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L72)_

Indicates if the switch can be focused and if/where it participates in sequential keyboard
navigation.

### `Optional` theme

• **theme**? : _[ToggleTheme](_airtable_blocks_ui__toggle.md#toggletheme)_

_Inherited from
[SharedToggleProps](_airtable_blocks_ui__toggle.md#sharedtoggleprops).[theme](_airtable_blocks_ui__toggle.md#optional-theme)_

_Defined in
[src/ui/toggle.tsx:74](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L74)_

The color theme for the switch. Defaults to Toggle.themes.GREEN.

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

## Type aliases

### ToggleTheme

Ƭ **ToggleTheme**: _ObjectValues‹object›_

_Defined in
[src/ui/toggle.tsx:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/toggle.tsx#L51)_
