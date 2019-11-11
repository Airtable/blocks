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
[src/ui/popover.tsx:52](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L52)_

Dictates how a [Popover](_airtable_blocks_ui__popover.md#popover) or
[Tooltip](_airtable_blocks_ui__tooltip.md#tooltip) component should be kept within the viewport.
Accessed via `Popover.fitInWindowModes` or `Tooltip.fitInWindowModes`.

### FLIP

• **FLIP**: = "flip"

_Defined in
[src/ui/popover.tsx:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L56)_

If the popover would be placed offscreen, flip the placement to the other side.

### NONE

• **NONE**: = "none"

_Defined in
[src/ui/popover.tsx:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L54)_

Allow the popover to be placed offscreen.

### NUDGE

• **NUDGE**: = "nudge"

_Defined in
[src/ui/popover.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L58)_

If the popover would be placed offscreen, nudge the popover just enough so that it stays in the
viewport.

---

### PopoverPlacements

• **PopoverPlacements**:

_Defined in
[src/ui/popover.tsx:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L21)_

Dictates how a [Popover](_airtable_blocks_ui__popover.md#popover) or
[Tooltip](_airtable_blocks_ui__tooltip.md#tooltip) component should be positioned relative to the
anchor element. Accessed via `Popover.placements` or `Tooltip.placements`.

### BOTTOM

• **BOTTOM**: = "bottom"

_Defined in
[src/ui/popover.tsx:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L25)_

Positions the popover below the anchor element.

### CENTER

• **CENTER**: = "center"

_Defined in
[src/ui/popover.tsx:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L27)_

Positions the popover so it's center aligned with the anchor element.

### LEFT

• **LEFT**: = "left"

_Defined in
[src/ui/popover.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L29)_

Positions the popover left of the anchor element.

### RIGHT

• **RIGHT**: = "right"

_Defined in
[src/ui/popover.tsx:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L31)_

Positions the popover right of the anchor element.

### TOP

• **TOP**: = "top"

_Defined in
[src/ui/popover.tsx:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L23)_

Positions the popover above the anchor element.

## Classes

### Popover

• **Popover**:

_Defined in
[src/ui/popover.tsx:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L97)_

A popover component, which is used to "float" some content above some other content.

## Interfaces

### PopoverProps

• **PopoverProps**:

_Defined in
[src/ui/popover.tsx:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L69)_

Props for the [Popover](_airtable_blocks_ui__popover.md#popover) component.

### `Optional` backgroundClassName

• **backgroundClassName**? : _undefined | string_

_Defined in
[src/ui/popover.tsx:89](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L89)_

Extra class names for the background of the popover, separated by spaces.

### `Optional` backgroundStyle

• **backgroundStyle**? : _FlowAnyObject_

_Defined in
[src/ui/popover.tsx:91](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L91)_

Extra styles for the background of the popover.

### children

• **children**: _ReactElement_

_Defined in
[src/ui/popover.tsx:71](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L71)_

Child elements to render.

### fitInWindowMode

• **fitInWindowMode**: _[FitInWindowMode](_airtable_blocks_ui__popover.md#fitinwindowmode)_

_Defined in
[src/ui/popover.tsx:83](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L83)_

Dictates the behavior when the "normal" placement of the popover would be outside of the viewport.
Defaults to [FitInWindowModes.FLIP](_airtable_blocks_ui__popover.md#flip).

### isOpen

• **isOpen**: _boolean_

_Defined in
[src/ui/popover.tsx:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L87)_

A boolean that dictates whether the popover is open.

### `Optional` onClose

• **onClose**? : _undefined | function_

_Defined in
[src/ui/popover.tsx:85](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L85)_

A function that will be called when the popover closes.

### placementOffsetX

• **placementOffsetX**: _number_

_Defined in
[src/ui/popover.tsx:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L77)_

The horizontal offset, in pixels, of the popover. If `placementX` is set to
[PopoverPlacements.LEFT](_airtable_blocks_ui__popover.md#left), a higher number will move the
popover to the left. If `placementX` is set to
[PopoverPlacements.RIGHT](_airtable_blocks_ui__popover.md#right), a higher number moves the popover
to the right. If `placementX` is set to
[PopoverPlacements.CENTER](_airtable_blocks_ui__popover.md#center), this value has no effect.
Defaults to 0.

### placementOffsetY

• **placementOffsetY**: _number_

_Defined in
[src/ui/popover.tsx:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L79)_

The vertical offset, in pixels, of the popover. If `placementY` is set to
[PopoverPlacements.TOP](_airtable_blocks_ui__popover.md#top), a higher number will move the popover
upward. If `placementY` is set to
[PopoverPlacements.BOTTOM](_airtable_blocks_ui__popover.md#bottom), a higher number moves the
popover downard. If `placementY` is set to
[PopoverPlacements.CENTER](_airtable_blocks_ui__popover.md#center), this value has no effect.
Defaults to 0.

### placementX

• **placementX**: _[PopoverPlacementX](_airtable_blocks_ui__popover.md#popoverplacementx)_

_Defined in
[src/ui/popover.tsx:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L73)_

The horizontal placement of the popover. Defaults to
[PopoverPlacements.RIGHT](_airtable_blocks_ui__popover.md#right).

### placementY

• **placementY**: _[PopoverPlacementY](_airtable_blocks_ui__popover.md#popoverplacementy)_

_Defined in
[src/ui/popover.tsx:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L75)_

The vertical placement of the popover. Defaults to
[PopoverPlacements.CENTER](_airtable_blocks_ui__popover.md#center).

### renderContent

• **renderContent**: _Object_

_Defined in
[src/ui/popover.tsx:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L81)_

A function that returns the contents of the popover as React elements.

## Type aliases

### FitInWindowMode

Ƭ **FitInWindowMode**: _[NONE](_airtable_blocks_ui__popover.md#none) |
[FLIP](_airtable_blocks_ui__popover.md#flip) | [NUDGE](_airtable_blocks_ui__popover.md#nudge)_

_Defined in
[src/ui/popover.tsx:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L64)_

Any of the supported [FitInWindowModes](_airtable_blocks_ui__popover.md#fitinwindowmodes).

---

### PopoverPlacementX

Ƭ **PopoverPlacementX**: _[LEFT](_airtable_blocks_ui__popover.md#left) |
[CENTER](_airtable_blocks_ui__popover.md#center) | [RIGHT](_airtable_blocks_ui__popover.md#right)_

_Defined in
[src/ui/popover.tsx:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L36)_

Any of the supported [PopoverPlacements](_airtable_blocks_ui__popover.md#popoverplacements) for
horizontal positioning.

---

### PopoverPlacementY

Ƭ **PopoverPlacementY**: _[TOP](_airtable_blocks_ui__popover.md#top) |
[CENTER](_airtable_blocks_ui__popover.md#center) | [BOTTOM](_airtable_blocks_ui__popover.md#bottom)_

_Defined in
[src/ui/popover.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/popover.tsx#L43)_

Any of the supported [PopoverPlacements](_airtable_blocks_ui__popover.md#popoverplacements) for
vertical positioning.
