[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Loader](_airtable_blocks_ui__loader.md)

# External module: @airtable/blocks/ui: Loader

## Index

### Type aliases

-   [LoaderProps](_airtable_blocks_ui__loader.md#loaderprops)

### Functions

-   [Loader](_airtable_blocks_ui__loader.md#const-loader)

## Type aliases

### LoaderProps

Ƭ **LoaderProps**: _object & object & object & object & object & object & object & object & object &
object & object & object & object & object & object_

_Defined in
[src/ui/loader.tsx:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/loader.tsx#L43)_

**`typedef`** {object} LoaderProps

**`property`** {string} [fillColor='#888'] The color of the loading spinner.

**`property`** {number} [scale=0.3] A scalar for the loading spinner. Increasing the scale increases
the size of the loading spinner.

**`property`** {string} [className] Additional class names to apply to the loading spinner.

**`property`** {object} [style] Additional styles to apply to the loading spinner.

## Functions

### `Const` Loader

▸ **Loader**(`props`: [LoaderProps](_airtable_blocks_ui__loader.md#loaderprops)): _Element_

_Defined in
[src/ui/loader.tsx:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/loader.tsx#L70)_

A loading spinner component.

**Parameters:**

| Name    | Type                                                      | Description |
| ------- | --------------------------------------------------------- | ----------- |
| `props` | [LoaderProps](_airtable_blocks_ui__loader.md#loaderprops) |             |

**Returns:** _Element_
