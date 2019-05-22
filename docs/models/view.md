## View

**Extends AbstractModelWithAsyncData**

Model class representing a view in a table.

### Parameters

-   `baseData` **BaseData**
-   `parentTable` **TableType**
-   `viewId` **[string][1]**
-   `airtableInterface` **AirtableInterface**

### isDataLoaded

Type: [boolean][2]

Returns **[boolean][2]**

### parentTable

Type: TableType

Returns **TableType**

### name

The name of the view. Can be watched.

Type: [string][1]

Returns **[string][1]**

### type

The type of the view. Will not change.

Type: ViewType

Returns **ViewType**

### url

Type: [string][1]

Returns **[string][1]**

### select

#### Parameters

-   `opts` **QueryResultOpts?**

Returns **TableOrViewQueryResult**

### visibleRecordIds

The record IDs that are not filtered out of this view. Can be watched to know when records are
created, deleted, reordered, or filtered in and out of this view.

Type: [Array][3]&lt;[string][1]>

Returns **[Array][3]&lt;[string][1]>**

### visibleRecords

The records that are not filtered out of this view. Can be watched to know when records are created,
deleted, reordered, or filtered in and out of this view.

Type: [Array][3]&lt;RecordType>

Returns **[Array][3]&lt;RecordType>**

### allFields

All the fields in the table, including fields that are hidden in this view. Can be watched to know
when fields are created, deleted, or reordered.

Type: [Array][3]&lt;FieldType>

Returns **[Array][3]&lt;FieldType>**

### visibleFields

The fields that are not hidden in this view. view. Can be watched to know when fields are created,
deleted, or reordered.

Type: [Array][3]&lt;FieldType>

Returns **[Array][3]&lt;FieldType>**

### getRecordColor

Get the color name for the specified record in this view, or null if no color is available. Watch
with 'recordColors'

#### Parameters

-   `recordOrRecordId` **([string][1] | RecordType)**

Returns **(Color | null)**

### getRecordColorHex

Get the CSS hex color for the specified record in this view, or null if no color is available. Watch
with 'recordColors'

#### Parameters

-   `recordOrRecordId` **([string][1] | RecordType)**

Returns **([string][1] | null)**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
