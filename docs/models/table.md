## Table

**Extends AbstractModelWithAsyncData**

Model class representing a table in the base.

### Parameters

-   `baseData` **BaseData**
-   `parentBase` **Base**
-   `tableId` **[string][1]**
-   `airtableInterface` **AirtableInterface**

### parentBase

Type: Base

Returns **Base**

### name

The table's name. Can be watched.

Type: [string][1]

Returns **[string][1]**

### url

Type: [string][1]

Returns **[string][1]**

### primaryField

Every table has exactly one primary field. The primary field of a table will not change.

Type: Field

Returns **Field**

### fields

The fields in this table. The order is arbitrary, since fields are only ordered in the context of a
specific view.

Can be watched to know when fields are created or deleted.

Type: [Array][2]&lt;Field>

Returns **[Array][2]&lt;Field>**

### getFieldByIdIfExists

#### Parameters

-   `fieldId` **[string][1]**

Returns **(Field | null)**

### getFieldById

#### Parameters

-   `fieldId` **[string][1]**

Returns **Field**

### getFieldByNameIfExists

#### Parameters

-   `fieldName` **[string][1]**

Returns **(Field | null)**

### getFieldByName

#### Parameters

-   `fieldName` **[string][1]**

Returns **Field**

### views

The views in the table. Can be watched to know when views are created, deleted, or reordered.

Type: [Array][2]&lt;View>

Returns **[Array][2]&lt;View>**

### getViewByIdIfExists

#### Parameters

-   `viewId` **[string][1]**

Returns **(View | null)**

### getViewById

#### Parameters

-   `viewId` **[string][1]**

Returns **View**

### getViewByNameIfExists

#### Parameters

-   `viewName` **[string][1]**

Returns **(View | null)**

### getViewByName

#### Parameters

-   `viewName` **[string][1]**

Returns **View**

### selectRecords

#### Parameters

-   `opts` **QueryResultOpts?**

Returns **TableOrViewQueryResult**

### recordLimit

Maximum number of records that the table can contain

Type: [number][3]

Returns **[number][3]**

Type: [number][3]

Returns **[number][3]**

### canSetCellValues

#### Parameters

-   `cellValuesByRecordIdThenFieldIdOrFieldName` **{}**

Returns **[boolean][4]**

### setCellValues

#### Parameters

-   `cellValuesByRecordIdThenFieldIdOrFieldName` **{}**

Returns **AirtableWriteAction&lt;void, {}>**

### canCreateRecord

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef?**

Returns **[boolean][4]**

### createRecord

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef?**

Returns **AirtableWriteAction&lt;void, {record: Record}>**

### canCreateRecords

#### Parameters

-   `recordDefsOrNumberOfRecords` **([Array][2]&lt;RecordDef> | [number][3])**

Returns **[boolean][4]**

### createRecords

#### Parameters

-   `recordDefsOrNumberOfRecords` **([Array][2]&lt;RecordDef> | [number][3])**

Returns **AirtableWriteAction&lt;void, {records: [Array][2]&lt;Record>}>**

### canDeleteRecord

#### Parameters

-   `record` **Record**

### deleteRecord

#### Parameters

-   `record` **Record**

Returns **AirtableWriteAction&lt;void, {}>**

### canDeleteRecords

#### Parameters

-   `records` **[Array][2]&lt;Record>**

### deleteRecords

#### Parameters

-   `records` **[Array][2]&lt;Record>**

Returns **AirtableWriteAction&lt;void, {}>**

### getFirstViewOfType

Returns the first view in the table where the type is one of `allowedViewTypes`. If a
`preferredViewOrViewId` is supplied and that view exists & has the correct type, that view will be
returned before checking the other views in the table.

#### Parameters

-   `allowedViewTypes` **([Array][2]&lt;ViewType> | ViewType)**
-   `preferredViewOrViewId?` **(View | ViewId | null)**

Returns **(View | null)**

#### Examples

```js
// get the first grid view, and prefer the currently active view:
const defaultView = table.getFirstViewOfType([viewTypes.GRID], table.activeView);
```

### isRecordMetadataLoaded

Record metadata means record IDs, createdTime, and commentCount are loaded. Record metadata must be
loaded before creating, deleting, or updating records.

Type: [boolean][4]

Returns **[boolean][4]**

### loadRecordMetadataAsync

Loads record metadata. Returns a Promise that resolves when record metadata is loaded.

### unloadRecordMetadata

Unloads record metadata.

### areCellValuesLoadedForFieldId

#### Parameters

-   `fieldId` **[string][1]**

Returns **[boolean][4]**

### loadCellValuesInFieldIdsAsync

This is a low-level API. In most cases, using a `QueryResult` obtained by calling `table.select` or
`view.select` is preferred.

#### Parameters

-   `fieldIds` **[Array][2]&lt;[string][1]>**

### unloadCellValuesInFieldIds

#### Parameters

-   `fieldIds` **[Array][2]&lt;[string][1]>**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
