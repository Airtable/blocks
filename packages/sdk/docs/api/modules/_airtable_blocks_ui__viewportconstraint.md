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
[src/ui/viewport_constraint.tsx:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L47)_

ViewportConstraint - when mounted, applies constraints to the viewport. Like
[addMinSize](_airtable_blocks__viewport.md#addminsize), will fullscreen the block if necessary and
possible when `minSize` is updated.

**`see`** sdk.viewport

**`example`**

```js
import {ViewportConstraint} from '@airtable/blocks/ui';
<ViewportConstraint minSize={{width: 400}} />;
```

**`example`**

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
[src/ui/viewport_constraint.tsx:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L11)_

**`typedef`**

### `Optional` children

• **children**? : _React.ReactNode_

_Defined in
[src/ui/viewport_constraint.tsx:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L17)_

### `Optional` maxFullscreenSize

• **maxFullscreenSize**? :
_[ViewportSizeConstraintProp](_airtable_blocks_ui__viewportconstraint.md#viewportsizeconstraintprop)_

_Defined in
[src/ui/viewport_constraint.tsx:15](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L15)_

### `Optional` minSize

• **minSize**? :
_[ViewportSizeConstraintProp](_airtable_blocks_ui__viewportconstraint.md#viewportsizeconstraintprop)_

_Defined in
[src/ui/viewport_constraint.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L13)_

## Type aliases

### ViewportSizeConstraintProp

Ƭ **ViewportSizeConstraintProp**:
_Partial‹[ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)›_

_Defined in
[src/ui/viewport_constraint.tsx:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L8)_
