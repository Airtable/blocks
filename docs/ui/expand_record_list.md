## expandRecordList

Expands a list of records in the Airtable UI

### Parameters

-   `records` **[Array][1]&lt;Record>** the records to expand. Duplicate records will be removed.
-   `opts` **{fields: [Array][1]&lt;Field>?}?**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.expandRecordList([record1, record2, record3]);

UI.expandRecordList([record1, record2], {
    fields: [field1, field2],
});
```

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
