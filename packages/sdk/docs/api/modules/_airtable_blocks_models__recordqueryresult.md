[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: RecordQueryResult](_airtable_blocks_models__recordqueryresult.md)

# External module: @airtable/blocks/models: RecordQueryResult

## Index

### Classes

-   [LinkedRecordsQueryResult](_airtable_blocks_models__recordqueryresult.md#linkedrecordsqueryresult)
-   [RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult)
-   [TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)

### Interfaces

-   [RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts)
-   [SortConfig](_airtable_blocks_models__recordqueryresult.md#sortconfig)

### Type aliases

-   [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)

## Classes

### LinkedRecordsQueryResult

• **LinkedRecordsQueryResult**:

_Defined in
[src/models/linked_records_query_result.ts:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L54)_

Represents a set of records from a LinkedRecord cell value. See
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) for main
documentation.

Do not instantiate. You can get instances of this class by calling
`record.getLinkedRecordsFromCell`.

### fields

• **fields**:

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[fields](_airtable_blocks_models__recordqueryresult.md#fields)_

_Defined in
[src/models/linked_records_query_result.ts:218](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L218)_

The fields that were used to create this LinkedRecordsQueryResult.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDataLoaded

• **isDataLoaded**:

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[isDataLoaded](_airtable_blocks_models__abstract_models.md#isdataloaded)_

_Defined in
[src/models/abstract_model_with_async_data.ts:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L87)_

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### isValid

• **isValid**:

_Defined in
[src/models/linked_records_query_result.ts:162](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L162)_

Is the query result currently valid? This value always starts as 'true', but can become false if the
field config changes to link to a different table or a type other than MULTIPLE_RECORD_LINKS. Once
`isValid` has become false, it will never become true again. Many fields will throw on attempting to
access them, and watches will no longer fire.

### recordIds

• **recordIds**:

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[recordIds](_airtable_blocks_models__recordqueryresult.md#recordids)_

_Defined in
[src/models/linked_records_query_result.ts:181](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L181)_

Ordered array of all the linked record ids. Watchable.

### records

• **records**:

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[records](_airtable_blocks_models__recordqueryresult.md#records)_

_Defined in
[src/models/linked_records_query_result.ts:201](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L201)_

Ordered array of all the linked records. Watchable.

### getRecordById

▸ **getRecordById**(`recordId`: [RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record)_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[getRecordById](_airtable_blocks_models__recordqueryresult.md#getrecordbyid)_

_Defined in
[src/models/record_query_result.ts:430](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L430)_

Get a specific record in the query result, or throws if that record doesn't exist or is filtered
out. Throws if data is not loaded yet. Watch using `'recordIds'`.

**Parameters:**

| Name       | Type                                                    | Description                                                                |
| ---------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `recordId` | [RecordId](_airtable_blocks_models__record.md#recordid) | the ID of the [Record](_airtable_blocks_models__record.md#record) you want |

**Returns:** _[Record](_airtable_blocks_models__record.md#record)_

the record

### getRecordByIdIfExists

▸ **getRecordByIdIfExists**(`recordId`: [RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record) | null_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[getRecordByIdIfExists](_airtable_blocks_models__recordqueryresult.md#getrecordbyidifexists)_

_Defined in
[src/models/record_query_result.ts:414](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L414)_

Get a specific record in the query result, or null if that record doesn't exist or is filtered out.
Throws if data is not loaded yet. Watch using `'recordIds'`.

**Parameters:**

| Name       | Type                                                    | Description                                                                |
| ---------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `recordId` | [RecordId](_airtable_blocks_models__record.md#recordid) | the ID of the [Record](_airtable_blocks_models__record.md#record) you want |

**Returns:** _[Record](_airtable_blocks_models__record.md#record) | null_

the record

### getRecordColor

▸ **getRecordColor**(`recordOrRecordId`: [RecordId](_airtable_blocks_models__record.md#recordid) |
[Record](_airtable_blocks_models__record.md#record)): _[Color](_airtable_blocks_ui__colors.md#color)
| null_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[getRecordColor](_airtable_blocks_models__recordqueryresult.md#getrecordcolor)_

_Defined in
[src/models/record_query_result.ts:467](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L467)_

Get the color of a specific record in the query result. Throws if the record isn't in the
RecordQueryResult. Watch with the `'recordColors'` and `'recordIds` keys.

**Parameters:**

| Name               | Type                                                                                                               | Description                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `recordOrRecordId` | [RecordId](_airtable_blocks_models__record.md#recordid) &#124; [Record](_airtable_blocks_models__record.md#record) | the record or record ID you want the color of. |

**Returns:** _[Color](_airtable_blocks_ui__colors.md#color) | null_

a [Color](_airtable_blocks_ui__colors.md#color), or null if the record has no color in this query
result.

### hasRecord

▸ **hasRecord**(`recordOrRecordId`: [RecordId](_airtable_blocks_models__record.md#recordid) |
[Record](_airtable_blocks_models__record.md#record)): _boolean_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[hasRecord](_airtable_blocks_models__recordqueryresult.md#hasrecord)_

_Defined in
[src/models/record_query_result.ts:454](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L454)_

Check to see if a particular record or record id is present in this query result. Returns false if
the record has been deleted or is filtered out.

**Parameters:**

| Name               | Type                                                                                                               | Description                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `recordOrRecordId` | [RecordId](_airtable_blocks_models__record.md#recordid) &#124; [Record](_airtable_blocks_models__record.md#record) | the record or record id to check the presence of |

**Returns:** _boolean_

whether the record exists in this query result

### loadDataAsync

▸ **loadDataAsync**(): _Promise‹void›_

_Overrides
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[loadDataAsync](_airtable_blocks_models__abstract_models.md#loaddataasync)_

_Defined in
[src/models/linked_records_query_result.ts:281](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L281)_

**Returns:** _Promise‹void›_

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unloadData

▸ **unloadData**(): _void_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unloadData](_airtable_blocks_models__abstract_models.md#unloaddata)_

_Defined in
[src/models/abstract_model_with_async_data.ts:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L151)_

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`:
[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)
|
ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[unwatch](_airtable_blocks_models__recordqueryresult.md#unwatch)_

_Defined in
[src/models/linked_records_query_result.ts:255](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L255)_

**Parameters:**

| Name       | Type                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey) &#124; ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)› |
| `callback` | FlowAnyFunction                                                                                                                                                                                                                                 |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                                                       |

**Returns:**
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

### watch

▸ **watch**(`keys`:
[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)
|
ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[watch](_airtable_blocks_models__recordqueryresult.md#watch)_

_Defined in
[src/models/linked_records_query_result.ts:227](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/linked_records_query_result.ts#L227)_

**Parameters:**

| Name       | Type                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey) &#124; ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)› |
| `callback` | FlowAnyFunction                                                                                                                                                                                                                                 |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                                                       |

**Returns:**
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

---

### RecordQueryResult

• **RecordQueryResult**:

_Defined in
[src/models/record_query_result.ts:210](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L210)_

A RecordQueryResult represents a set of records. It's a little bit like a one-off View in Airtable:
it contains a bunch of records, filtered to a useful subset of the records in the table. Those
records can be sorted according to your specification, and they can be colored by a select field or
using the color from a view. Just like a view, you can either have all the fields in a table
available, or you can just ask for the fields that are relevant to you. There are two types of
QueryResult:

-   [TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)
    is the most common, and is a query result filtered to all the records in a specific
    [Table](_airtable_blocks_models__table.md#table) or
    [View](_airtable_blocks_models__view.md#view). You can get one of these with
    `table.selectRecords()` or `view.selectRecords()`.
-   [LinkedRecordsQueryResult](_airtable_blocks_models__recordqueryresult.md#linkedrecordsqueryresult)
    is a query result of all the records in a particular
    [linked record cell](https://support.airtable.com/hc/en-us/articles/206452848-Linked-record-fields).
    You can get one of these with `record.selectLinkedRecordsFromCell(someField)`.

Once you've got a query result, you need to load it before you can start working with it. When
you're finished, unload it:

```js
async function fetchRecordsAndDoSomethingAsync(myTable) {
    // query for all the records in "myTable"
    const queryResult = myTable.selectRecords();

    // load the data in the query result:
    await queryResult.loadDataAsync();

    // work with the data in the query result
    doSomething(queryResult);

    // when you're done, unload the data:
    queryResult.unloadData();
}
```

If you're using a query result in a React component, you don't need to worry about this. Just use
{@link useRecords}, {@link useRecordIds},
[useRecordById](_airtable_blocks_ui__userecords.md#userecordbyid) or
[useLoadable](_airtable_blocks_ui__useloadable.md#useloadable), which will handle all that for you.

Whilst loaded, a query result will automatically keep up to date with what's in Airtable: records
will get added or removed, the order will change, cell values will be updated, etc. Again, if you're
writing a React component then our hooks will look after that for you. If not, you can get notified
of these changes with `.watch()`.

When calling a `.select*` method, you can pass in a number of options:

##### sorts

Pass an array of sorts to control the order of records within the query result. The first sort in
the array has the highest priority. If you don't specify sorts, the query result will use the
inherent order of the source model: the same order you'd see in the main UI for views and linked
record fields, and an arbitrary (but stable) order for tables.

```js
view.selectRecords({
    sorts: [
        // sort by someField in ascending order...
        {field: someField},
        // then by someOtherField in descending order
        {field: someOtherField, direction: 'desc'},
    ],
});
```

##### fields

Generally, it's a good idea to load as little data into your block as possible - Airtable bases can
get pretty big, and we have to keep all that information in memory and up to date if you ask for it.
The fields option lets you make sure that only data relevant to you is loaded.

You can specify fields with a [Field](_airtable_blocks_models__field.md#field), by ID, or by name:

```js
view.selectRecords({
    fields: [
        // we want to only load fieldA:
        fieldA,
        // the field with this id:
        'fldXXXXXXXXXXXXXX',
        // and the field named 'Rating':
        'Rating',
    ],
});
```

##### recordColorMode

Just like a view in Airtable, you can control the colors of records in a field. There are three
supported record color modes:

By taking the colors the records have according to the rules of a specific view:

```js
import {recordColoring} from '@airtable/blocks/models';

someTable.selectRecords({
    recordColorMode: recordColoring.modes.byView(someView),
});
```

Based on the color of a single select field in the table:

```js
import {recordColoring} from '@airtable/blocks/models';

someView.selectRecords({
    recordColorMode: recordColoring.modes.bySelectField(someSelectField),
});
```

By default, views will have whichever coloring is set up in Airtable and tables won't have any
record coloring:

```js
// these two are the same:
someView.selectRecords();
someView.selectRecords({
    recordColorMode: recordColoring.modes.byView(someView),
});

// as are these two:
someTable.selectRecords();
someTable.selectRecords({
    recordColorMode: recordColoring.modes.none(),
});
```

### fields

• **fields**:

_Defined in
[src/models/record_query_result.ts:240](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L240)_

The fields that were used to create this QueryResult. Null if fields were not specified, which means
the QueryResult will load all fields in the table.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDataLoaded

• **isDataLoaded**:

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[isDataLoaded](_airtable_blocks_models__abstract_models.md#isdataloaded)_

_Defined in
[src/models/abstract_model_with_async_data.ts:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L87)_

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### recordIds

• **recordIds**:

_Defined in
[src/models/record_query_result.ts:223](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L223)_

The record IDs in this QueryResult. Throws if data is not loaded yet. Can be watched.

### records

• **records**:

_Defined in
[src/models/record_query_result.ts:397](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L397)_

The records in this RecordQueryResult. Throws if data is not loaded yet. Can be watched.

### getRecordById

▸ **getRecordById**(`recordId`: [RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record)_

_Defined in
[src/models/record_query_result.ts:430](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L430)_

Get a specific record in the query result, or throws if that record doesn't exist or is filtered
out. Throws if data is not loaded yet. Watch using `'recordIds'`.

**Parameters:**

| Name       | Type                                                    | Description                                                                |
| ---------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `recordId` | [RecordId](_airtable_blocks_models__record.md#recordid) | the ID of the [Record](_airtable_blocks_models__record.md#record) you want |

**Returns:** _[Record](_airtable_blocks_models__record.md#record)_

the record

### getRecordByIdIfExists

▸ **getRecordByIdIfExists**(`recordId`: [RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record) | null_

_Defined in
[src/models/record_query_result.ts:414](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L414)_

Get a specific record in the query result, or null if that record doesn't exist or is filtered out.
Throws if data is not loaded yet. Watch using `'recordIds'`.

**Parameters:**

| Name       | Type                                                    | Description                                                                |
| ---------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `recordId` | [RecordId](_airtable_blocks_models__record.md#recordid) | the ID of the [Record](_airtable_blocks_models__record.md#record) you want |

**Returns:** _[Record](_airtable_blocks_models__record.md#record) | null_

the record

### getRecordColor

▸ **getRecordColor**(`recordOrRecordId`: [RecordId](_airtable_blocks_models__record.md#recordid) |
[Record](_airtable_blocks_models__record.md#record)): _[Color](_airtable_blocks_ui__colors.md#color)
| null_

_Defined in
[src/models/record_query_result.ts:467](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L467)_

Get the color of a specific record in the query result. Throws if the record isn't in the
RecordQueryResult. Watch with the `'recordColors'` and `'recordIds` keys.

**Parameters:**

| Name               | Type                                                                                                               | Description                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `recordOrRecordId` | [RecordId](_airtable_blocks_models__record.md#recordid) &#124; [Record](_airtable_blocks_models__record.md#record) | the record or record ID you want the color of. |

**Returns:** _[Color](_airtable_blocks_ui__colors.md#color) | null_

a [Color](_airtable_blocks_ui__colors.md#color), or null if the record has no color in this query
result.

### hasRecord

▸ **hasRecord**(`recordOrRecordId`: [RecordId](_airtable_blocks_models__record.md#recordid) |
[Record](_airtable_blocks_models__record.md#record)): _boolean_

_Defined in
[src/models/record_query_result.ts:454](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L454)_

Check to see if a particular record or record id is present in this query result. Returns false if
the record has been deleted or is filtered out.

**Parameters:**

| Name               | Type                                                                                                               | Description                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `recordOrRecordId` | [RecordId](_airtable_blocks_models__record.md#recordid) &#124; [Record](_airtable_blocks_models__record.md#record) | the record or record id to check the presence of |

**Returns:** _boolean_

whether the record exists in this query result

### loadDataAsync

▸ **loadDataAsync**(): _Promise‹void›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[loadDataAsync](_airtable_blocks_models__abstract_models.md#loaddataasync)_

_Defined in
[src/models/abstract_model_with_async_data.ts:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L117)_

Will cause all the async data to be fetched and retained. Every call to `loadDataAsync` should have
a matching call to `unloadData`.

Returns a Promise that will resolve once the data is loaded.

**Returns:** _Promise‹void›_

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unloadData

▸ **unloadData**(): _void_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unloadData](_airtable_blocks_models__abstract_models.md#unloaddata)_

_Defined in
[src/models/abstract_model_with_async_data.ts:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L151)_

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`:
[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)
|
ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

_Overrides
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/models/record_query_result.ts:550](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L550)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

Unwatching a key that needs to load data asynchronously will automatically cause the data to be
unloaded.

**Parameters:**

| Name       | Type                                                                                                                                                                                                                                            | Description                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `keys`     | [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey) &#124; ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)› | the keys to unwatch                                         |
| `callback` | FlowAnyFunction                                                                                                                                                                                                                                 | the function passed to `.watch` for these keys              |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                                                       | the context that was passed to `.watch` for this `callback` |

**Returns:**
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`:
[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)
|
ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

_Overrides
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/models/record_query_result.ts:523](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L523)_

Get notified of changes to the query result.

Watchable keys are:

-   `'records'`
-   `'recordIds'`
-   `'cellValues'`
-   `'recordColors'`
-   `'isDataLoaded'`
-   `'cellValuesInField:' + someFieldId`

Every call to `.watch` should have a matching call to `.unwatch`.

Watching a key that needs to load data asynchronously will automatically cause the data to be
fetched. Once the data is available, the `callback` will be called.

**Parameters:**

| Name       | Type                                                                                                                                                                                                                                            | Description                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `keys`     | [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey) &#124; ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)› | the keys to watch                             |
| `callback` | FlowAnyFunction                                                                                                                                                                                                                                 | a function to call when those keys change     |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                                                       | an optional context for `this` in `callback`. |

**Returns:**
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

the array of keys that were watched

---

### TableOrViewQueryResult

• **TableOrViewQueryResult**:

_Defined in
[src/models/table_or_view_query_result.ts:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L56)_

Represents a set of records directly from a view or table. See
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) for main
documentation.

Do not instantiate. You can get instances of this class by calling `table.selectRecords` or
`view.selectRecords`.

### fields

• **fields**:

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[fields](_airtable_blocks_models__recordqueryresult.md#fields)_

_Defined in
[src/models/table_or_view_query_result.ts:237](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L237)_

The fields that were used to create this RecordQueryResult. Null if fields were not specified, which
means the RecordQueryResult will load all fields in the table.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDataLoaded

• **isDataLoaded**:

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[isDataLoaded](_airtable_blocks_models__abstract_models.md#isdataloaded)_

_Defined in
[src/models/abstract_model_with_async_data.ts:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L87)_

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### recordIds

• **recordIds**:

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[recordIds](_airtable_blocks_models__recordqueryresult.md#recordids)_

_Defined in
[src/models/table_or_view_query_result.ts:206](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L206)_

The record IDs in this RecordQueryResult. Throws if data is not loaded yet. Can be watched.

### records

• **records**:

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[records](_airtable_blocks_models__recordqueryresult.md#records)_

_Defined in
[src/models/record_query_result.ts:397](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L397)_

The records in this RecordQueryResult. Throws if data is not loaded yet. Can be watched.

### getRecordById

▸ **getRecordById**(`recordId`: [RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record)_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[getRecordById](_airtable_blocks_models__recordqueryresult.md#getrecordbyid)_

_Defined in
[src/models/record_query_result.ts:430](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L430)_

Get a specific record in the query result, or throws if that record doesn't exist or is filtered
out. Throws if data is not loaded yet. Watch using `'recordIds'`.

**Parameters:**

| Name       | Type                                                    | Description                                                                |
| ---------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `recordId` | [RecordId](_airtable_blocks_models__record.md#recordid) | the ID of the [Record](_airtable_blocks_models__record.md#record) you want |

**Returns:** _[Record](_airtable_blocks_models__record.md#record)_

the record

### getRecordByIdIfExists

▸ **getRecordByIdIfExists**(`recordId`: [RecordId](_airtable_blocks_models__record.md#recordid)):
_[Record](_airtable_blocks_models__record.md#record) | null_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[getRecordByIdIfExists](_airtable_blocks_models__recordqueryresult.md#getrecordbyidifexists)_

_Defined in
[src/models/record_query_result.ts:414](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L414)_

Get a specific record in the query result, or null if that record doesn't exist or is filtered out.
Throws if data is not loaded yet. Watch using `'recordIds'`.

**Parameters:**

| Name       | Type                                                    | Description                                                                |
| ---------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `recordId` | [RecordId](_airtable_blocks_models__record.md#recordid) | the ID of the [Record](_airtable_blocks_models__record.md#record) you want |

**Returns:** _[Record](_airtable_blocks_models__record.md#record) | null_

the record

### getRecordColor

▸ **getRecordColor**(`recordOrRecordId`: [RecordId](_airtable_blocks_models__record.md#recordid) |
[Record](_airtable_blocks_models__record.md#record)): _[Color](_airtable_blocks_ui__colors.md#color)
| null_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[getRecordColor](_airtable_blocks_models__recordqueryresult.md#getrecordcolor)_

_Defined in
[src/models/record_query_result.ts:467](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L467)_

Get the color of a specific record in the query result. Throws if the record isn't in the
RecordQueryResult. Watch with the `'recordColors'` and `'recordIds` keys.

**Parameters:**

| Name               | Type                                                                                                               | Description                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `recordOrRecordId` | [RecordId](_airtable_blocks_models__record.md#recordid) &#124; [Record](_airtable_blocks_models__record.md#record) | the record or record ID you want the color of. |

**Returns:** _[Color](_airtable_blocks_ui__colors.md#color) | null_

a [Color](_airtable_blocks_ui__colors.md#color), or null if the record has no color in this query
result.

### hasRecord

▸ **hasRecord**(`recordOrRecordId`: [RecordId](_airtable_blocks_models__record.md#recordid) |
[Record](_airtable_blocks_models__record.md#record)): _boolean_

_Inherited from
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[hasRecord](_airtable_blocks_models__recordqueryresult.md#hasrecord)_

_Defined in
[src/models/record_query_result.ts:454](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L454)_

Check to see if a particular record or record id is present in this query result. Returns false if
the record has been deleted or is filtered out.

**Parameters:**

| Name               | Type                                                                                                               | Description                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `recordOrRecordId` | [RecordId](_airtable_blocks_models__record.md#recordid) &#124; [Record](_airtable_blocks_models__record.md#record) | the record or record id to check the presence of |

**Returns:** _boolean_

whether the record exists in this query result

### loadDataAsync

▸ **loadDataAsync**(): _Promise‹void›_

_Overrides
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[loadDataAsync](_airtable_blocks_models__abstract_models.md#loaddataasync)_

_Defined in
[src/models/table_or_view_query_result.ts:387](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L387)_

**Returns:** _Promise‹void›_

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unloadData

▸ **unloadData**(): _void_

_Overrides
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unloadData](_airtable_blocks_models__abstract_models.md#unloaddata)_

_Defined in
[src/models/table_or_view_query_result.ts:479](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L479)_

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`:
[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)
|
ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[unwatch](_airtable_blocks_models__recordqueryresult.md#unwatch)_

_Defined in
[src/models/table_or_view_query_result.ts:352](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L352)_

**Parameters:**

| Name       | Type                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey) &#124; ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)› |
| `callback` | FlowAnyFunction                                                                                                                                                                                                                                 |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                                                       |

**Returns:**
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

### watch

▸ **watch**(`keys`:
[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)
|
ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

_Overrides
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult).[watch](_airtable_blocks_models__recordqueryresult.md#watch)_

_Defined in
[src/models/table_or_view_query_result.ts:305](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/table_or_view_query_result.ts#L305)_

**Parameters:**

| Name       | Type                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | [WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey) &#124; ReadonlyArray‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)› |
| `callback` | FlowAnyFunction                                                                                                                                                                                                                                 |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                                                                       |

**Returns:**
_Array‹[WatchableRecordQueryResultKey](_airtable_blocks_models__recordqueryresult.md#watchablerecordqueryresultkey)›_

## Interfaces

### RecordQueryResultOpts

• **RecordQueryResultOpts**:

_Defined in
[src/models/record_query_result.ts:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L73)_

### `Optional` fields

• **fields**? : _Array‹[Field](_airtable_blocks_models__field.md#field) | string | void | null |
false›_

_Defined in
[src/models/record_query_result.ts:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L77)_

The fields (or field names or field ids) to load. Falsey values will be removed.

### `Optional` recordColorMode

• **recordColorMode**? : _null |
[RecordColorMode](_airtable_blocks_models__record_coloring.md#recordcolormode)_

_Defined in
[src/models/record_query_result.ts:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L79)_

How records in this QueryResult should be colored.

### `Optional` sorts

• **sorts**? : _Array‹[SortConfig](_airtable_blocks_models__recordqueryresult.md#sortconfig)›_

_Defined in
[src/models/record_query_result.ts:75](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L75)_

The order in which to sort the query result

---

### SortConfig

• **SortConfig**:

_Defined in
[src/models/record_query_result.ts:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L59)_

### `Optional` direction

• **direction**? : _"asc" | "desc"_

_Defined in
[src/models/record_query_result.ts:63](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L63)_

The order to sort in. Defaults to asc.

### field

• **field**: _[Field](_airtable_blocks_models__field.md#field) |
[FieldId](_airtable_blocks_models__field.md#fieldid) | string_

_Defined in
[src/models/record_query_result.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L61)_

A field, field id, or field name.

## Type aliases

### WatchableRecordQueryResultKey

Ƭ **WatchableRecordQueryResultKey**: _"recordColors" | "records" | "recordIds" | "cellValues" |
"isDataLoaded" | string_

_Defined in
[src/models/record_query_result.ts:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record_query_result.ts#L54)_

A key in [RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) that
can be watched

-   `records`
-   `recordIds`
-   `cellValues`
-   `recordColors`
-   `isDataLoaded`
-   `cellValuesInField:{FIELD_ID}`
