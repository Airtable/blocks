## Blocks SDK

Import the SDK from `'@airtable/blocks'`.

The SDK is made up of the following parts:

### [base](/docs/models/global_config.md)

An instance of [Base](/docs/models/base.md) representing the current Airtable base.

### [cursor](/docs/cursor.md)

Returns information about the active table, active view, and selected records.

### [globalConfig](/docs/models/global_config.md)

Storage for this block installation's configuration.

### [models](/docs/models/models)

Contains the model classes, field types, view types, and utilities for working with record coloring
and record aggregation.

### [settingsButton](/docs/settings_button.md)

Controls the block's settings button.

### [UI](/docs/ui.md)

React components, hooks, and UI helpers.

### [viewport](/docs/viewport.md)

Controls the block's viewport. You can fullscreen the block and add size constrains using
`viewport`.

## Top-level helpers

### installationId

Returns the ID for the current block installation.

```javascript
import {installationId} from '@airtable/blocks';
console.log(installationId);
```

### localStorage

Wrapper for [`window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) which will automatically fall back to in-memory storage when
`window.localStorage` is unavailable.


```javascript
import {localStorage} from '@airtable/blocks';
localStorage.setItem('lastScrollTop', 0);
```

### sessionStorage

Wrapper for [`window.sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) which will automatically fall back to in-memory storage when
`window.sessionStorage` is unavailable.

```javascript
import {sessionStorage} from '@airtable/blocks';
sessionStorage.setItem('lastScrollTop', 0);
```

### reload

Call this function to reload your block.

```javascript
import React from 'react';
import {UI, reload} from '@airtable/blocks';
function MyBlock() {
    return <UI.Button onClick={() => reload()}>Reload</UI.Button>;
}
UI.initializeBlock(() => <MyBlock />);
```
