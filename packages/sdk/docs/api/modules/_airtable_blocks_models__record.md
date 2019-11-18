[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Record](_airtable_blocks_models__record.md)

# External module: @airtable/blocks/models: Record

## Index

### Classes

-   [Record](_airtable_blocks_models__record.md#record)

### Type aliases

-   [RecordDef](_airtable_blocks_models__record.md#recorddef)
-   [RecordId](_airtable_blocks_models__record.md#recordid)
-   [WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)

## Classes

### Record

• **Record**:

_Defined in
[src/models/record.ts:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L48)_

Model class representing a record in a table.

Do not instantiate. You can get instances of this class by calling `table.selectRecords` or
`view.selectRecords` and using the resulting {@RecordQueryResult}.

### commentCount

• **commentCount**:

_Defined in
[src/models/record.ts:355](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L355)_

The number of comments on this record.

**Example:**

```js
const commentCount = myRecord.commentCount;
console.log(`This record has ${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`);
```

### createdTime

• **createdTime**:

_Defined in
[src/models/record.ts:366](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L366)_

The created time of this record.

**Example:**

```js
console.log(`This record was created at ${myRecord.createdTime.toISOString()}`);
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

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

### primaryCellValue

• **primaryCellValue**:

_Defined in
[src/models/record.ts:331](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L331)_

The primary cell value in this record.

**Example:**

```js
console.log(myRecord.primaryCellValue);
// => 'primary cell value'
```

### primaryCellValueAsString

• **primaryCellValueAsString**:

_Defined in
[src/models/record.ts:343](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L343)_

The primary cell value in this record, formatted as a `string`.

**Example:**

```js
console.log(myRecord.primaryCellValueAsString);
// => '42'
```

### url

• **url**:

_Defined in
[src/models/record.ts:316](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L316)_

The URL for the record. You can visit this URL in the browser to be taken to the record in the
Airtable UI.

**Example:**

```js
console.log(myRecord.url);
// => 'https://airtable.com/tblxxxxxxxxxxxxxx/recxxxxxxxxxxxxxx'
```

### getAttachmentClientUrlFromCellValueUrl

▸ **getAttachmentClientUrlFromCellValueUrl**(`attachmentId`: string, `attachmentUrl`: string):
_string_

_Defined in
[src/models/record.ts:255](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L255)_

Returns a URL that is suitable for rendering an attachment on the current client. The URL that is
returned will only work for the current user.

**Example:**

```js
import React from 'react';

function RecordAttachments(props) {
    const {record, attachmentField} = props;
    const attachmentCellValue = record.getCellValue(attachmentField);
    if (attachmentCellValue === null) {
        return null;
    }
    return (
        <div>
            {attachmentCellValue.map(attachmentObj => {
                const clientUrl = record.getAttachmentClientUrlFromCellValueUrl(
                    attachmentObj.id,
                    attachmentObj.url,
                );
                return <img key={attachmentObj.id} src={clientUrl} width={200} />;
            })}
        </div>
    );
}
```

**Parameters:**

| Name            | Type   | Description                                                               |
| --------------- | ------ | ------------------------------------------------------------------------- |
| `attachmentId`  | string | The ID of the attachment.                                                 |
| `attachmentUrl` | string | The attachment's URL (which is not suitable for rendering on the client). |

**Returns:** _string_

A URL that is suitable for rendering on the current client.

### getCellValue

▸ **getCellValue**(`fieldOrFieldIdOrFieldName`: [Field](_airtable_blocks_models__field.md#field) |
[FieldId](_airtable_blocks_models__field.md#fieldid) | string): _unknown_

_Defined in
[src/models/record.ts:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L137)_

Gets a specific cell value in this record.

**Example:**

```js
const cellValue = myRecord.getCellValue(mySingleLineTextField);
console.log(cellValue);
// => 'cell value'
```

**Parameters:**

| Name                        | Type                                                                                                                       | Description                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `fieldOrFieldIdOrFieldName` | [Field](_airtable_blocks_models__field.md#field) &#124; [FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string | The field (or field ID or field name) whose cell value you'd like to get. |

**Returns:** _unknown_

The cell value in the given field.

### getCellValueAsString

▸ **getCellValueAsString**(`fieldOrFieldIdOrFieldName`:
[Field](_airtable_blocks_models__field.md#field) |
[FieldId](_airtable_blocks_models__field.md#fieldid) | string): _string_

_Defined in
[src/models/record.ts:206](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L206)_

Gets a specific cell value in this record, formatted as a `string`.

**Example:**

```js
const cellValueAsString = myRecord.getCellValueAsString(myNumberField);
console.log(cellValueAsString);
// => '42'
```

**Parameters:**

| Name                        | Type                                                                                                                       | Description                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `fieldOrFieldIdOrFieldName` | [Field](_airtable_blocks_models__field.md#field) &#124; [FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string | The field (or field ID or field name) whose cell value you'd like to get. |

**Returns:** _string_

The cell value in the given field, formatted as a `string`.

### getColorHexInView

▸ **getColorHexInView**(`viewOrViewIdOrViewName`: [View](_airtable_blocks_models__view.md#view) |
string): _string | null_

_Defined in
[src/models/record.ts:285](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L285)_

Gets the CSS hex string for this record in a given view.

Can be watched with the 'colorInView:\${ViewId}' key.

**Parameters:**

| Name                     | Type                                                        | Description                                                    |
| ------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------- |
| `viewOrViewIdOrViewName` | [View](_airtable_blocks_models__view.md#view) &#124; string | The view (or view ID or view name) to use for record coloring. |

**Returns:** _string | null_

The CSS hex color for this record in the given view, or null if the record has no color in that
view.

### getColorInView

▸ **getColorInView**(`viewOrViewIdOrViewName`: [View](_airtable_blocks_models__view.md#view) |
[ViewId](_airtable_blocks_models__view.md#viewid) | string):
_[Color](_airtable_blocks_ui__colors.md#color) | null_

_Defined in
[src/models/record.ts:272](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L272)_

Gets the color of this record in a given view.

Can be watched with the 'colorInView:\${ViewId}' key.

**Parameters:**

| Name                     | Type                                                                                                                 | Description                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `viewOrViewIdOrViewName` | [View](_airtable_blocks_models__view.md#view) &#124; [ViewId](_airtable_blocks_models__view.md#viewid) &#124; string | The view (or view ID or view name) to use for record coloring. |

**Returns:** _[Color](_airtable_blocks_ui__colors.md#color) | null_

The color of this record in the given view, or null if the record has no color in that view.

### selectLinkedRecordsFromCell

▸ **selectLinkedRecordsFromCell**(`fieldOrFieldIdOrFieldName`:
[Field](_airtable_blocks_models__field.md#field) |
[FieldId](_airtable_blocks_models__field.md#fieldid) | string, `opts`:
[RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts)):
_[LinkedRecordsQueryResult](_airtable_blocks_models__recordqueryresult.md#linkedrecordsqueryresult)_

_Defined in
[src/models/record.ts:300](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L300)_

Select records referenced in a `multipleRecordLinks` cell value. Returns a query result. See
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) for more.

**Parameters:**

| Name                        | Type                                                                                                                       | Default | Description                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `fieldOrFieldIdOrFieldName` | [Field](_airtable_blocks_models__field.md#field) &#124; [FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string | -       | The `multipleRecordLinks` field (or field ID or field name) to use. |
| `opts`                      | [RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts)                               | {}      | Options for the query, such as sorts and fields.                    |

**Returns:**
_[LinkedRecordsQueryResult](_airtable_blocks_models__recordqueryresult.md#linkedrecordsqueryresult)_

A query result containing the records in the given `multipleRecordLinks` field.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: [WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey) |
ReadonlyArray‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›,
`callback`: function, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

▪ **keys**: _[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey) |
ReadonlyArray‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›_

the keys to unwatch

▪ **callback**: _function_

the function passed to `.watch` for these keys

▸ (`model`: this, `key`:
[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey), ...`args`: Array‹any›):
_unknown_

**Parameters:**

| Name      | Type                                                                        |
| --------- | --------------------------------------------------------------------------- |
| `model`   | this                                                                        |
| `key`     | [WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey) |
| `...args` | Array‹any›                                                                  |

▪`Optional` **context**: _FlowAnyObject | null_

the context that was passed to `.watch` for this `callback`

**Returns:** _Array‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: [WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey) |
ReadonlyArray‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›,
`callback`: function, `context?`: FlowAnyObject | null):
_Array‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

▪ **keys**: _[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey) |
ReadonlyArray‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›_

the keys to watch

▪ **callback**: _function_

a function to call when those keys change

▸ (`model`: this, `key`:
[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey), ...`args`: Array‹any›):
_unknown_

**Parameters:**

| Name      | Type                                                                        |
| --------- | --------------------------------------------------------------------------- |
| `model`   | this                                                                        |
| `key`     | [WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey) |
| `...args` | Array‹any›                                                                  |

▪`Optional` **context**: _FlowAnyObject | null_

an optional context for `this` in `callback`.

**Returns:** _Array‹[WatchableRecordKey](_airtable_blocks_models__record.md#watchablerecordkey)›_

the array of keys that were watched

## Type aliases

### RecordDef

Ƭ **RecordDef**: _ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid), unknown›_

_Defined in
[src/types/record.ts:9](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/record.ts#L9)_

---

### RecordId

Ƭ **RecordId**: _string_

_Defined in
[src/types/record.ts:6](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/record.ts#L6)_

---

### WatchableRecordKey

Ƭ **WatchableRecordKey**: _"cellValues" | "primaryCellValue" | "commentCount" | string_

_Defined in
[src/models/record.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/record.ts#L40)_

Any key within record that can be watched:

-   `'primaryCellValue'`
-   `'commentCount'`
-   `'cellValues'`
-   `'cellValueInField:' + someFieldId`
-   `'colorInView:' + someViewId`
