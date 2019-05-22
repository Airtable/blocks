## Viewport

**Extends Watchable**

Information about the current viewport

### Parameters

-   `isFullscreen` **[boolean][1]**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {viewport} from 'airtable-block';
```

### enterFullscreen

Request to enter fullscreen mode.

May fail if another block is fullscreen or this block doesn't have permission to fullscreen itself.
Watch `isFullscreen` to know if the request succeeded.

### exitFullscreen

Request to exit fullscreen mode

### maxFullscreenSize

Can be watched. The maximum dimensions of the block when it is in fullscreen mode. Returns the
smallest set of dimensions added with addMaxFullscreenSize. If `width` or `height` is null, it means
there is no maxSize constraint on that dimension. If maxFullscreenSize would be smaller than
minSize, it is constrained to be at least that.

Type: ViewportSizeConstraint

Returns **ViewportSizeConstraint**

### addMaxFullscreenSize

Add a maximum fullscreen size constraint. Returns a function that can be called to remove the
fullscreen size that was added. Use .maxFullscreenSize to get the aggregate of all added
constraints. Both `width` and `height` are optional - if either is set to null, that means there is
no max size in that dimension.

#### Parameters

-   `$0` **\$Shape&lt;ViewportSizeConstraint>**
    -   `$0.width`
    -   `$0.height`

Returns **UnsetFn**

### minSize

Can be watched. The minimum dimensions of the block - if the viewport gets smaller than this size,
an overlay will be shown asking the user to resize the block to be bigger. Returns the largest set
of dimensions added with addMinSize. If `width` or `height` is null, it means there is no minSize
constraint on that dimension.

Type: ViewportSizeConstraint

Returns **ViewportSizeConstraint**

### addMinSize

Add a minimum frame size constraint. Returns a function that can be called to remove the added
constraint. Use .minSize to get the aggregate of all added constraints. Both `width` and `height`
are optional - if either is null, there is no minimum size in that dimension.

#### Parameters

-   `$0` **\$Shape&lt;ViewportSizeConstraint>**
    -   `$0.width`
    -   `$0.height`

Returns **UnsetFn**

### isSmallerThanMinSize

Type: [boolean][1]

Returns **[boolean][1]**

### isFullscreen

Can be watched.

Type: [boolean][1]

Returns **[boolean][1]**

### size

Can be watched.

Type: {width: [number][2], height: [number][2]}

Returns **{width: [number][2], height: [number][2]}**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
