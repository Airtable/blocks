[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui/system: Responsive props](_airtable_blocks_ui_system__responsive_props.md)

# External module: @airtable/blocks/ui/system: Responsive props

## Index

### Interfaces

-   [ResponsivePropObject](_airtable_blocks_ui_system__responsive_props.md#responsivepropobject)

### Type aliases

-   [OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)
-   [ResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#responsiveprop)

## Interfaces

### ResponsivePropObject

• **ResponsivePropObject**:

_Defined in
[src/ui/system/utils/types.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L8)_

An object that specifies the responsive behavior of a
[ResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#responsiveprop). For each viewport
size, you may specify the value that will be used for the prop. This is equivalent to defining a
media query in CSS.

### `Optional` largeViewport

• **largeViewport**? : _[T](undefined)_

_Defined in
[src/ui/system/utils/types.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L16)_

Sets the value of this responsive prop in a large viewport.

### `Optional` mediumViewport

• **mediumViewport**? : _[T](undefined)_

_Defined in
[src/ui/system/utils/types.ts:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L14)_

Sets the value of this responsive prop in a medium viewport.

### `Optional` smallViewport

• **smallViewport**? : _[T](undefined)_

_Defined in
[src/ui/system/utils/types.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L12)_

Sets the value of this responsive prop in a small viewport.

### `Optional` xsmallViewport

• **xsmallViewport**? : _[T](undefined)_

_Defined in
[src/ui/system/utils/types.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L10)_

Sets the value of this responsive prop in an extra small viewport.

## Type aliases

### OptionalResponsiveProp

Ƭ **OptionalResponsiveProp**:
_[ResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#responsiveprop)‹T› | undefined |
null_

_Defined in
[src/ui/system/utils/types.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L32)_

An optional [ResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#responsiveprop) that
can be null or undefined.

---

### ResponsiveProp

Ƭ **ResponsiveProp**: _T |
[ResponsivePropObject](_airtable_blocks_ui_system__responsive_props.md#responsivepropobject)‹T›_

_Defined in
[src/ui/system/utils/types.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/system/utils/types.ts#L27)_

A React component prop that may vary based on the viewport width. You can either pass in a single
value that applies to all viewports or a
[ResponsivePropObject](_airtable_blocks_ui_system__responsive_props.md#responsivepropobject) that
specifies responsive behavior.
