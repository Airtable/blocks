## Record

**Extends AbstractModel**

Model class representing a record in a table.

Do not instantiate. To create a new record, use `table.createRecord`.

### Parameters

-   `baseData` **BaseData**
-   `parentTable` **TableType**
-   `recordId` **[string][1]**

### parentTable

Type: TableType

Returns **TableType**

### getCellValue

#### Parameters

-   `fieldOrFieldIdOrFieldName` **(Field | [string][1])**

Returns **any**

### getCellValueAsString

#### Parameters

-   `fieldOrFieldIdOrFieldName` **(Field | [string][1])**

Returns **[string][1]**

### getAttachmentClientUrlFromCellValueUrl

Call this method with an attachment ID and URL to get back a URL that is suitable for rendering on
the current client. The URL that is returned will only work for the current user.

#### Parameters

-   `attachmentId` **[string][1]**
-   `attachmentUrl` **[string][1]**

Returns **[string][1]**

### getColorInView

Get the color name for this record in the specified view, or null if no color is available. Watch
with the 'colorInView:\${ViewId}' key.

#### Parameters

-   `viewOrViewIdOrViewName` **(ViewType | [string][1])**

Returns **(Color | null)**

### getColorHexInView

Get a CSS hex string for this record in the specified view, or null if no color is available. Watch
with the 'colorInView:\${ViewId}' key

#### Parameters

-   `viewOrViewIdOrViewName` **(ViewType | [string][1])**

Returns **([string][1] | null)**

### selectLinkedRecordsFromCell

#### Parameters

-   `fieldOrFieldIdOrFieldName` **Field | string**
-   `opts` **QueryResultOpts?**

Returns **LinkedRecordsQueryResult**

### url

Returns the URL for this record.

Type: [string][1]

Returns **[string][1]**

### primaryCellValue

Type: any

Returns **any**

### primaryCellValueAsString

Type: [string][1]

Returns **[string][1]**

### canSetCellValue

Use this to check if the current user has permission to update a specific cell value before calling
`setCellValue`.

#### Parameters

-   `fieldOrFieldIdOrFieldName` **(Field | [string][1])**
-   `publicCellValue` **any**

### setCellValue

Use `canSetCellValue` to check if the current user has permission to update a specific cell value
before calling. Will throw if the user does not have permission.

#### Parameters

-   `fieldOrFieldIdOrFieldName` **(Field | [string][1])**
-   `publicCellValue` **any**

Returns **AirtableWriteAction&lt;void, {}>**

### canSetCellValues

Use this to check if the current user has permission to update a set of cell values before calling
`setCellValues`.

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef**

Returns **[boolean][2]**

### setCellValues

Use `canSetCellValues` to check if the current user has permission to update the cell values before
calling. Will throw if the user does not have permission.

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef**

Returns **AirtableWriteAction&lt;void, {}>**

### canDelete

Returns **[boolean][2]**

### delete

Returns **AirtableWriteAction&lt;void, {}>**

### commentCount

Type: [number][3]

Returns **[number][3]**

### createdTime

Type: [Date][4]

Returns **[Date][4]**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date
