## RunInfo

Type: {isFirstRun: [boolean][1], isDevelopmentMode: [boolean][1]}

### Properties

-   `isFirstRun` **[boolean][1]**
-   `isDevelopmentMode` **[boolean][1]**

### Examples

```javascript
import {runInfo} from 'airtable-block';
if (runInfo.isFirstRun) {
    // The current user just installed this block.
    // Take the opportunity to show any onboarding and set
    // sensible defaults if the user has permission.
    // For example, if the block relies on a table, it would
    // make sense to set that to base.activeTable
}
```

## BlockSdk

Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.

### Parameters

-   `airtableInterface` **AirtableInterface**

### globalConfig

Type: [GlobalConfig][2]

### base

The current base

Type: [Base][3]

### models

Type: any

### installationId

Type: [string][4]

### localStorage

Wrapper for window.localStorage which will automatically fall back to in-memory storage when
window.localStorage is unavailable.

Type: (Storage | InMemoryStorage)

### sessionStorage

Wrapper for window.sessionStorage which will automatically fall back to in-memory storage when
window.sessionStorage is unavailable.

Type: (Storage | InMemoryStorage)

### viewport

Type: [Viewport][5]

### runInfo

Type: [RunInfo][6]

### cursor

Type: [Cursor][7]

### UI

Type: any

### settingsButton

Type: [SettingsButton][8]

### undoRedo

Type: UndoRedo

### reload

Type: function (): void

### reload

## GlobalConfig

**Extends Watchable**

A key-value store for persisting configuration options for a block installation.

The contents will be synced in real-time to all logged-in users of the installation. Contents will
not be updated in real-time when the installation is running in a publicly shared base, or in
development mode.

Any key can be watched to know when the value of the key changes.

### Parameters

-   `initialKvValuesByKey` **GlobalConfigData**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {globalConfig} from 'airtable-block';
```

### get

#### Parameters

-   `key` **GlobalConfigKey**

Returns **GlobalConfigValue**

### canSet

#### Parameters

-   `key` **GlobalConfigKey**

### set

#### Parameters

-   `key` **GlobalConfigKey**
-   `value` **GlobalConfigValue**

Returns **AirtableWriteAction&lt;void, {}>**

### canSetPaths

#### Parameters

-   `updates` **[Array][9]&lt;GlobalConfigUpdate>**

### setPaths

#### Parameters

-   `updates` **[Array][9]&lt;GlobalConfigUpdate>**

Returns **AirtableWriteAction&lt;void, {}>**

## Watchable

### watch

Start watching the given key or keys. The callback will be called when the value changes. Every call
to `watch` should have a matching call to `unwatch`.

Will log a warning if the keys given are invalid.

#### Parameters

-   `keys` **(WatchableKey | [Array][9]&lt;WatchableKey>)**
-   `callback` **[Function][10]**
-   `context` **[Object][11]??**

Returns **[Array][9]&lt;WatchableKey>**

### unwatch

Stop watching the given key or keys. Should be called with the same arguments that were given to
`watch`.

Will log a warning if the keys given are invalid.

#### Parameters

-   `keys` **(WatchableKey | [Array][9]&lt;WatchableKey>)**
-   `callback` **[Function][10]**
-   `context` **[Object][11]??**

Returns **[Array][9]&lt;WatchableKey>**

## Base

**Extends AbstractModel**

Model class representing a base.

### Parameters

-   `baseData` **BaseData**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {base} from 'airtable-blocks';
```

### name

The name of the base.

Type: [string][4]

Returns **[string][4]**

### currentUser

The current user, or `null` if the block is running in a publicly shared base.

Type: (CollaboratorData | null)

Returns **(CollaboratorData | null)**

### permissionLevel

The current user's permission level.

The value of this should not be consumed and will be deprecated. To know whether a user can perform
an action, use the more specific `can` method.

Can be watched to know when the user's permission level changes. Usually, you'll want to watch this
in your root component and re-render your whole block when the permission level changes.

Type: [string][4]

#### Examples

```javascript
if (globalConfig.canSet('foo')) {
    globalConfig.set('foo', 'bar');
}
```

```javascript
if (record.canSetCellValue('Name', 'Chair')) {
    record.setCellValue('Name', 'Chair');
}
```

Returns **[string][4]**

### activeTable

The table model corresponding to the table the user is currently viewing in Airtable. May be `null`
if the user is switching between tables. Can be watched.

