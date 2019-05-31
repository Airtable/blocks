## Cursor

**Extends AbstractModelWithAsyncData**

Contains information about the state of the user's current interactions in Airtable

### Parameters

-   `baseData` **BaseData**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {cursor} from 'airtable-block';
```

### selectedRecordIds

Type: [Array][1]&lt;RecordId>

Returns **[Array][1]&lt;RecordId>**

### isRecordSelected

#### Parameters

-   `recordOrRecordId` **(Record | [string][2])**

Returns **[boolean][3]**

### activeTableId

Type: TableId | null

Returns the currently active table ID. Can return null when the active table has changed and is not
yet loaded.

### activeViewId

Type: ViewId | null

Returns the currently active view ID. This will always be a view belonging to `activeTableId`.
Returns `null` when the active view has changed and is not yet loaded.

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
