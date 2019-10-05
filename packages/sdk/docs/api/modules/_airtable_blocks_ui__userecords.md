[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useRecords](_airtable_blocks_ui__userecords.md)

# External module: @airtable/blocks/ui: useRecords

## Index

### Functions

-   [useRecordById](_airtable_blocks_ui__userecords.md#userecordbyid)

## Functions

### useRecordById

▸ **useRecordById**(`queryResult`: AnyQueryResult | null, `recordId`: RecordId):
_[Record](_airtable_blocks_models__record.md#record) | null_

_Defined in
[src/ui/use_records.ts:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/use_records.ts#L141)_

A hook for working with a single record from a query result. Automatically handles loading data in
the query result and updating your component when the records cell values etc. change.

Often used with {@link useRecordIds} to render a list of records where each list item only updates
when the specific record it concerns changes.

**`example`**

```js
import {useRecordById, useRecordIds, useBase} from '@airtable/blocks';

// this component concerns a single record - it only updates when that specific record updates
function RecordListItem({queryResult, recordId}) {
    const record = useRecordById(queryResult, recordId);
    return <li>{record.primaryCellValueAsString}</li>;
}

// this component renders a list of records, but doesn't update when their cell values change -
// that's left up to RecordListItem
function RecordList() {
    // get a query result for the records in the first table
    const base = useBase();
    const table = base.tables[0];
    const queryResult = table.selectRecords();

    // grab all the record ids from that query result
    const recordIds = useRecordIds(queryResult);

    // render a list of records:
    return (
        <ul>
            {recordsIds.map(recordId => {
                return (
                    <RecordListItem key={recordId} recordId={recordId} queryResult={queryResult} />
                );
            })}
        </ul>
    );
}
```

**Parameters:**

| Name          | Type                       | Description                                         |
| ------------- | -------------------------- | --------------------------------------------------- |
| `queryResult` | AnyQueryResult &#124; null | the query result you want a record from             |
| `recordId`    | RecordId                   | the ID of the record you want from the query result |

**Returns:** _[Record](_airtable_blocks_models__record.md#record) | null_

the record, or null if no query result was passed in or no record with that ID exists in the query
result