Type: ([Table][12] | null)

Returns **([Table][12] | null)**

### tables

The tables in this base. Can be watched to know when tables are created, deleted, or reordered in
the base.

Type: [Array][9]&lt;[Table][12]>

Returns **[Array][9]&lt;[Table][12]>**

### activeCollaborators

The users who have access to this base.

Type: [Array][9]&lt;CollaboratorData>

Returns **[Array][9]&lt;CollaboratorData>**

### getCollaboratorById

Returns the user matching the given ID, or `null` if that user does not exist or does not have
access to this base.

#### Parameters

-   `collaboratorId` **[string][4]**

Returns **(CollaboratorData | null)**

### getTableById

Returns the table matching the given ID, or `null` if that table does not exist in this base.

#### Parameters

-   `tableId` **[string][4]**

Returns **([Table][12] | null)**

### getTableByName

Returns the table matching the given name, or `null` if no table exists with that name in this base.

#### Parameters

-   `tableName` **[string][4]**

Returns **([Table][12] | null)**

## AbstractModel

**Extends Watchable**

Abstract superclass for all models.

### Parameters

-   `baseData` **BaseData**
-   `modelId` **[string][4]**

### id

The ID for this model.

Type: [string][4]

Returns **[string][4]**

### isDeleted

True if the model has been deleted.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

Type: [boolean][1]

Returns **[boolean][1]**

## fieldTypes

### Examples

```javascript
import {models} from 'airtable-block';
const numberFields = myTable.fields.filter(field => field.config.type === models.fieldTypes.NUMBER);
```

## viewTypes

### Examples

```javascript
import {models} from 'airtable-block';
const gridViews = myTable.views.filter(view => view.type === models.viewTypes.GRID);
```

## generateGuid

Helper to generate a GUID

### Examples

```javascript
import {models} from 'airtable-block';
const id = models.generateGuid();
```

## Table

**Extends AbstractModelWithAsyncData**

Model class representing a table in the base.

### Parameters

-   `baseData` **BaseData**
-   `parentBase` **[Base][3]**
-   `tableId` **[string][4]**
-   `airtableInterface` **AirtableInterface**

### parentBase

Type: [Base][3]

Returns **[Base][3]**

### name

The table's name. Can be watched.

Type: [string][4]

Returns **[string][4]**

### url

Type: [string][4]

Returns **[string][4]**

### primaryField

Every table has exactly one primary field. The primary field of a table will not change.

Type: [Field][13]

Returns **[Field][13]**

### fields

The fields in this table. The order is arbitrary, since fields are only ordered in the context of a
specific view.

Can be watched to know when fields are created or deleted.

Type: [Array][9]&lt;[Field][13]>

Returns **[Array][9]&lt;[Field][13]>**

### getFieldById

#### Parameters

-   `fieldId` **[string][4]**

Returns **([Field][13] | null)**

### getFieldByName

#### Parameters

-   `fieldName` **[string][4]**

Returns **([Field][13] | null)**

### activeView

The view model corresponding to the view the user is currently viewing in Airtable. May be `null` if
the user is switching between tables or views. Can be watched.

Type: ([View][14] | null)

Returns **([View][14] | null)**

### views

The views in the table. Can be watched to know when views are created, deleted, or reordered.

Type: [Array][9]&lt;[View][14]>

Returns **[Array][9]&lt;[View][14]>**

### getViewById

#### Parameters

-   `viewId` **[string][4]**

Returns **([View][14] | null)**

### getViewByName

#### Parameters

-   `viewName` **[string][4]**

Returns **([View][14] | null)**

### select

#### Parameters

-   `opts` **QueryResultOpts?**

Returns **[TableOrViewQueryResult][15]**

### records

The records in this table. The order is arbitrary since records are only ordered in the context of a
specific view.

Type: [Array][9]&lt;[Record][16]>

Returns **[Array][9]&lt;[Record][16]>**

### recordIds

The record IDs in this table. The order is arbitrary since records are only ordered in the context
of a specific view.

Type: [Array][9]&lt;[string][4]>

Returns **[Array][9]&lt;[string][4]>**

### recordCount

Number of records in the table

Type: [number][17]

Returns **[number][17]**

### recordLimit

Maximum number of records that the table can contain

Type: [number][17]

Returns **[number][17]**

### remainingRecordLimit

Maximum number of additional records that can be created in the table

