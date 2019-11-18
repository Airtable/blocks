[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui/system: Flex item](_airtable_blocks_ui_system__flex_item.md)

# External module: @airtable/blocks/ui/system: Flex item

## Index

### Interfaces

-   [AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops)
-   [FlexBasisProps](_airtable_blocks_ui_system__flex_item.md#flexbasisprops)
-   [FlexGrowProps](_airtable_blocks_ui_system__flex_item.md#flexgrowprops)
-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [FlexProps](_airtable_blocks_ui_system__flex_item.md#flexprops)
-   [FlexShrinkProps](_airtable_blocks_ui_system__flex_item.md#flexshrinkprops)
-   [OrderProps](_airtable_blocks_ui_system__flex_item.md#orderprops)

## Interfaces

### AlignSelfProps

• **AlignSelfProps**:

_Defined in
[src/ui/system/flex_item/align_self.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/align_self.ts#L8)_

### `Optional` alignSelf

• **alignSelf**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹AlignSelfProperty›_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

---

### FlexBasisProps

• **FlexBasisProps**:

_Defined in
[src/ui/system/flex_item/flex_basis.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L8)_

### `Optional` flexBasis

• **flexBasis**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹FlexBasisProperty‹Length››_

_Defined in
[src/ui/system/flex_item/flex_basis.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L10)_

Sets the initial main size of a flex item.

---

### FlexGrowProps

• **FlexGrowProps**:

_Defined in
[src/ui/system/flex_item/flex_grow.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L8)_

### `Optional` flexGrow

• **flexGrow**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹GlobalsNumber›_

_Defined in
[src/ui/system/flex_item/flex_grow.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L10)_

Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex
container, items grow to fit according to `flexGrow`.

---

### FlexItemSetProps

• **FlexItemSetProps**:

_Defined in
[src/ui/system/flex_item/flex_item_set.ts:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_item_set.ts#L15)_

Style props for a flex item element.

### `Optional` alignSelf

• **alignSelf**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹AlignSelfProperty›_

_Inherited from
[AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops).[alignSelf](_airtable_blocks_ui_system__flex_item.md#optional-alignself)_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

### `Optional` flex

• **flex**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹FlexProperty‹Length››_

_Inherited from
[FlexProps](_airtable_blocks_ui_system__flex_item.md#flexprops).[flex](_airtable_blocks_ui_system__flex_item.md#optional-flex)_

_Defined in
[src/ui/system/flex_item/flex.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex.ts#L10)_

Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a
shorthand for `flexGrow`, `flexShrink`, and `flexBasis`.

### `Optional` flexBasis

• **flexBasis**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹FlexBasisProperty‹Length››_

_Inherited from
[FlexBasisProps](_airtable_blocks_ui_system__flex_item.md#flexbasisprops).[flexBasis](_airtable_blocks_ui_system__flex_item.md#optional-flexbasis)_

_Defined in
[src/ui/system/flex_item/flex_basis.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L10)_

Sets the initial main size of a flex item.

### `Optional` flexGrow

• **flexGrow**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹GlobalsNumber›_

_Inherited from
[FlexGrowProps](_airtable_blocks_ui_system__flex_item.md#flexgrowprops).[flexGrow](_airtable_blocks_ui_system__flex_item.md#optional-flexgrow)_

_Defined in
[src/ui/system/flex_item/flex_grow.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L10)_

Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex
container, items grow to fit according to `flexGrow`.

### `Optional` flexShrink

• **flexShrink**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹GlobalsNumber›_

_Inherited from
[FlexShrinkProps](_airtable_blocks_ui_system__flex_item.md#flexshrinkprops).[flexShrink](_airtable_blocks_ui_system__flex_item.md#optional-flexshrink)_

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L10)_

Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex
container, items shrink to fit according to `flexShrink`.

### `Optional` order

• **order**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹GlobalsNumber›_

_Inherited from
[OrderProps](_airtable_blocks_ui_system__flex_item.md#orderprops).[order](_airtable_blocks_ui_system__flex_item.md#optional-order)_

_Defined in
[src/ui/system/flex_item/order.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/order.ts#L10)_

Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value
and then by their source code order.

---

### FlexProps

• **FlexProps**:

_Defined in
[src/ui/system/flex_item/flex.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex.ts#L8)_

### `Optional` flex

• **flex**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹FlexProperty‹Length››_

_Defined in
[src/ui/system/flex_item/flex.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex.ts#L10)_

Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a
shorthand for `flexGrow`, `flexShrink`, and `flexBasis`.

---

### FlexShrinkProps

• **FlexShrinkProps**:

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L8)_

### `Optional` flexShrink

• **flexShrink**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹GlobalsNumber›_

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L10)_

Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex
container, items shrink to fit according to `flexShrink`.

---

### OrderProps

• **OrderProps**:

_Defined in
[src/ui/system/flex_item/order.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/order.ts#L8)_

### `Optional` order

• **order**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹GlobalsNumber›_

_Defined in
[src/ui/system/flex_item/order.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/system/flex_item/order.ts#L10)_

Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value
and then by their source code order.
