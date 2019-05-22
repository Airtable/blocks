## RunInfo

Type: {isFirstRun: [boolean][1], isDevelopmentMode: [boolean][1]}

### Properties

-   `isFirstRun` **[boolean][1]**
-   `isDevelopmentMode` **[boolean][1]**

### Examples

```javascript
import {runInfo} from 'airtable-block';
if (runInfo.isFirstRun) {
    // The current user just installed this block.
    // Take the opportunity to show any onboarding and set
    // sensible defaults if the user has permission.
    // For example, if the block relies on a table, it would
    // make sense to set that to base.activeTable
}
```

## BlockSdk

Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.

### Parameters

-   `airtableInterface` **AirtableInterface**

### globalConfig

Type: GlobalConfig

### base

The current base

Type: Base

### models

Type: any

### installationId

Type: [string][2]

### localStorage

Wrapper for window.localStorage which will automatically fall back to in-memory storage when
window.localStorage is unavailable.

Type: (Storage | InMemoryStorage)

### sessionStorage

Wrapper for window.sessionStorage which will automatically fall back to in-memory storage when
window.sessionStorage is unavailable.

Type: (Storage | InMemoryStorage)

### viewport

Type: Viewport

### runInfo

Type: [RunInfo][3]

### cursor

Type: Cursor

### UI

Type: any

### settingsButton

Type: SettingsButton

### undoRedo

Type: UndoRedo

### reload

Type: function (): void

### reload

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[3]: #runinfo
