[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks: viewport](_airtable_blocks__viewport.md)

# External module: @airtable/blocks: viewport

## Index

### Classes

-   [Viewport](_airtable_blocks__viewport.md#viewport)

### Interfaces

-   [ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)

### Type aliases

-   [UnsetFn](_airtable_blocks__viewport.md#unsetfn)
-   [WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)

## Classes

### Viewport

• **Viewport**:

_Defined in
[src/viewport.ts:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L50)_

Information about the current viewport

**Example:**

```js
import {viewport} from '@airtable/blocks';
```

### isFullscreen

• **isFullscreen**:

_Defined in
[src/viewport.ts:254](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L254)_

`true` if the block is fullscreen, `false` otherwise.

### isSmallerThanMinSize

• **isSmallerThanMinSize**:

_Defined in
[src/viewport.ts:245](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L245)_

`true` if the block frame is smaller than `minSize`, `false` otherwise.

### maxFullscreenSize

• **maxFullscreenSize**:

_Defined in
[src/viewport.ts:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L120)_

The maximum dimensions of the block when it is in fullscreen mode. Returns the smallest set of
dimensions added with [addMaxFullscreenSize](_airtable_blocks__viewport.md#addmaxfullscreensize).

If `width` or `height` is null, it means there is no max size constraint on that dimension. If
`maxFullscreenSize` would be smaller than [minSize](_airtable_blocks__viewport.md#minsize), it is
constrained to be at least `minSize`.

### minSize

• **minSize**:

_Defined in
[src/viewport.ts:184](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L184)_

The minimum dimensions of the block - if the viewport gets smaller than this size, an overlay will
be shown asking the user to resize the block to be bigger.

The largest set of dimensions added with addMinSize. If `width` or `height` is null, it means there
is no minSize constraint on that dimension.

### size

• **size**:

_Defined in
[src/viewport.ts:262](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L262)_

The current size of the block frame.

Can be watched.

### addMaxFullscreenSize

▸ **addMaxFullscreenSize**(`sizeConstraint`:
Partial‹[ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)›):
_[UnsetFn](_airtable_blocks__viewport.md#unsetfn)_

_Defined in
[src/viewport.ts:156](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L156)_

Add a maximum fullscreen size constraint. Use `.maxFullscreenSize`` to get the aggregate of all
added constraints.

**Parameters:**

| Name             | Type                                                                                    | Description                                                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sizeConstraint` | Partial‹[ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)› | The width and height constraints to add. Both `width` and `height` are optional - if either is set to null, that means there is no max size in that dimension. |

**Returns:** _[UnsetFn](_airtable_blocks__viewport.md#unsetfn)_

A function that can be called to remove the fullscreen size constraint that was added.

### addMinSize

▸ **addMinSize**(`sizeConstraint`:
Partial‹[ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)›):
_[UnsetFn](_airtable_blocks__viewport.md#unsetfn)_

_Defined in
[src/viewport.ts:211](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L211)_

Add a minimum frame size constraint. Use `.minSize`` to get the aggregate of all added constraints.

Upon adding a constraint, if the block is focused and the frame is smaller than the minimum size,
the block will enter fullscreen mode.

**Parameters:**

| Name             | Type                                                                                    | Description                                                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sizeConstraint` | Partial‹[ViewportSizeConstraint](_airtable_blocks__viewport.md#viewportsizeconstraint)› | The width and height constraints to add. Both `width` and `height` are optional - if either is set to null, that means there is no min size in that dimension. |

**Returns:** _[UnsetFn](_airtable_blocks__viewport.md#unsetfn)_

A function that can be called to remove the size constraint that was added.

### enterFullscreenIfPossible

▸ **enterFullscreenIfPossible**(): _void_

_Defined in
[src/viewport.ts:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L103)_

Request to enter fullscreen mode.

May fail if another block is fullscreen or this block doesn't have permission to fullscreen itself.
Watch `isFullscreen` to know if the request succeeded.

**Returns:** _void_

### exitFullscreen

▸ **exitFullscreen**(): _void_

_Defined in
[src/viewport.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L107)_

Request to exit fullscreen mode

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`: [WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey) |
ReadonlyArray‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)›_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/viewport.ts:310](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L310)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                                                                                                                                        | Description                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `keys`     | [WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey) &#124; ReadonlyArray‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)› | the keys to unwatch                                         |
| `callback` | FlowAnyFunction                                                                                                                                                             | the function passed to `.watch` for these keys              |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                   | the context that was passed to `.watch` for this `callback` |

**Returns:** _Array‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: [WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey) |
ReadonlyArray‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)›_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/viewport.ts:284](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L284)_

Get notified of changes to the viewport.

Watchable keys are:

-   `'isFullscreen'`
-   `'size'`
-   `'minSize'`
-   `'maxFullscreenSize'`

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                                                                                                                                        | Description                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `keys`     | [WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey) &#124; ReadonlyArray‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)› | the keys to watch                             |
| `callback` | FlowAnyFunction                                                                                                                                                             | a function to call when those keys change     |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                   | an optional context for `this` in `callback`. |

**Returns:** _Array‹[WatchableViewportKey](_airtable_blocks__viewport.md#watchableviewportkey)›_

the array of keys that were watched

## Interfaces

### ViewportSizeConstraint

• **ViewportSizeConstraint**:

_Defined in
[src/types/viewport.ts:4](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/viewport.ts#L4)_

A constraint on the size of the Block's viewport

### height

• **height**: _number | null_

_Defined in
[src/types/viewport.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/viewport.ts#L8)_

Height constraint in pixels, or null if no constraint

### width

• **width**: _number | null_

_Defined in
[src/types/viewport.ts:6](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/viewport.ts#L6)_

Width constraint in pixels, or null if no constraint

## Type aliases

### UnsetFn

Ƭ **UnsetFn**: _function_

_Defined in
[src/viewport.ts:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L24)_

#### Type declaration:

▸ (): _void_

---

### WatchableViewportKey

Ƭ **WatchableViewportKey**: _"isFullscreen" | "size" | "minSize" | "maxFullscreenSize"_

_Defined in
[src/viewport.ts:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/viewport.ts#L22)_

Watchable keys in [Viewport](_airtable_blocks__viewport.md#viewport).

-   `isFullscreen`
-   `size`
-   `minSize`
-   `maxFullscreenSize`
