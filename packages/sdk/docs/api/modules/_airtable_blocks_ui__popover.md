[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Popover](_airtable_blocks_ui__popover.md)

# External module: @airtable/blocks/ui: Popover

## Index

### Enumerations

-   [FitInWindowModes](_airtable_blocks_ui__popover.md#fitinwindowmodes)
-   [PopoverPlacements](_airtable_blocks_ui__popover.md#popoverplacements)

### Classes

-   [Popover](_airtable_blocks_ui__popover.md#popover)

### Interfaces

-   [PopoverProps](_airtable_blocks_ui__popover.md#popoverprops)

### Type aliases

-   [FitInWindowMode](_airtable_blocks_ui__popover.md#fitinwindowmode)
-   [PopoverPlacementX](_airtable_blocks_ui__popover.md#popoverplacementx)
-   [PopoverPlacementY](_airtable_blocks_ui__popover.md#popoverplacementy)

## Enumerations

### FitInWindowModes

• **FitInWindowModes**:

_Defined in
[src/ui/popover.tsx:38](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L38)_

An enum describing the fit-in-window mode.

**`alias`** Popover.fitInWindowModes

### FLIP

• **FLIP**: = "flip"

_Defined in
[src/ui/popover.tsx:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L40)_

### NONE

• **NONE**: = "none"

_Defined in
[src/ui/popover.tsx:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L39)_

### NUDGE

• **NUDGE**: = "nudge"

_Defined in
[src/ui/popover.tsx:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L41)_

---

### PopoverPlacements

• **PopoverPlacements**:

_Defined in
[src/ui/popover.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L21)_

An enum describing popover placements.

**`alias`** Popover.placements

### BOTTOM

• **BOTTOM**: = "bottom"

_Defined in
[src/ui/popover.tsx:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L24)_

### CENTER

• **CENTER**: = "center"

_Defined in
[src/ui/popover.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L23)_

### LEFT

• **LEFT**: = "left"

_Defined in
[src/ui/popover.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L25)_

### RIGHT

• **RIGHT**: = "right"

_Defined in
[src/ui/popover.tsx:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L26)_

### TOP

• **TOP**: = "top"

_Defined in
[src/ui/popover.tsx:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L22)_

## Classes

### Popover

• **Popover**:

_Defined in
[src/ui/popover.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L80)_

A popover component, which is used to "float" some content above some other content.

**`see`** [Tooltip](_airtable_blocks_ui__tooltip.md#tooltip)

### `Static` fitInWindowModes

▪ **fitInWindowModes**: _[FitInWindowModes](_airtable_blocks_ui__popover.md#fitinwindowmodes)_ =
FitInWindowModes

_Defined in
[src/ui/popover.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L84)_

### `Static` placements

▪ **placements**: _[PopoverPlacements](_airtable_blocks_ui__popover.md#popoverplacements)_ =
PopoverPlacements

_Defined in
[src/ui/popover.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L82)_

## Interfaces

### PopoverProps

• **PopoverProps**:

_Defined in
[src/ui/popover.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L50)_

**`type`** {object}

### `Optional` backgroundClassName

• **backgroundClassName**? : _undefined | string_

_Defined in
[src/ui/popover.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L70)_

Extra class names for the background of the popover, separated by spaces.

### `Optional` backgroundStyle

• **backgroundStyle**? : _FlowAnyObject_

_Defined in
[src/ui/popover.tsx:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L72)_

Extra styles for the background of the popover.

### children

• **children**: _ReactElement_

_Defined in
[src/ui/popover.tsx:52](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L52)_

Child elements to render.

### fitInWindowMode

• **fitInWindowMode**: _[FitInWindowMode](_airtable_blocks_ui__popover.md#fitinwindowmode)_

_Defined in
[src/ui/popover.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L64)_

Dictates the behavior when the "normal" placement of the popover would be outside of the viewport.
If `NONE`, this has no effect, and the popover may be placed off-screen. If `FLIP`, we'll switch the
placement to the other side (for example, moving the popover from the left to the right). If
`NUDGE`, the popover will be "nudged" just enough to fit on screen. Defaults to `"flip"`.

### isOpen

• **isOpen**: _boolean_

_Defined in
[src/ui/popover.tsx:68](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L68)_

A boolean that dictates whether the popover is open.

### `Optional` onClose

• **onClose**? : _undefined | function_

_Defined in
[src/ui/popover.tsx:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L66)_

A function that will be called when the popover closes.

### placementOffsetX

• **placementOffsetX**: _number_

_Defined in
[src/ui/popover.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L58)_

The horizontal offset, in pixels, of the popover. If `placementX` is set to
`Popover.placements.LEFT`, a higher number will move the popover to the left. If `placementX` is set
to `Popover.placements.RIGHT`, a higher number moves the popover to the right. If `placementX` is
set to `Popover.placements.CENTER`, this value has no effect. Defaults to 0.

### placementOffsetY

• **placementOffsetY**: _number_

_Defined in
[src/ui/popover.tsx:60](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L60)_

The vertical offset, in pixels, of the popover. If `placementY` is set to `Popover.placements.TOP`,
a higher number will move the popover upward. If `placementY` is set to `Popover.placements.BOTTOM`,
a higher number moves the popover downard. If `placementY` is set to `Popover.placements.CENTER`,
this value has no effect. Defaults to 0.

### placementX

• **placementX**: _[PopoverPlacementX](_airtable_blocks_ui__popover.md#popoverplacementx)_

_Defined in
[src/ui/popover.tsx:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L54)_

The horizontal placement of the popover. Defaults to `"right"`.

### placementY

• **placementY**: _[PopoverPlacementY](_airtable_blocks_ui__popover.md#popoverplacementy)_

_Defined in
[src/ui/popover.tsx:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L56)_

The vertical placement of the popover. Defaults to `"center"`.

### renderContent

• **renderContent**: _Object_

_Defined in
[src/ui/popover.tsx:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L62)_

A function that returns the contents of the popover as React elements.

## Type aliases

### FitInWindowMode

Ƭ **FitInWindowMode**: _[NONE](_airtable_blocks_ui__popover.md#none) |
[FLIP](_airtable_blocks_ui__popover.md#flip) | [NUDGE](_airtable_blocks_ui__popover.md#nudge)_

_Defined in
[src/ui/popover.tsx:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L45)_

---

### PopoverPlacementX

Ƭ **PopoverPlacementX**: _"left" | "center" | "right"_

_Defined in
[src/ui/popover.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L29)_

---

### PopoverPlacementY

Ƭ **PopoverPlacementY**: _"top" | "center" | "bottom"_

_Defined in
[src/ui/popover.tsx:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/popover.tsx#L31)_
