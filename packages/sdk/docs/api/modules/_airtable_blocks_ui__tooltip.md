[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Tooltip](_airtable_blocks_ui__tooltip.md)

# External module: @airtable/blocks/ui: Tooltip

## Index

### Classes

-   [Tooltip](_airtable_blocks_ui__tooltip.md#tooltip)

### Type aliases

-   [TooltipProps](_airtable_blocks_ui__tooltip.md#tooltipprops)

## Classes

### Tooltip

• **Tooltip**:

_Defined in
[src/ui/tooltip.tsx:65](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L65)_

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
[src/ui/tooltip.tsx:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L69)_

### `Static` placements

▪ **placements**: _[PopoverPlacements](_airtable_blocks_ui__popover.md#popoverplacements)_ =
Popover.placements

_Defined in
[src/ui/tooltip.tsx:67](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L67)_

## Type aliases

### TooltipProps

Ƭ **TooltipProps**: _Object_

_Defined in
[src/ui/tooltip.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/tooltip.tsx#L26)_

**`type`** {object}

**`property`** {React\$Element<\*>} children Child components to render.

**`property`** {string|Function} content A string representing the contents. Alternatively, you can
include a function that returns a React node to place into the tooltip, which is useful for things
like italicization in the tooltip.

**`property`** {UI.Tooltip.placements.LEFT|UI.Tooltip.placements.CENTER|UI.Tooltip.placements.RIGHT}
[placementX=UI.Tooltip.placements.RIGHT] The horizontal placement of the tooltip.

**`property`** {UI.Tooltip.placements.TOP|UI.Tooltip.placements.CENTER|UI.Tooltip.placements.BOTTOM}
[placementY=UI.Tooltip.placements.CENTER] The vertical placement of the tooltip.

**`property`** {number} [placementOffsetX=12] The horizontal offset, in pixels, of the tooltip. If
`placementX` is set to `UI.Tooltip.placements.LEFT`, a higher number will move the tooltip to the
left. If `placementX` is set to `UI.Tooltip.placements.RIGHT`, a higher number moves the tooltip to
the right. If `placementX` is set to `UI.Tooltip.placements.CENTER`, this value has no effect.

**`property`** {number} [placementOffsetY=0] The vertical offset, in pixels, of the tooltip. If
`placementY` is set to `UI.Tooltip.placements.TOP`, a higher number will move the tooltip upward. If
`placementY` is set to `UI.Tooltip.placements.BOTTOM`, a higher number moves the tooltip downard. If
`placementY` is set to `UI.Tooltip.placements.CENTER`, this value has no effect.

**`property`**
{UI.Tooltip.fitInWindowModes.FLIP|UI.Tooltip.fitInWindowModes.NUDGE|UI.Tooltip.fitInWindowModes.NONE}
[fitInWindowMode=UI.Tooltip.fitInWindowModes.FLIP] Dictates the behavior when the "normal" placement
of the tooltip would be outside of the viewport. If `NONE`, this has no effect, and the tooltip may
be placed off-screen. If `FLIP`, we'll switch the placement to the other side (for example, moving
the tooltip from the left to the right). If `NUDGE`, the tooltip will be "nudged" just enough to fit
on screen.

**`property`** {boolean} [shouldHideTooltipOnClick=false] Should the tooltip be hidden when clicked?

**`property`** {boolean} [disabled] If set to `true`, this tooltip will not be shown. Useful when
trying to disable the tooltip dynamically.

**`property`** {string} [className] Additional class names to attach to the tooltip, separated by
spaces.

**`property`** {object} [style] Additional styles names to attach to the tooltip.
