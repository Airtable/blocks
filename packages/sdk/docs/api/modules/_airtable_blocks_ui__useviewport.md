[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useViewport](_airtable_blocks_ui__useviewport.md)

# External module: @airtable/blocks/ui: useViewport

## Index

### Functions

-   [useViewport](_airtable_blocks_ui__useviewport.md#useviewport)

## Functions

### useViewport

▸ **useViewport**(): _[Viewport](_airtable_blocks__viewport.md#viewport)_

_Defined in
[src/ui/use_viewport.ts:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_viewport.ts#L37)_

Returns the current [Viewport](_airtable_blocks__viewport.md#viewport) object and updates whenever
the viewport size, constraints, or fullscreen status changes.

**Example:**

```js
import {useViewport} from '@airtable/blocks/ui';

function ViewportSize() {
    const viewport = useViewport();

    const toggleFullscreen = () => {
        if (viewport.isFullscreen) {
            viewport.exitFullscreen();
        } else {
            viewport.enterFullscreenIfPossible();
        }
    };

    return (
        <Fragment>
            <button onClick={toggleFullscreen}>Toggle fullscreen</button>
            viewport size: {viewport.size.width}x{viewport.size.height}
        </Fragment>
    );
}
```

**Returns:** _[Viewport](_airtable_blocks__viewport.md#viewport)_

The current viewport.