Type: [number][17]

Returns **[number][17]**

### getRecordById

#### Parameters

-   `recordId` **[string][4]**

Returns **([Record][16] | null)**

### canSetCellValues

#### Parameters

-   `cellValuesByRecordIdThenFieldIdOrFieldName` **{}**

Returns **[boolean][1]**

### setCellValues

#### Parameters

-   `cellValuesByRecordIdThenFieldIdOrFieldName` **{}**

Returns **AirtableWriteAction&lt;void, {}>**

### canCreateRecord

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef?**

Returns **[boolean][1]**

### createRecord

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef?**

Returns **AirtableWriteAction&lt;void, {record: [Record][16]}>**

### canCreateRecords

#### Parameters

-   `recordDefsOrNumberOfRecords` **([Array][9]&lt;RecordDef> | [number][17])**

Returns **[boolean][1]**

### createRecords

#### Parameters

-   `recordDefsOrNumberOfRecords` **([Array][9]&lt;RecordDef> | [number][17])**

Returns **AirtableWriteAction&lt;void, {records: [Array][9]&lt;[Record][16]>}>**

### canDeleteRecord

#### Parameters

-   `record` **[Record][16]**

### deleteRecord

#### Parameters

-   `record` **[Record][16]**

Returns **AirtableWriteAction&lt;void, {}>**

### canDeleteRecords

#### Parameters

-   `records` **[Array][9]&lt;[Record][16]>**

### deleteRecords

#### Parameters

-   `records` **[Array][9]&lt;[Record][16]>**

Returns **AirtableWriteAction&lt;void, {}>**

### getFirstViewOfType

#### Parameters

-   `allowedViewTypes` **([Array][9]&lt;ViewType> | ViewType)**

Returns **([View][14] | null)**

### getDefaultViewOfType

If the activeView's type is in allowedViewTypes, then the activeView is returned. Otherwise, the
first view whose type is in allowedViewTypes will be returned. Returns null if no view satisfying
allowedViewTypes exists.

#### Parameters

-   `allowedViewTypes` **([Array][9]&lt;ViewType> | ViewType)**

Returns **([View][14] | null)**

### isRecordMetadataLoaded

Record metadata means record IDs, createdTime, and commentCount are loaded. Record metadata must be
loaded before creating, deleting, or updating records.

Type: [boolean][1]

Returns **[boolean][1]**

### loadRecordMetadataAsync

Loads record metadata. Returns a Promise that resolves when record metadata is loaded.

### unloadRecordMetadata

Unloads record metadata.

### areCellValuesLoadedForFieldId

#### Parameters

-   `fieldId` **[string][4]**

Returns **[boolean][1]**

### loadCellValuesInFieldIdsAsync

This is a low-level API. In most cases, using a `QueryResult` obtained by calling `table.select` or
`view.select` is preferred.

#### Parameters

-   `fieldIds` **[Array][9]&lt;[string][4]>**

### unloadCellValuesInFieldIds

#### Parameters

-   `fieldIds` **[Array][9]&lt;[string][4]>**

## Field

**Extends AbstractModel**

Model class representing a field in a table.

### Parameters

-   `baseData` **BaseData**
-   `parentTable` **TableType**
-   `fieldId` **[string][4]**

### parentTable

Type: TableType

Returns **TableType**

### name

Type: [string][4]

Returns **[string][4]**

### config

Deprecated. Use field.type and field.options instead.

Type: {type: [string][4], options: ([Object][11] | null)}

Returns **{type: [string][4], options: ([Object][11] | null)}**

### type

Type: [string][4]

Returns **[string][4]**

### options

Type: ([Object][11] | null)

Returns **([Object][11] | null)**

### isComputed

Type: [boolean][1]

Returns **[boolean][1]**

### isPrimaryField

Every table has exactly one primary field. True if this field is its parent table's primary field.

Type: [boolean][1]

Returns **[boolean][1]**

### availableAggregators

Type: [Array][9]&lt;[Aggregator][18]>

Returns **[Array][9]&lt;[Aggregator][18]>**

### isAggregatorAvailable

#### Parameters

-   `aggregator` **([Aggregator][18] \| [string][4])**

Returns **[boolean][1]**

### convertStringToCellValue

Given a string, will attempt to parse it and return a valid cell value for the field's current
config.

#### Parameters

-   `string` **[string][4]**

Returns **any**

## View

