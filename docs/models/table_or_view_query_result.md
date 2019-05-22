## TableOrViewQueryResult

**Extends QueryResult**

Represents a set of records directly from a view or table.

Do not instantiate. You can get instances of this class by calling `table.select` or `view.select`.

### Parameters

-   `sourceModel` **(TableModel | ViewModel)**
-   `opts` **QueryResultOpts?**

### parentTable

Type: TableModel

Returns **TableModel**

### parentView

The view that was used to obtain this QueryResult by calling `view.select`. Null if the QueryResult
was obtained by calling `table.select`.

Type: (ViewModel | null)

Returns **(ViewModel | null)**

### recordIds

The record IDs in this QueryResult. Throws if data is not loaded yet.

Type: [Array][1]&lt;[string][2]>

Returns **[Array][1]&lt;[string][2]>**

### \_getOrGenerateRecordIdsSet

The set of record IDs in this QueryResult. Throws if data is not loaded yet.

Returns **{}**

### fields

The fields that were used to create this QueryResult. Null if fields were not specified, which means
the QueryResult will load all fields in the table.

Type: ([Array][1]&lt;FieldModel> | null)

Returns **([Array][1]&lt;FieldModel> | null)**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
