## expandRecordPickerAsync

Expands a list of records in the Airtable UI, and prompts the user to pick one. The selected record
is returned to the block, and the modal is automatically closed.

If the user dismisses the modal, or another one is opened before this one has been closed, it will
return null.

### Parameters

-   `records` **[Array][1]&lt;Record>** the records the user can pick from. Duplicate records will
    be removed.
-   `opts` **{fields: [Array][1]&lt;Field>?, shouldAllowCreatingRecord: [boolean][2]?}?**

### Examples

```javascript
import {UI} from 'airtable-block';

const record = await UI.expandRecordPickerAsync([record1, record2, record3]);
if (record !== null) {
    alert(record.primaryCellValueAsString);
} else {
    alert('no record picked');
}

const record = await UI.expandRecordPickerAsync([record1, record2], {
    fields: [field1, field2],
});
```

Returns **[Promise][3]&lt;(record | null)>** a Promise that resolves to the record chosen by the
user or null

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
