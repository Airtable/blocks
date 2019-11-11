[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useRecords](_airtable_blocks_ui__userecords.md)

# External module: @airtable/blocks/ui: useRecords

## Index

### Type aliases

-   [AnyQueryResult](_airtable_blocks_ui__userecords.md#anyqueryresult)

### Functions

-   [useRecordById](_airtable_blocks_ui__userecords.md#userecordbyid)

## Type aliases

### AnyQueryResult

Ƭ **AnyQueryResult**:
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult) |
[LinkedRecordsQueryResult](_airtable_blocks_models__recordqueryresult.md#linkedrecordsqueryresult)_

_Defined in
[src/ui/use_records.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_records.ts#L10)_

## Functions

### useRecordById

▸ **useRecordById**(`queryResult`:
[AnyQueryResult](_airtable_blocks_ui__userecords.md#anyqueryresult) | null, `recordId`:
[RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record) | null_

_Defined in
[src/ui/use_records.ts:146](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_records.ts#L146)_

A hook for working with a single record from a query result. Automatically handles loading data in
the query result and updating your component when the records cell values etc. change.

Often used with {@link useRecordIds} to render a list of records where each list item only updates
when the specific record it concerns changes.

**Example:**

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

| Name          | Type                                                                            | Description                                          |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `queryResult` | [AnyQueryResult](_airtable_blocks_ui__userecords.md#anyqueryresult) &#124; null | The query result you want a record from.             |
| `recordId`    | [RecordId](_airtable_blocks_models__record.md#recordid)                         | The ID of the record you want from the query result. |

**Returns:** _[Record](_airtable_blocks_models__record.md#record) | null_

The record, or null if no query result was passed in or no record with that ID exists in the query
result.