**Extends AbstractModelWithAsyncData**

Model class representing a view in a table.

### Parameters

-   `baseData` **BaseData**
-   `parentTable` **TableType**
-   `viewId` **[string][4]**
-   `airtableInterface` **AirtableInterface**

### isDataLoaded

Type: [boolean][1]

Returns **[boolean][1]**

### parentTable

Type: TableType

Returns **TableType**

### name

The name of the view. Can be watched.

Type: [string][4]

Returns **[string][4]**

### type

The type of the view. Will not change.

Type: ViewType

Returns **ViewType**

### url

Type: [string][4]

Returns **[string][4]**

### select

#### Parameters

-   `opts` **QueryResultOpts?**

Returns **[TableOrViewQueryResult][15]**

### visibleRecordIds

The record IDs that are not filtered out of this view. Can be watched to know when records are
created, deleted, reordered, or filtered in and out of this view.

Type: [Array][9]&lt;[string][4]>

Returns **[Array][9]&lt;[string][4]>**

### visibleRecords

The records that are not filtered out of this view. Can be watched to know when records are created,
deleted, reordered, or filtered in and out of this view.

Type: [Array][9]&lt;RecordType>

Returns **[Array][9]&lt;RecordType>**

### allFields

All the fields in the table, including fields that are hidden in this view. Can be watched to know
when fields are created, deleted, or reordered.

Type: [Array][9]&lt;FieldType>

Returns **[Array][9]&lt;FieldType>**

### visibleFields

The fields that are not hidden in this view. view. Can be watched to know when fields are created,
deleted, or reordered.

Type: [Array][9]&lt;FieldType>

Returns **[Array][9]&lt;FieldType>**

### getRecordColor

Get the color name for the specified record in this view, or null if no color is available. Watch
with 'recordColors'

#### Parameters

-   `recordOrRecordId` **([string][4] | RecordType)**

Returns **(Color | null)**

### getRecordColorHex

Get the CSS hex color for the specified record in this view, or null if no color is available. Watch
with 'recordColors'

#### Parameters

-   `recordOrRecordId` **([string][4] | RecordType)**

Returns **([string][4] | null)**

## QueryResult

**Extends AbstractModelWithAsyncData**

### Parameters

-   `normalizedOpts` **NormalizedQueryResultOpts**
-   `baseData` **BaseData**

### recordIds

The record IDs in this QueryResult. Throws if data is not loaded yet.

Type: [Array][9]&lt;[string][4]>

Returns **[Array][9]&lt;[string][4]>**

### \_getOrGenerateRecordIdsSet

The set of record IDs in this QueryResult. Throws if data is not loaded yet.

Returns **{}**

### fields

The fields that were used to create this QueryResult. Null if fields were not specified, which means
the QueryResult will load all fields in the table.

Type: ([Array][9]&lt;FieldModel> | null)

Returns **([Array][9]&lt;FieldModel> | null)**

### parentTable

The table that records in this QueryResult are part of

Type: TableModel

Returns **TableModel**

### records

The records in this QueryResult. Throws if data is not loaded yet.

Type: [Array][9]&lt;RecordModel>

Returns **[Array][9]&lt;RecordModel>**

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

Type: [Array][9]&lt;[string][4]>

Returns **[Array][9]&lt;[string][4]>**

### \_getOrGenerateRecordIdsSet

The set of record IDs in this QueryResult. Throws if data is not loaded yet.

Returns **{}**

### fields

The fields that were used to create this QueryResult. Null if fields were not specified, which means
the QueryResult will load all fields in the table.

Type: ([Array][9]&lt;FieldModel> | null)

Returns **([Array][9]&lt;FieldModel> | null)**

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

Type: [Array][9]&lt;[string][4]>

Returns **[Array][9]&lt;[string][4]>**

### records

Ordered array of all the linked records. Watchable.

Type: [Array][9]&lt;RecordModel>

Returns **[Array][9]&lt;RecordModel>**

### fields

The fields that were used to create this LinkedRecordsQueryResult.

Type: ([Array][9]&lt;FieldModel> | null)

Returns **([Array][9]&lt;FieldModel> | null)**

## Aggregator

Aggregators can be used to compute aggregates for cell values.

Type: {key: [string][4], displayName: [string][4], shortDisplayName: [string][4], aggregate:
function (records: [Array][9]&lt;[Record][16]>, field: [Field][13]): any, aggregateToString:
function (records: [Array][9]&lt;[Record][16]>, field: [Field][13]): [string][4]}

