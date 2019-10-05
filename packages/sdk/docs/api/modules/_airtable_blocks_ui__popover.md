[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Popover](_airtable_blocks_ui__popover.md)

# External module: @airtable/blocks/ui: Popover

## Index

### Classes

-   [Popover](_airtable_blocks_ui__popover.md#popover)

### Type aliases

-   [PopoverProps](_airtable_blocks_ui__popover.md#popoverprops)

### Variables

-   [FitInWindowModes](_airtable_blocks_ui__popover.md#const-fitinwindowmodes)
-   [PopoverPlacements](_airtable_blocks_ui__popover.md#const-popoverplacements)

## Classes

### Popover

• **Popover**:

_Defined in
[src/ui/popover.tsx:76](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L76)_

A popover component, which is used to "float" some content above some other content.

**`see`** [Tooltip](_airtable_blocks_ui__tooltip.md#tooltip)

### `Static` fitInWindowModes

▪ **fitInWindowModes**: _Object_ = FitInWindowModes

_Defined in
[src/ui/popover.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L80)_

### `Static` placements

▪ **placements**: _Object_ = PopoverPlacements

_Defined in
[src/ui/popover.tsx:78](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L78)_

## Type aliases

### PopoverProps

Ƭ **PopoverProps**: _Object_

_Defined in
[src/ui/popover.tsx:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L57)_

**`type`** {object}

**`property`** {React\$Element<\*>} children Child components to render.

**`property`** {Function} renderContent A function that returns the contents of the popover as React
elements.

**`property`** {Popover.placements.LEFT|Popover.placements.CENTER|Popover.placements.RIGHT}
[placementX=Popover.placements.RIGHT] The horizontal placement of the popover.

**`property`** {Popover.placements.TOP|Popover.placements.CENTER|Popover.placements.BOTTOM}
[placementY=Popover.placements.CENTER] The vertical placement of the popover.

**`property`** {number} [placementOffsetX=0] The horizontal offset, in pixels, of the popover. If
`placementX` is set to `Popover.placements.LEFT`, a higher number will move the popover to the left.
If `placementX` is set to `Popover.placements.RIGHT`, a higher number moves the popover to the
right. If `placementX` is set to `Popover.placements.CENTER`, this value has no effect.

**`property`** {number} [placementOffsetY=0] The vertical offset, in pixels, of the popover. If
`placementY` is set to `Popover.placements.TOP`, a higher number will move the popover upward. If
`placementY` is set to `Popover.placements.BOTTOM`, a higher number moves the popover downard. If
`placementY` is set to `Popover.placements.CENTER`, this value has no effect.

**`property`**
{Popover.fitInWindowModes.FLIP|Popover.fitInWindowModes.NUDGE|Popover.fitInWindowModes.NONE}
[fitInWindowMode=Popover.fitInWindowModes.FLIP] Dictates the behavior when the "normal" placement of
the popover would be outside of the viewport. If `NONE`, this has no effect, and the popover may be
placed off-screen. If `FLIP`, we'll switch the placement to the other side (for example, moving the
popover from the left to the right). If `NUDGE`, the popover will be "nudged" just enough to fit on
screen.

**`property`** {Function} [onClose] A function that will be called when the popover closes.

**`property`** {boolean} isOpen A boolean that dictates whether the popover is open.

**`property`** {string} [backgroundClassName=''] Extra class names for the background of the
popover, separated by spaces.

**`property`** {object} [backgroundStyle={}] Extra styles for the background of the popover.

## Variables

### `Const` FitInWindowModes

• **FitInWindowModes**: _Object_ = Object.freeze({ NONE: 'none' as const, FLIP: 'flip' as const,
NUDGE: 'nudge' as const, })

_Defined in
[src/ui/popover.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L36)_

An enum describing the fit-in-window mode. One of `Popover.fitInWindowModes.NONE`,
`Popover.fitInWindowModes.FLIP`, `Popover.fitInWindowModes.NUDGE`.

**`alias`** Popover.fitInWindowModes

---

### `Const` PopoverPlacements

• **PopoverPlacements**: _Object_ = Object.freeze({ TOP: 'top' as const, CENTER: 'center' as const,
BOTTOM: 'bottom' as const, LEFT: 'left' as const, RIGHT: 'right' as const, })

_Defined in
[src/ui/popover.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L21)_

An enum describing popover placements. One of `Popover.placements.TOP`, `Popover.placements.CENTER`,
`Popover.placements.BOTTOM`, `Popover.placements.LEFT`, `Popover.placements.RIGHT`.

**`alias`** Popover.placements
