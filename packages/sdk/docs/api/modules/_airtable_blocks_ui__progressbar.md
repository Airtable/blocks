[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ProgressBar](_airtable_blocks_ui__progressbar.md)

# External module: @airtable/blocks/ui: ProgressBar

## Index

### Type aliases

-   [ProgressBarProps](_airtable_blocks_ui__progressbar.md#progressbarprops)

### Functions

-   [ProgressBar](_airtable_blocks_ui__progressbar.md#const-progressbar)

## Type aliases

### ProgressBarProps

Ƭ **ProgressBarProps**: _object & TooltipAnchorProps & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object & object & object_

_Defined in
[src/ui/progress_bar.tsx:85](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/progress_bar.tsx#L85)_

**`typedef`** {object} ProgressBarProps

**`property`** {number} progress A number between 0 and 1. 0 is 0% complete, 0.5 is 50% complete, 1
is 100% complete. If you include a number outside of the range, the value will be clamped to be
inside of the range.

**`property`** {string} [barColor] A CSS color, such as `#ff9900`.

**`property`** {string} [backgroundColor] A CSS color, such as `#ff9900`.

**`property`** {number} [height] A height, in pixels.

**`property`** {string} [className] Extra `className`s to apply to the element, separated by spaces.

**`property`** {object} [style] Extra styles to apply to the progress bar.

## Functions

### `Const` ProgressBar

▸ **ProgressBar**(`props`:
[ProgressBarProps](_airtable_blocks_ui__progressbar.md#progressbarprops)): _Element_

_Defined in
[src/ui/progress_bar.tsx:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/progress_bar.tsx#L113)_

A progress bar.

**Parameters:**

| Name    | Type                                                                     | Description |
| ------- | ------------------------------------------------------------------------ | ----------- |
| `props` | [ProgressBarProps](_airtable_blocks_ui__progressbar.md#progressbarprops) |             |

**Returns:** _Element_