### Properties

-   `key` **[string][4]**
-   `displayName` **[string][4]**
-   `shortDisplayName` **[string][4]**
-   `aggregate` **function (records: [Array][9]&lt;[Record][16]>, field: [Field][13]): any**
-   `aggregateToString` **function (records: [Array][9]&lt;[Record][16]>, field: [Field][13]):
    [string][4]**

### Examples

```javascript
// To get a list of aggregators supported for a specific field:
const aggregators = myField.availableAggregators;

// To compute the total attachment size of an attachment field:
import {models} from 'airtable-block';
const aggregator = models.aggregators.totalAttachmentSize;
const value = aggregator.aggregate(myRecords, myAttachmentField);
const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
```

## modes

create a record coloring mode object

### Examples

```javascript
import {models} from 'airtable-block';

// no record coloring:
const recordColorMode = models.recordColoring.modes.none();
// color by select field:
const recordColorMode = models.recordColoring.modes.bySelectField(someSelectField);
// color from view:
const recordColorMode = models.recordColoring.modes.fromView(someView);

// with a query result:
const queryResult = table.select({recordColorMode});
```

## Viewport

**Extends Watchable**

Information about the current viewport

### Parameters

-   `isFullscreen` **[boolean][1]**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {viewport} from 'airtable-block';
```

### enterFullscreen

Request to enter fullscreen mode.

May fail if another block is fullscreen or this block doesn't have permission to fullscreen itself.
Watch `isFullscreen` to know if the request succeeded.

### exitFullscreen

Request to exit fullscreen mode

### maxFullscreenSize

Can be watched. The maximum dimensions of the block when it is in fullscreen mode. Returns the
smallest set of dimensions added with addMaxFullscreenSize. If `width` or `height` is null, it means
there is no maxSize constraint on that dimension. If maxFullscreenSize would be smaller than
minSize, it is constrained to be at least that.

Type: ViewportSizeConstraint

Returns **ViewportSizeConstraint**

### addMaxFullscreenSize

Add a maximum fullscreen size constraint. Returns a function that can be called to remove the
fullscreen size that was added. Use .maxFullscreenSize to get the aggregate of all added
constraints. Both `width` and `height` are optional - if either is set to null, that means there is
no max size in that dimension.

#### Parameters

-   `$0` **\$Shape&lt;ViewportSizeConstraint>**
    -   `$0.width`
    -   `$0.height`

Returns **UnsetFn**

### minSize

Can be watched. The minimum dimensions of the block - if the viewport gets smaller than this size,
an overlay will be shown asking the user to resize the block to be bigger. Returns the largest set
of dimensions added with addMinSize. If `width` or `height` is null, it means there is no minSize
constraint on that dimension.

Type: ViewportSizeConstraint

Returns **ViewportSizeConstraint**

### addMinSize

Add a minimum frame size constraint. Returns a function that can be called to remove the added
constraint. Use .minSize to get the aggregate of all added constraints. Both `width` and `height`
are optional - if either is null, there is no minimum size in that dimension.

#### Parameters

-   `$0` **\$Shape&lt;ViewportSizeConstraint>**
    -   `$0.width`
    -   `$0.height`

Returns **UnsetFn**

### isSmallerThanMinSize

Type: [boolean][1]

Returns **[boolean][1]**

### isFullscreen

Can be watched.

Type: [boolean][1]

Returns **[boolean][1]**

### size

Can be watched.

Type: {width: [number][17], height: [number][17]}

Returns **{width: [number][17], height: [number][17]}**

## Cursor

**Extends AbstractModelWithAsyncData**

Contains information about the state of the user's current interactions in Airtable

### Parameters

-   `baseData` **BaseData**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {cursor} from 'airtable-block';
```

### selectedRecordIds

Type: [Array][9]&lt;RecordId>

Returns **[Array][9]&lt;RecordId>**

### isRecordSelected

#### Parameters

-   `recordOrRecordId` **([Record][16] \| [string][4])**

Returns **[boolean][1]**

## AbstractModelWithAsyncData

**Extends AbstractModel**

Abstract superclass for all block SDK models that need to fetch async data.

### Parameters

-   `baseData` **BaseData**
-   `modelId` **[string][4]**

### watch

