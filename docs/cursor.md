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

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
