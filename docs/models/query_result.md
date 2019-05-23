## QueryResult

**Extends AbstractModelWithAsyncData**

### Parameters

-   `normalizedOpts` **NormalizedQueryResultOpts**
-   `baseData` **BaseData**

### recordIds

The record IDs in this QueryResult. Throws if data is not loaded yet.

Type: [Array][1]&lt;[string][2]>

Returns **[Array][1]&lt;[string][2]>**

### fields

The fields that were used to create this QueryResult. Null if fields were not specified, which means
the QueryResult will load all fields in the table.

Type: ([Array][1]&lt;FieldModel> | null)

Returns **([Array][1]&lt;FieldModel> | null)**

### parentTable

The table that records in this QueryResult are part of

Type: TableModel

Returns **TableModel**

### records

The records in this QueryResult. Throws if data is not loaded yet.

Type: [Array][1]&lt;RecordModel>

Returns **[Array][1]&lt;RecordModel>**

### getRecordByIdIfExists

#### Parameters

-   `recordId` RecordId

Returns `Record | null`

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
