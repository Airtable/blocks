[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks: viewport](_airtable_blocks__viewport.md)

# External module: @airtable/blocks: viewport

## Index

### Classes

-   [Viewport](_airtable_blocks__viewport.md#viewport)

## Classes

### Viewport

• **Viewport**:

_Defined in
[src/viewport.ts:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L46)_

Information about the current viewport

**`example`**

```js
import {viewport} from '@airtable/blocks';
```

### isFullscreen

• **isFullscreen**:

_Defined in
[src/viewport.ts:259](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L259)_

Boolean to denote whether the block is currently fullscreen.

Can be watched.

**`returns`** `true` if the block is fullscreen, `false` otherwise.

### isSmallerThanMinSize

• **isSmallerThanMinSize**:

_Defined in
[src/viewport.ts:246](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L246)_

Boolean to denote whether the block frame is smaller than the `minSize`.

**`returns`** `true` if the block frame is smaller than `minSize`, `false` otherwise.

### maxFullscreenSize

• **maxFullscreenSize**:

_Defined in
[src/viewport.ts:118](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L118)_

The maximum dimensions of the block when it is in fullscreen mode. Returns the smallest set of
dimensions added with [addMaxFullscreenSize](_airtable_blocks__viewport.md#addmaxfullscreensize).

If `width` or `height` is null, it means there is no max size constraint on that dimension. If
`maxFullscreenSize` would be smaller than [minSize](_airtable_blocks__viewport.md#minsize), it is
constrained to be at least `minSize`.

**`returns`** maxSize

### minSize

• **minSize**:

_Defined in
[src/viewport.ts:183](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L183)_

The minimum dimensions of the block - if the viewport gets smaller than this size, an overlay will
be shown asking the user to resize the block to be bigger.

**`returns`** The largest set of dimensions added with addMinSize. If `width` or `height` is null,
it means there is no minSize constraint on that dimension.

### size

• **size**:

_Defined in
[src/viewport.ts:269](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L269)_

The current size of the block frame.

Can be watched.

**`returns`** The current size of the block frame.

### addMaxFullscreenSize

▸ **addMaxFullscreenSize**(`sizeConstraint`: Partial‹ViewportSizeConstraint›): _UnsetFn_

_Defined in
[src/viewport.ts:154](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L154)_

Add a maximum fullscreen size constraint. Use `.maxFullscreenSize`` to get the aggregate of all
added constraints.

**Parameters:**

| Name             | Type                            | Description                                                                                                                                                    |
| ---------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sizeConstraint` | Partial‹ViewportSizeConstraint› | The width and height constraints to add. Both `width` and `height` are optional - if either is set to null, that means there is no max size in that dimension. |

**Returns:** _UnsetFn_

A function that can be called to remove the fullscreen size constraint that was added.

### addMinSize

▸ **addMinSize**(`sizeConstraint`: Partial‹ViewportSizeConstraint›): _UnsetFn_

_Defined in
[src/viewport.ts:210](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L210)_

Add a minimum frame size constraint. Use `.minSize`` to get the aggregate of all added constraints.

Upon adding a constraint, if the block is focused and the frame is smaller than the minimum size,
the block will enter fullscreen mode.

**Parameters:**

| Name             | Type                            | Description                                                                                                                                                    |
| ---------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sizeConstraint` | Partial‹ViewportSizeConstraint› | The width and height constraints to add. Both `width` and `height` are optional - if either is set to null, that means there is no min size in that dimension. |

**Returns:** _UnsetFn_

A function that can be called to remove the size constraint that was added.

### enterFullscreenIfPossible

▸ **enterFullscreenIfPossible**(): _void_

_Defined in
[src/viewport.ts:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L99)_

Request to enter fullscreen mode.

May fail if another block is fullscreen or this block doesn't have permission to fullscreen itself.
Watch `isFullscreen` to know if the request succeeded.

**Returns:** _void_

### exitFullscreen

▸ **exitFullscreen**(): _void_

_Defined in
[src/viewport.ts:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L103)_

Request to exit fullscreen mode

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`: WatchableViewportKey | ReadonlyArray‹WatchableViewportKey›, `callback`:
FlowAnyFunction, `context?`: FlowAnyObject | null): _Array‹WatchableViewportKey›_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/viewport.ts:317](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L317)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                            | Description                                    |
| ---------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableViewportKey &#124; ReadonlyArray‹WatchableViewportKey› | the keys to unwatch                            |
| `callback` | FlowAnyFunction                                                 | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                                       | -                                              |

**Returns:** _Array‹WatchableViewportKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableViewportKey | ReadonlyArray‹WatchableViewportKey›, `callback`:
FlowAnyFunction, `context?`: FlowAnyObject | null): _Array‹WatchableViewportKey›_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/viewport.ts:291](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/viewport.ts#L291)_

Get notified of changes to the viewport.

Watchable keys are:

-   `'isFullscreen'`
-   `'size'`
-   `'minSize'`
-   `'maxFullscreenSize'`

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                            | Description                               |
| ---------- | --------------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableViewportKey &#124; ReadonlyArray‹WatchableViewportKey› | the keys to watch                         |
| `callback` | FlowAnyFunction                                                 | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                                       | -                                         |

**Returns:** _Array‹WatchableViewportKey›_

the array of keys that were watched
