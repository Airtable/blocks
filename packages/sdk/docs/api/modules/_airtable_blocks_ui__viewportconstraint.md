[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ViewportConstraint](_airtable_blocks_ui__viewportconstraint.md)

# External module: @airtable/blocks/ui: ViewportConstraint

## Index

### Classes

-   [ViewportConstraint](_airtable_blocks_ui__viewportconstraint.md#viewportconstraint)

### Interfaces

-   [ViewportConstraintProps](_airtable_blocks_ui__viewportconstraint.md#viewportconstraintprops)

### Type aliases

-   [ViewportSizeConstraintProp](_airtable_blocks_ui__viewportconstraint.md#viewportsizeconstraintprop)

## Classes

### ViewportConstraint

• **ViewportConstraint**:

_Defined in
[src/ui/viewport_constraint.tsx:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/viewport_constraint.tsx#L46)_

When mounted, this wrapper component applies size constraints to the
[Viewport](_airtable_blocks__viewport.md#viewport). Like
[addMinSize](_airtable_blocks__viewport.md#addminsize), this will fullscreen the block if necessary
and possible when `minSize` is updated.

**Example:**

```js
import {ViewportConstraint} from '@airtable/blocks/ui';
<ViewportConstraint minSize={{width: 400}} />;
```

**Example:**

```js
import {ViewportConstraint} from '@airtable/blocks/ui';
<ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
    <div>I need a max fullscreen size!</div>
</ViewportConstraint>;
```

## Interfaces

### ViewportConstraintProps

• **ViewportConstraintProps**:

_Defined in
[src/ui/viewport_constraint.tsx:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/viewport_constraint.tsx#L11)_

Props for the [ViewportConstraint](_airtable_blocks_ui__viewportconstraint.md#viewportconstraint)
component.

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/viewport_constraint.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/viewport_constraint.tsx#L17)_

The contents of the viewport constraint.

### `Optional` maxFullscreenSize

• **maxFullscreenSize**? :
_[ViewportSizeConstraintProp](_airtable_blocks_ui__viewportconstraint.md#viewportsizeconstraintprop)_

_Defined in
[src/ui/viewport_constraint.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/viewport_constraint.tsx#L15)_

The maximum viewport size of the block when it is in fullscreen mode.

### `Optional` minSize

• **minSize**? :
_[ViewportSizeConstraintProp](_airtable_blocks_ui__viewportconstraint.md#viewportsizeconstraintprop)_

_Defined in
[src/ui/viewport_constraint.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/viewport_constraint.tsx#L13)_

The minimum viewport size of the block.

## Type aliases

### ViewportSizeConstraintProp

Ƭ **ViewportSizeConstraintProp**:
_Partial‹[ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)›_

_Defined in
[src/ui/viewport_constraint.tsx:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/viewport_constraint.tsx#L8)_

An object specifying a width and/or height for the block's viewport.
