## expandRecord

Expands the given record in the Airtable UI.

### Parameters

-   `record` **Record** the record to expand
-   `opts` **ExpandRecordOpts?** If `records` is provided, the list will be used to page through
    records from the expanded record dialog.

### Examples

```javascript
import {UI} from 'airtable-block';
UI.expandRecord(record1, {
    records: [record1, record2, record3],
});
```