Watching a key that needs to load data asynchronously will automatically cause the data to be
fetched. Once the data is available, the callback will be called.

#### Parameters

-   `keys` **(WatchableKey | [Array][9]&lt;WatchableKey>)**
-   `callback` **[Function][10]**
-   `context` **[Object][11]??**

Returns **[Array][9]&lt;WatchableKey>**

### unwatch

Unwatching a key that needs to load data asynchronously will automatically cause the data to be
released. Once the data is available, the callback will be called.

#### Parameters

-   `keys` **(WatchableKey | [Array][9]&lt;WatchableKey>)**
-   `callback` **[Function][10]**
-   `context` **[Object][11]??**

Returns **[Array][9]&lt;WatchableKey>**

### isDataLoaded

Type: [boolean][1]

Returns **[boolean][1]**

### loadDataAsync

Will cause all the async data to be fetched and retained. Every call to `loadDataAsync` should have
a matching call to `unloadData`.

Returns a Promise that will resolve once the data is loaded.

### unloadData

## Record

**Extends AbstractModel**

Model class representing a record in a table.

Do not instantiate. To create a new record, use `table.createRecord`.

### Parameters

-   `baseData` **BaseData**
-   `parentTable` **TableType**
-   `recordId` **[string][4]**

### parentTable

Type: TableType

Returns **TableType**

### getCellValue

#### Parameters

-   `fieldOrFieldIdOrFieldName` **([Field][13] \| [string][4])**

Returns **any**

### getCellValueAsString

#### Parameters

-   `fieldOrFieldIdOrFieldName` **([Field][13] \| [string][4])**

Returns **[string][4]**

### getAttachmentClientUrlFromCellValueUrl

Call this method with an attachment ID and URL to get back a URL that is suitable for rendering on
the current client. The URL that is returned will only work for the current user.

#### Parameters

-   `attachmentId` **[string][4]**
-   `attachmentUrl` **[string][4]**

Returns **[string][4]**

### getColorInView

Get the color name for this record in the specified view, or null if no color is available. Watch
with the 'colorInView:\${ViewId}' key.

#### Parameters

-   `viewOrViewIdOrViewName` **(ViewType | [string][4])**

Returns **(Color | null)**

### getColorHexInView

Get a CSS hex string for this record in the specified view, or null if no color is available. Watch
with the 'colorInView:\${ViewId}' key

#### Parameters

-   `viewOrViewIdOrViewName` **(ViewType | [string][4])**

Returns **([string][4] | null)**

### url

Returns the URL for this record.

Type: [string][4]

Returns **[string][4]**

### primaryCellValue

Type: any

Returns **any**

### primaryCellValueAsString

Type: [string][4]

Returns **[string][4]**

### canSetCellValue

Use this to check if the current user has permission to update a specific cell value before calling
`setCellValue`.

#### Parameters

-   `fieldOrFieldIdOrFieldName` **([Field][13] \| [string][4])**
-   `publicCellValue` **any**

### setCellValue

Use `canSetCellValue` to check if the current user has permission to update a specific cell value
before calling. Will throw if the user does not have permission.

#### Parameters

-   `fieldOrFieldIdOrFieldName` **([Field][13] \| [string][4])**
-   `publicCellValue` **any**

Returns **AirtableWriteAction&lt;void, {}>**

### canSetCellValues

Use this to check if the current user has permission to update a set of cell values before calling
`setCellValues`.

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef**

Returns **[boolean][1]**

### setCellValues

Use `canSetCellValues` to check if the current user has permission to update the cell values before
calling. Will throw if the user does not have permission.

#### Parameters

-   `cellValuesByFieldIdOrFieldName` **RecordDef**

Returns **AirtableWriteAction&lt;void, {}>**

### canDelete

Returns **[boolean][1]**

### delete

Returns **AirtableWriteAction&lt;void, {}>**

### commentCount

Type: [number][17]

Returns **[number][17]**

### createdTime

Type: [Date][19]

Returns **[Date][19]**

## colorUtils

### Examples

```javascript
import {UI} from 'airtable-block';
UI.colorUtils.getHexForColor(UI.colors.RED);
```

### getHexForColor

#### Parameters

-   `color` **[string][4]**

Returns **([string][4] | null)**

### getRgbForColor

#### Parameters

-   `color` **[string][4]**

Returns **({r: [number][17], g: [number][17], b: [number][17]} | null)**

### shouldUseLightTextOnColor

