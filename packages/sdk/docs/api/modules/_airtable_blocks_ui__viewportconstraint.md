[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: ViewportConstraint](_airtable_blocks_ui__viewportconstraint.md)

# External module: @airtable/blocks/ui: ViewportConstraint

## Index

### Classes

-   [ViewportConstraint](_airtable_blocks_ui__viewportconstraint.md#viewportconstraint)

### Type aliases

-   [ViewportConstraintProps](_airtable_blocks_ui__viewportconstraint.md#viewportconstraintprops)
-   [ViewportSizeConstraintProp](_airtable_blocks_ui__viewportconstraint.md#viewportsizeconstraintprop)

## Classes

### ViewportConstraint

• **ViewportConstraint**:

_Defined in
[src/ui/viewport_constraint.tsx:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L46)_

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

## Type aliases

### ViewportConstraintProps

Ƭ **ViewportConstraintProps**: _Object_

_Defined in
[src/ui/viewport_constraint.tsx:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L13)_

**`typedef`**

---

### ViewportSizeConstraintProp

Ƭ **ViewportSizeConstraintProp**: _Object_

_Defined in
[src/ui/viewport_constraint.tsx:7](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/viewport_constraint.tsx#L7)_

**`typedef`**
