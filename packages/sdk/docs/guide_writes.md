# Writing changes to records

<!-- NOTE(evanhahn): This file will soon be moved to the docs/ subproject. -->

## Getting started

Three operations are supported, in single and batch formats:

```js
const base = useBase();
const table = base.getTableByName('My writable table');
const records = useRecords(table.selectRecords());

// Update cell values
table.updateRecordAsync(record, {'My field name': 'updated value'});
table.updateRecordsAsync([
    {id: record1.id, fields: {'My field name': 'updated value 1'}},
    {id: record2.id, fields: {'My field name': 'updated value 2'}},
]);

// Create records
table.createRecordAsync();
table.createRecordAsync({'My field name': 'new value'});
table.createRecordsAsync([{'My field name': '1'}, {'My field name': '2'}, {'My field name': '3'}]);

// Delete records
table.deleteRecordAsync(record);
table.deleteRecordsAsync([record1, record2]);
```

That's all you need to get started! See the
[API reference](https://github.com/Airtable/blocks/tree/master/packages/sdk/docs/api.md) for
per-function documentation and examples, or read on for more specific details about how writes work.

## Permissions

In many cases, a particular write might not be permitted. For example:

-   the user of the block might only have read-only access to the base
-   you could be trying to update a cell value in a field that cannot be updated (eg. formula field)

An error will be thrown if you attempt to perform such a write. Use the
`checkPermissionsFor[Action]` helpers to determine whether an action is possible:

```js
function updateRecordIfPossible(record, fieldValue) {
    const fieldsToUpdate = {
        'My field name': fieldValue,
    };
    const checkResult = table.checkPermissionsForUpdateRecord(record, fieldsToUpdate);

    if (checkResult.hasPermission) {
        table.updateRecordAsync(record, fieldsToUpdate);
    } else {
        // if the user does not have permission to perform this action, we provide a message explaining why
        alert(`You could not update the record: ${checkResult.reasonDisplayString}`);
    }
}
```

In situations where you don't have the full specifics of the write yet (eg. you want to know whether
to enable or disable a record creation interface), these helpers all accept _partial_ inputs. There
are also `hasPermissionTo` variants of each permission check that return `boolean` values but no
`reasonDisplayString`:

```js
function shouldShowRecordCreationButton() {
    return table.hasPermissionToCreateRecord();
}

function isFieldValidForEditing(field) {
    // undefined is used as a placeholder for unknown values (eg record being edited, new cell value)
    return table.hasPermissionToUpdateRecord(undefined, {
        [field.id]: undefined,
    });
}
```

To make the check as accurate as possible, provide all the information you have available at the
time.

## Asynchronous updates

All write methods are asynchronous: they return a
[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
that resolves when the update has been persisted to Airtable's servers. (You'll notice there's a
`Saving...` spinner in the top left corner of the Airtable base while this is happening!)

However, we also optimistically apply updates locally: this means that (assuming use of `useRecords`
or similar to watch for updates) your **changes will be reflected within the block and within your
base immediately**, before the updates are saved to Airtable's servers.

In other words: you'll see the changes immediately, but other users may not have received them yet.

This means that you can choose whether or not to wait for the update to be complete based on your
use case. For example, updating cell values may have side effects (eg. if a formula field relies on
it, you need to wait for the update to be complete to get the updated values for the formula field).

The examples in our API documentation use
[async/await syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function),
but you can also use
[`.then`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
async function createRecordWithAsyncAwait(fieldValue) {
    const recordId = await table.createRecordAsync({'My field name': fieldValue});
    alert(`new record created! ID: ${recordId}`);
}

function createRecordWithCallback(record, fieldValue) {
    table.createRecordAsync({'My field name': fieldValue}).then(function(recordId) {
        alert(`new record created! ID: ${recordId}`);
    });
}
```

## Size limits & rate limits

Two size limits apply to writes:

-   Batch methods (`updateRecordsAsync`, `createRecordsAsync`, `deleteRecordsAsync`) may only
    update/create/delete up to 50 records in one call.
    -   Similarly, `globalConfig.setPathsAsync` can only set 50 paths in one call.
-   Any individual write cannot have a payload (eg. `fields` content for `updateRecordAsync`)
    exceeding 1.9mb in size

An error will be thrown if these limits are exceeded.

Additionally, writes are rate-limited (maximum of 15 writes per second). Your block will crash if
this limit is exceeded.

When performing writes to a lot of records, we recommend splitting your updates into batches of 50
and `await`ing individual calls to satisfy these limits:

```js
const BATCH_SIZE = 50;
async function deleteLotsOfRecords(records) {
    let i = 0;
    while (i < records.length) {
        const recordBatch = records.slice(i, i + BATCH_SIZE);
        // awaiting the delete means that next batch won't be deleted until the current batch has been fully deleted,
        // keeping you under the rate limit
        await table.deleteRecordsAsync(recordBatch);
        i += BATCH_SIZE;
    }
}
```

### Special behavior for updating records

For updating records in real time, `await`ing each write can appear laggy (for example, an input
field that syncs the user's typing to an Airtable record in real time).

In order to support these interactions, consecutive `updateRecordAsync` and `updateRecordsAsync`
calls to the same table within a short time period are _merged_ into one request. This means that
they won't be rate limited, as they count as one write request.

If the writes are too large to merge (would exceed the 50 record limit or the 1.9mb size limit) they
will not be merged, so we recommend only relying on this behavior for small updates.