#### Parameters

-   `color` **[string][4]**

Returns **[boolean][1]**

## createDataContainer

Returns a HOC component that will watch and unwatch the specified watchable objects.

Component can either be a stateful React component class, or a stateless functional component.

The getDependencies function will be invoked on componentDidMount, whenever props shallowly change,
and whenever one of the watches returned from the getDependencies function is triggered.

### Parameters

-   `Component` **ComponentType**
-   `getDependencies` **function (props: Props): [Array][9]&lt;WatchDependency?>**
-   `passthruMethodNames` **[Array][9]&lt;[string][4]>?**

### Examples

```javascript
import {UI} from 'airtable-block';
const MyComponentWithData = UI.createDataContainer(MyComponent, getDependencies(props) {
    // This should return an array of dependency objects:
    return [
        // Will call forceUpdate when table name changes.
        {watch: props.table, key: 'name'},

        // Will call this._onFieldsChange when table fields change.
        {watch: props.table, key: 'fields', callback: MyComponent.prototype._onFieldsChange},
    ];
});
```

Returns **ComponentType**

## Synced

**Extends React.Component**

### Parameters

-   `props` **SyncedProps**

## TablePicker

**Extends React.Component**

### Parameters

-   `props` **TablePickerProps**

## TablePickerSynced

**Extends React.Component**

### Parameters

-   `props` **TablePickerSyncedProps**

## FieldPicker

**Extends React.Component**

### Parameters

-   `props` **FieldPickerProps**

## FieldPickerSynced

**Extends React.Component**

### Parameters

-   `props` **FieldPickerSyncedProps**

## ViewPicker

**Extends React.Component**

### Parameters

-   `props` **ViewPickerProps**

## ViewPickerSynced

**Extends React.Component**

### Parameters

-   `props` **ViewPickerSyncedProps**

## Input

**Extends React.Component**

### Parameters

-   `props` **InputProps**

## InputSynced

**Extends React.Component**

### Parameters

-   `props` **InputSyncedProps**

## RadioSynced

**Extends React.Component**

### Parameters

-   `props` **RadioSyncedProps**

## CellRenderer

**Extends React.Component**

### Parameters

-   `props` **CellRendererProps**

## expandRecord

Expands the given record in the Airtable UI.

### Parameters

-   `record` **[Record][16]** the record to expand
-   `opts` **ExpandRecordOpts?** If `records` is provided, the list will be used to page through
    records from the expanded record dialog.

### Examples

```javascript
import {UI} from 'airtable-block';
UI.expandRecord(record1, {
    records: [record1, record2, record3],
});
```

## expandRecordList

Expands a list of records in the Airtable UI

### Parameters

-   `records` **[Array][9]&lt;[Record][16]>** the records to expand. Duplicate records will be
    removed.
-   `opts` **{fields: [Array][9]&lt;[Field][13]>?}?**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.expandRecordList([record1, record2, record3]);

UI.expandRecordList([record1, record2], {
    fields: [field1, field2],
});
```

## expandRecordPickerAsync

Expands a list of records in the Airtable UI, and prompts the user to pick one. The selected record
is returned to the block, and the modal is automatically closed.

If the user dismisses the modal, or another one is opened before this one has been closed, it will
return null.

### Parameters

-   `records` **[Array][9]&lt;[Record][16]>** the records the user can pick from. Duplicate records
    will be removed.
-   `opts` **{fields: [Array][9]&lt;[Field][13]>?, shouldAllowCreatingRecord: [boolean][1]?}?**

### Examples

```javascript
import {UI} from 'airtable-block';

const record = await UI.expandRecordPickerAsync([record1, record2, record3]);
if (record !== null) {
    alert(record.primaryCellValueAsString);
} else {
    alert('no record picked');
}

const record = await UI.expandRecordPickerAsync([record1, record2], {
    fields: [field1, field2],
});
```

Returns **[Promise][20]&lt;(record | null)>** a Promise that resolves to the record chosen by the
user or null

## GlobalAlert

**Extends Watchable**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.globalAlert.showReloadPrompt();
```

### showReloadPrompt

## FieldIcon

### Parameters

-   `props` **FieldIconProps**

## Icon

### Parameters

-   `$0` **IconProps**
    -   `$0.name`
    -   `$0.size`
    -   `$0.scale`
    -   `$0.fillColor`
    -   `$0.className`
    -   `$0.style`
    -   `$0.pathClassName`

