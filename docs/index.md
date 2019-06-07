## Blocks SDK

Import the SDK from `'@airtable/blocks'`.

The SDK is made up of the following parts:

### globalConfig

Storage for this block installation's configuration.

### base

An instance of Base representing the current Airtable base.

### models

Contains the model classes, field types, view types, and utilities for working with record coloring
and record aggregation.

### installationId

Returns the ID for the current block installation.

### localStorage

Wrapper for `window.localStorage` which will automatically fall back to in-memory storage when
`window.localStorage` is unavailable.

### sessionStorage

Wrapper for window.sessionStorage which will automatically fall back to in-memory storage when
window.sessionStorage is unavailable.

### viewport

Controls the block's viewport. You can fullscreen the block and add size constrains using
`viewport`.

### cursor

Returns information about the active table, active view, and selected records.

### UI

React components, hooks, and UI helpers.

### settingsButton

Controls the block's settings button.

### reload

Call this function to reload your block.

Example:

```javascript
import React from 'react';
import {UI, reload} from '@airtable/blocks';
function MyBlock() {
    return <UI.Button onClick={() => reload()}>Reload</UI.Button>;
}
UI.initializeBlock(() => <MyBlock />);
```
