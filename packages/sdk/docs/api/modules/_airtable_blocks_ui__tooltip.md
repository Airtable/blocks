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
[src/ui/tooltip.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L68)_

A component that renders a tooltip on hover. Wraps its children.

**Example:**

```js
import {Button, Tooltip} from '@airtable/blocks';

function MyComponent() {
    return (
        <Tooltip
            content="Clicking this button will be a lot of fun!"
            placementX={Tooltip.placements.CENTER}
            placementY={Tooltip.placements.TOP}
        >
            <Button onClick={() => alert('Clicked!')}>Click here!</Button>
        </Tooltip>
    );
}
```

## Interfaces

### TooltipProps

• **TooltipProps**:

_Defined in
[src/ui/tooltip.tsx:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L16)_

Props for the [Tooltip](_airtable_blocks_ui__tooltip.md#tooltip) component.

### children

• **children**: _ReactElement‹TooltipAnchorProps›_

_Defined in
[src/ui/tooltip.tsx:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L18)_

Child components to render.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/tooltip.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L36)_

Additional class names to attach to the tooltip, separated by spaces.

### `Optional` content

• **content**? : _string | function_

_Defined in
[src/ui/tooltip.tsx:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L28)_

A string representing the contents. Alternatively, you can include a function that returns a React
node to place into the tooltip, which is useful for things like italicization in the tooltip.

### `Optional` disabled

• **disabled**? : _undefined | false | true_

_Defined in
[src/ui/tooltip.tsx:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L34)_

If set to `true`, this tooltip will not be shown. Useful when trying to disable the tooltip
dynamically.

### `Optional` fitInWindowMode

• **fitInWindowMode**? : _[FitInWindowMode](_airtable_blocks_ui__popover.md#fitinwindowmode)_

_Defined in
[src/ui/tooltip.tsx:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L30)_

Dictates the behavior when the "normal" placement of the tooltip would be outside of the viewport.
Defaults to [FitInWindowModes.FLIP](_airtable_blocks_ui__popover.md#flip).

### `Optional` placementOffsetX

• **placementOffsetX**? : _undefined | number_

_Defined in
[src/ui/tooltip.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L24)_

The horizontal offset, in pixels, of the tooltip. If `placementX` is set to
[PopoverPlacements.LEFT](_airtable_blocks_ui__popover.md#left), a higher number will move the
tooltip to the left. If `placementX` is set to
[PopoverPlacements.RIGHT](_airtable_blocks_ui__popover.md#right), a higher number moves the tooltip
to the right. If `placementX` is set to
[PopoverPlacements.CENTER](_airtable_blocks_ui__popover.md#center), this value has no effect.
Defaults to 12.

### `Optional` placementOffsetY

• **placementOffsetY**? : _undefined | number_

_Defined in
[src/ui/tooltip.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L26)_

The vertical offset, in pixels, of the tooltip. If `placementY` is set to
[PopoverPlacements.TOP](_airtable_blocks_ui__popover.md#top), a higher number will move the tooltip
upward. If `placementY` is set to
[PopoverPlacements.BOTTOM](_airtable_blocks_ui__popover.md#bottom), a higher number moves the
tooltip downard. If `placementY` is set to
[PopoverPlacements.CENTER](_airtable_blocks_ui__popover.md#center), this value has no effect.
Defaults to 0.

### `Optional` placementX

• **placementX**? : _[PopoverPlacementX](_airtable_blocks_ui__popover.md#popoverplacementx)_

_Defined in
[src/ui/tooltip.tsx:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L20)_

The horizontal placement of the tooltip. Defaults to
[PopoverPlacements.RIGHT](_airtable_blocks_ui__popover.md#right).

### `Optional` placementY

• **placementY**? : _[PopoverPlacementY](_airtable_blocks_ui__popover.md#popoverplacementy)_

_Defined in
[src/ui/tooltip.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L22)_

The vertical placement of the tooltip. Defaults to
[PopoverPlacements.CENTER](_airtable_blocks_ui__popover.md#center).

### `Optional` shouldHideTooltipOnClick

• **shouldHideTooltipOnClick**? : _undefined | false | true_

_Defined in
[src/ui/tooltip.tsx:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L32)_

Should the tooltip be hidden when clicked? Defaults to `false`.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/tooltip.tsx:38](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/tooltip.tsx#L38)_

Additional styles names to attach to the tooltip.