## Loader

### Parameters

-   `$0` **LoaderPropTypes**
    -   `$0.fillColor` (optional, default `'#888'`)
    -   `$0.scale` (optional, default `0.3`)

## Tooltip

**Extends React.Component**

### Parameters

-   `props` **TooltipProps**

## CollaboratorToken

### Parameters

-   `props` **CollaboratorTokenProps**

## ChoiceToken

### Parameters

-   `$0` **ChoiceTokenProps**
    -   `$0.choice`
    -   `$0.className`

## ColorPalette

**Extends React.Component**

## ColorPaletteSynced

**Extends React.Component**

## ProgressBar

### Parameters

-   `props` **ProgressBarProps**

## Button

**Extends React.Component**

Clickable button component.

### Parameters

-   `props` **ButtonProps**

### Examples

```javascript
import {UI} from 'airtable-block';
const button = (
    <UI.Button
       disabled={false}
       theme={UI.Button.themes.BLUE}
       onClick={() = alert('Clicked!')}>
        Done
    </UI.Button>
);
```

## RecordCard

**Extends React.Component**

### Parameters

-   `props` **RecordCardProps**

## RecordCardList

**Extends React.Component**

### Parameters

-   `props` **RecordCardListProps**

## Select

**Extends React.Component**

### Parameters

-   `props` **SelectProps**

## SelectSynced

**Extends React.Component**

### Parameters

-   `props` **SelectSyncedProps**

## SelectButtons

**Extends React.Component**

## SelectButtonsSynced

**Extends React.Component**

## Modal

**Extends React.Component**

### Parameters

-   `props` **ModalProps**

## Toggle

**Extends React.Component**

### Parameters

-   `props` **ToggleProps**

## ToggleSynced

**Extends React.Component**

### Parameters

-   `props` **ToggleSyncedProps**

## Popover

**Extends React.Component**

### Parameters

-   `props` **PopoverProps**

## AutocompletePopover

**Extends React.Component**

### Parameters

-   `props` **AutocompletePopoverProps**

## ViewportConstraint

**Extends React.Component**

-   **See: sdk.viewport**

ViewportConstraint - when mounted, applies constraints to the viewport.

### Examples

```javascript
<UI.ViewportConstraint minSize={{width: 400}} />
```

```javascript
<UI.ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
    <div>I need a max fullscreen size!</div>
</UI.ViewportConstraint>
```

## Link

### Parameters

-   `props` **Props**

## loadCSSFromString

Injects CSS from a string into the page.

### Parameters

-   `string` **[string][4]**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.loadCSSFromString('body { background: red; }');
```

Returns **[HTMLStyleElement][21]** the style tag inserted into the page.

## loadCSSFromURLAsync

Injects CSS from a remote URL.

### Parameters

-   `url` **[string][4]**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.loadCSSFromURLAsync('https://example.com/style.css');
```

Returns **[Promise][20]&lt;[HTMLLinkElement][22]>** a Promise that resolves to the style tag
inserted into the page.

## loadScriptFromURLAsync

Injects Javascript from a remote URL.

### Parameters

-   `url` **[string][4]**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.loadScriptFromURLAsync('https://example.com/script.js');
```

Returns **[Promise][20]&lt;[HTMLScriptElement][23]>** a Promise that resolves to the script tag
inserted into the page.

## SettingsButton

**Extends Watchable**

Interface to the settings button that lives outside the block's viewport.

Watch `click` to handle click events on the button.

### Parameters

-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {settingsButton} from 'airtable-block';
settingsButton.isVisible = true;
settingsButton.watch('click', () => {
    alert('Clicked!');
});
```

### isVisible

Whether the settings button is being shown. Set to `true` to show the settings button. Can be
watched.

Type: [boolean][1]

Returns **[boolean][1]**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[2]: #globalconfig
[3]: #base
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[5]: #viewport
[6]: #runinfo
[7]: #cursor
[8]: #settingsbutton
[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[12]: #table
[13]: #field
[14]: #view
[15]: #tableorviewqueryresult
[16]: #record
[17]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[18]: #aggregator
[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date
[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[21]: https://developer.mozilla.org/docs/Web/API/HTMLStyleElement
[22]: https://developer.mozilla.org/docs/Web/API/HTMLLinkElement
[23]: https://developer.mozilla.org/docs/Web/API/HTMLScriptElement
