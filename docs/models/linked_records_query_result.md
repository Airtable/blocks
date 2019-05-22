## LinkedRecordsQueryResult

**Extends QueryResult**

Represents a set of records from a LinkedRecord cell value.

Do not instantiate. You can get instances of this class by calling
`record.getLinkedRecordsFromCell`.

### Parameters

-   `record` **RecordModel**
-   `field` **FieldModel**
-   `opts` **QueryResultOpts**

### isValid

Is the query result currently valid? This value always starts as 'true', but can become false if the
field config changes to link to a different table or a type other than MULTIPLE_RECORD_LINKS. Once
`isValid` has become false, it will never become true again. Many fields will throw on attempting to
access them, and watches will no longer fire.

Type: [boolean][1]

Returns **[boolean][1]**

### parentTable

The table that the records in the QueryResult are a part of

Type: TableModel

Returns **TableModel**

### recordIds

Ordered array of all the linked record ids. Watchable.

Type: [Array][2]&lt;[string][3]>

Returns **[Array][2]&lt;[string][3]>**

### records

Ordered array of all the linked records. Watchable.

Type: [Array][2]&lt;RecordModel>

Returns **[Array][2]&lt;RecordModel>**

### fields

The fields that were used to create this LinkedRecordsQueryResult.

Type: ([Array][2]&lt;FieldModel> | null)

Returns **([Array][2]&lt;FieldModel> | null)**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
