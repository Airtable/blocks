## Blocks SDK

Import the SDK from `'@airtable/blocks'`.

The SDK is made up of the following parts:

### globalConfig

### base

### models

### installationId

### localStorage

Wrapper for window.localStorage which will automatically fall back to in-memory storage when
window.localStorage is unavailable.

Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.

### sessionStorage

Wrapper for window.sessionStorage which will automatically fall back to in-memory storage when
window.sessionStorage is unavailable.

### viewport

### cursor

### UI

### settingsButton

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
