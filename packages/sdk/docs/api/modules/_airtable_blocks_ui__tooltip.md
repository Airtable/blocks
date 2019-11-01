[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Tooltip](_airtable_blocks_ui__tooltip.md)

# External module: @airtable/blocks/ui: Tooltip

## Index

### Classes

-   [Tooltip](_airtable_blocks_ui__tooltip.md#tooltip)

### Interfaces

-   [TooltipProps](_airtable_blocks_ui__tooltip.md#tooltipprops)

## Classes

### Tooltip

• **Tooltip**:

_Defined in
[src/ui/tooltip.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L66)_

A component that shows a tooltip. Wraps its children.

**`example`**

```js
import {UI} from '@airtable/blocks';

function MyComponent() {
    return (
        <UI.Tooltip
            content="Clicking this button will be a lot of fun!"
            placementX={UI.Tooltip.placements.CENTER}
            placementY={UI.Tooltip.placements.TOP}
        >
            <UI.Button onClick={() => alert('Clicked!')}>Click here!</UI.Button>
        </UI.Tooltip>
    );
}
```

### `Static` fitInWindowModes

▪ **fitInWindowModes**: _[FitInWindowModes](_airtable_blocks_ui__popover.md#fitinwindowmodes)_ =
Popover.fitInWindowModes

_Defined in
[src/ui/tooltip.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L70)_

### `Static` placements

▪ **placements**: _[PopoverPlacements](_airtable_blocks_ui__popover.md#popoverplacements)_ =
Popover.placements

_Defined in
[src/ui/tooltip.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L68)_

## Interfaces

### TooltipProps

• **TooltipProps**:

_Defined in
[src/ui/tooltip.tsx:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L14)_

### children

• **children**: _ReactElement‹TooltipAnchorProps›_

_Defined in
[src/ui/tooltip.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L16)_

Child components to render.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/tooltip.tsx:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L34)_

Additional class names to attach to the tooltip, separated by spaces.

### `Optional` content

• **content**? : _string | function_

_Defined in
[src/ui/tooltip.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L26)_

A string representing the contents. Alternatively, you can include a function that returns a React
node to place into the tooltip, which is useful for things like italicization in the tooltip.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/tooltip.tsx:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L32)_

If set to `true`, this tooltip will not be shown. Useful when trying to disable the tooltip
dynamically.

### `Optional` fitInWindowMode

• **fitInWindowMode**? : _[FitInWindowMode](_airtable_blocks_ui__popover.md#fitinwindowmode)_

_Defined in
[src/ui/tooltip.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L28)_

Dictates the behavior when the "normal" placement of the tooltip would be outside of the viewport.
If `NONE`, this has no effect, and the tooltip may be placed off-screen. If `FLIP`, we'll switch the
placement to the other side (for example, moving the tooltip from the left to the right). If
`NUDGE`, the tooltip will be "nudged" just enough to fit on screen. Defaults to
Tooltip.fitInWindowModes.FLIP.

### `Optional` placementOffsetX

• **placementOffsetX**? : _undefined | number_

_Defined in
[src/ui/tooltip.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L22)_

The horizontal offset, in pixels, of the tooltip. If `placementX` is set to
`UI.Tooltip.placements.LEFT`, a higher number will move the tooltip to the left. If `placementX` is
set to `UI.Tooltip.placements.RIGHT`, a higher number moves the tooltip to the right. If
`placementX` is set to `UI.Tooltip.placements.CENTER`, this value has no effect. Defaults to 12.

### `Optional` placementOffsetY

• **placementOffsetY**? : _undefined | number_

_Defined in
[src/ui/tooltip.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L24)_

The vertical offset, in pixels, of the tooltip. If `placementY` is set to
`UI.Tooltip.placements.TOP`, a higher number will move the tooltip upward. If `placementY` is set to
`UI.Tooltip.placements.BOTTOM`, a higher number moves the tooltip downard. If `placementY` is set to
`UI.Tooltip.placements.CENTER`, this value has no effect. Defaults to 0.

### `Optional` placementX

• **placementX**? : _[PopoverPlacementX](_airtable_blocks_ui__popover.md#popoverplacementx)_

_Defined in
[src/ui/tooltip.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L18)_

The horizontal placement of the tooltip. Defaults to `Tooltip.placements.RIGHT`.

### `Optional` placementY

• **placementY**? : _[PopoverPlacementY](_airtable_blocks_ui__popover.md#popoverplacementy)_

_Defined in
[src/ui/tooltip.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L20)_

The vertical placement of the tooltip. Defaults to `Tooltip.placements.CENTER`.

### `Optional` shouldHideTooltipOnClick

• **shouldHideTooltipOnClick**? : _undefined | false | true_

_Defined in
[src/ui/tooltip.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L30)_

Should the tooltip be hidden when clicked? Defaults to `false`.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/tooltip.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L36)_

Additional styles names to attach to the tooltip.
