[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ProgressBar](_airtable_blocks_ui__progressbar.md)

# External module: @airtable/blocks/ui: ProgressBar

## Index

### Interfaces

-   [ProgressBarProps](_airtable_blocks_ui__progressbar.md#progressbarprops)
-   [ProgressBarStyleProps](_airtable_blocks_ui__progressbar.md#progressbarstyleprops)

### Functions

-   [ProgressBar](_airtable_blocks_ui__progressbar.md#const-progressbar)

## Interfaces

### ProgressBarProps

• **ProgressBarProps**:

_Defined in
[src/ui/progress_bar.tsx:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L99)_

Props for the [ProgressBar](_airtable_blocks_ui__progressbar.md#const-progressbar) component. Also
accepts:

-   [ProgressBarStyleProps](_airtable_blocks_ui__progressbar.md#progressbarstyleprops)

### `Optional` barColor

• **barColor**? : _undefined | string_

_Defined in
[src/ui/progress_bar.tsx:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L101)_

A CSS color, such as `#ff9900`.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/progress_bar.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L105)_

Extra `className`s to apply to the element, separated by spaces.

### progress

• **progress**: _number_

_Defined in
[src/ui/progress_bar.tsx:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L103)_

A number between 0 and 1. 0 is 0% complete, 0.5 is 50% complete, 1 is 100% complete. If you include
a number outside of the range, the value will be clamped to be inside of the range.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/progress_bar.tsx:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L107)_

Extra styles to apply to the progress bar.

---

### ProgressBarStyleProps

• **ProgressBarStyleProps**:

_Defined in
[src/ui/progress_bar.tsx:55](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L55)_

Style props for the [ProgressBar](_airtable_blocks_ui__progressbar.md#const-progressbar) component.
Also accepts:

-   [BackgroundColorProps](_airtable_blocks_ui_system__appearance.md#backgroundcolorprops)
-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [HeightProps](_airtable_blocks_ui_system__dimensions.md#heightprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"block"
| "inline" | "inline-block"›_

_Defined in
[src/ui/progress_bar.tsx:65](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L65)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.

## Functions

### `Const` ProgressBar

▸ **ProgressBar**(`props`:
[ProgressBarProps](_airtable_blocks_ui__progressbar.md#progressbarprops)): _Element‹›_

_Defined in
[src/ui/progress_bar.tsx:127](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/progress_bar.tsx#L127)_

A progress bar.

**Parameters:**

| Name    | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| `props` | [ProgressBarProps](_airtable_blocks_ui__progressbar.md#progressbarprops) |

**Returns:** _Element‹›_
