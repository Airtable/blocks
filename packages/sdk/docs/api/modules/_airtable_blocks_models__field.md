[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Field](_airtable_blocks_models__field.md)

# External module: @airtable/blocks/models: Field

## Index

### Classes

-   [Field](_airtable_blocks_models__field.md#field)

### Variables

-   [FieldTypes](_airtable_blocks_models__field.md#const-fieldtypes)

## Classes

### Field

• **Field**:

_Defined in
[src/models/field.ts:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L47)_

Model class representing a field in a table.

**`example`**

```js
import {base} from '@airtable/blocks';

const table = base.getTableByName('Table 1');
const field = table.getFieldByName('Name');
console.log('The type of this field is', field.type);
```

### availableAggregators

• **availableAggregators**:

_Defined in
[src/models/field.ts:251](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L251)_

**`function`**

**`returns`** A list of available aggregators given this field's configuration.

**`example`**

```js
const fieldAggregators = myField.availableAggregators;
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L41)_

**`function`**

**`returns`** The ID for this model.

### isComputed

• **isComputed**:

_Defined in
[src/models/field.ts:231](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L231)_

**`function`**

**`returns`** `true` if this field is computed, `false` otherwise. A field is "computed" if it's
value is not set by user input (e.g. autoNumber, formula, etc.). Can be watched.

**`example`**

```js
console.log(mySingleLineTextField.isComputed);
// => false
console.log(myAutoNumberField.isComputed);
// => true
```

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L73)_

A boolean denoting whether the model has been deleted.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

**`function`**

**`returns`** `true` if the model has been deleted, and `false` otherwise.

### isPrimaryField

• **isPrimaryField**:

_Defined in
[src/models/field.ts:240](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L240)_

**`function`**

**`returns`** `true` if this field is its parent table's primary field, `false` otherwise. Should
never change because the primary field of a table cannot change.

### name

• **name**:

_Defined in
[src/models/field.ts:166](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L166)_

**`function`**

**`returns`** The name of the field. Can be watched.

**`example`**

```js
console.log(myField.name);
// => 'Name'
```

### options

• **options**:

_Defined in
[src/models/field.ts:208](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L208)_

**`function`**

**`returns`** The configuration options of the field. The structure of the field's options depend on
the field's type. Can be watched.

**`example`**

```js
import {fieldTypes} from '@airtable/blocks/models';

if (myField.type === fieldTypes.CURRENCY) {
    console.log(myField.options.symbol);
    // => '$'
}
```

### type

• **type**:

_Defined in
[src/models/field.ts:178](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L178)_

**`function`**

**`returns`** The type of the field. Can be watched.

**`example`**

```js
console.log(myField.type);
// => 'singleLineText'
```

### convertStringToCellValue

▸ **convertStringToCellValue**(`string`: string): _unknown_

_Defined in
[src/models/field.ts:306](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L306)_

Given a string, will attempt to parse it and return a valid cell value for the field's current
config.

**`example`**

```js
const inputString = '42';
const cellValue = myNumberField.convertStringToCellValue(inputString);
console.log(cellValue === 42);
// => true
```

**Parameters:**

| Name     | Type   | Description          |
| -------- | ------ | -------------------- |
| `string` | string | The string to parse. |

**Returns:** _unknown_

The parsed cell value, or `null` if unable to parse the given string.

### isAggregatorAvailable

▸ **isAggregatorAvailable**(`aggregator`:
[Aggregator](_airtable_blocks_models__aggregators.md#aggregator) | keyof object): _boolean_

_Defined in
[src/models/field.ts:280](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L280)_

**`function`**

**`example`**

```js
import {aggregators} from '@airtable/blocks/models';
const aggregator = aggregators.totalAttachmentSize;

// Using an aggregator object
console.log(myAttachmentField.isAggregatorAvailable(aggregator));
// => true

// Using an aggregator key
console.log(mySingleLineTextField.isAggregatorAvailable('totalAttachmentSize'));
// => false
```

**Parameters:**

| Name         | Type                                                                                 | Description                              |
| ------------ | ------------------------------------------------------------------------------------ | ---------------------------------------- |
| `aggregator` | [Aggregator](_airtable_blocks_models__aggregators.md#aggregator) &#124; keyof object | The aggregator object or aggregator key. |

**Returns:** _boolean_

`true` if the given aggregator is available for this field, `false` otherwise.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L94)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: WatchableFieldKey | ReadonlyArray‹WatchableFieldKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableFieldKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                      | Description                                    |
| ---------- | --------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableFieldKey &#124; ReadonlyArray‹WatchableFieldKey› | the keys to unwatch                            |
| `callback` | Object                                                    | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                                 | -                                              |

**Returns:** _Array‹WatchableFieldKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableFieldKey | ReadonlyArray‹WatchableFieldKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableFieldKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                      | Description                               |
| ---------- | --------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableFieldKey &#124; ReadonlyArray‹WatchableFieldKey› | the keys to watch                         |
| `callback` | Object                                                    | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                                 | -                                         |

**Returns:** _Array‹WatchableFieldKey›_

the array of keys that were watched

## Variables

### `Const` FieldTypes

• **FieldTypes**: _Object_ = Object.freeze({ /** _ A single line of text. _ _ ##### Cell value
format _ `js * string *` \* _ ##### Options _ None \* _ @alias fieldTypes.SINGLE_LINE_TEXT _
@memberof fieldTypes \*/ SINGLE_LINE_TEXT: 'singleLineText' as const, /** _ A valid email address
(e.g. andrew@example.com). _ _ ##### Cell value format _ `js * string *` \* _ ##### Options _
None \* _ @alias fieldTypes.EMAIL _ @memberof fieldTypes _/ EMAIL: 'email' as const, /\*\* _ A valid
URL (e.g. airtable.com or https://airtable.com/universe). \* _ ###### Cell value format _
`js * string *` \* _ ###### Options _ None \* _ @alias fieldTypes.URL _ @memberof fieldTypes _/ URL:
'url' as const, /\*\* _ A long text field that can span multiple lines. \* _ ###### Cell value
format _ `js * string *` \* _ Multiple lines of text, which may contain "mention tokens", e.g. _
`<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>` \* _ ###### Options _ None \* _
@alias fieldTypes.MULTILINE_TEXT _ @memberof fieldTypes _/ MULTILINE_TEXT: 'multilineText' as const,
/\*\* _ A number. \* _ ##### Cell value format _ `js * number *` \* _ ##### Options _
`js * { * precision: number, * } *` \* _ @alias fieldTypes.NUMBER _ @memberof fieldTypes _/ NUMBER:
'number' as const, /\*\* _ A percentage - 0 is 0%, 1 is 100%. \* _ ##### Cell value format _
`js * number *` \* _ ##### Options _ `js * { * precision: number, * } *` \* _ @alias
fieldTypes.PERCENT _ @memberof fieldTypes _/ PERCENT: 'percent' as const, /\*\* _ An amount of a
currency. \* _ ##### Cell value format _ `js * number *` \* _ ##### Options _
`js * { * precision: number, * symbol: string, * } *` \* _ @alias fieldTypes.CURRENCY _ @memberof
fieldTypes _/ CURRENCY: 'currency' as const, /\*\* _ Single select allows you to select a single
option from predefined options in a dropdown. \* _ ##### Cell value format _
`js * { * id: string, * name: string, * color?: Color * } *` \* _ The currently selected choice. _
_ ##### Options _
`js * { * choices: Array<{ * id: string, * name: string, * color?: Color, * }>, * } *` \* _ @alias
fieldTypes.SINGLE_SELECT _ @memberof fieldTypes _/ SINGLE_SELECT: 'singleSelect' as const, /\*\* _
Multiple select allows you to select one or more predefined options from a dropdown \* _ ##### Cell
value format _ `js * Array<{ * id: string, * name: string, * color?: Color, * }> *` \* _ Array of
selected choices. _ _ ##### Options _
`js * { * choices: Array<{ * id: string, * name: string, * color?: Color, * }>, * } *` \* _ @alias
fieldTypes.MULTIPLE_SELECTS _ @memberof fieldTypes _/ MULTIPLE_SELECTS: 'multipleSelects' as const,
/\*\* _ A collaborator field lets you add collaborators to your records. Collaborators can
optionally be notified when they're added. \* _ ##### Cell value format _
`js * { * id: string, * email: string, * name?: string, * profilePicUrl?: string, * } *` \* _ The
currently selected choice. _ _ ##### Options _
`js * { * choices: Array<{ * id: string, * email: string, * name?: string, * profilePicUrl?: string, * }>, * } *` \*
_ @alias fieldTypes.SINGLE_COLLABORATOR _ @memberof fieldTypes _/ SINGLE_COLLABORATOR:
'singleCollaborator' as const, /\*\* _ A collaborator field lets you add collaborators to your
records. Collaborators can optionally be notified when they're added. \* _ ##### Cell value format _
`js * Array<{ * id: string, * email: string, * name?: string, * profilePicUrl?: string, * }> *` \* _
Array of selected choices. _ _ ##### Options _
`js * { * choices: Array<{ * id: string, * email: string, * name?: string, * profilePicUrl?: string, * }>, * } * * @alias fieldTypes.MULTIPLE_COLLABORATORS * @memberof fieldTypes */ MULTIPLE_COLLABORATORS: 'multipleCollaborators' as const, /** * Link to another record. * * ##### Cell value format *`js
_ Array<{ _ id: RecordId, _ name: string, _ }> _ ``` _ _ Array of selected record IDs and their
primary cell values from the linked table. _ _ ##### Options _
`js * { * // The ID of the table this field links to * linkedTableId: TableId, * // The ID of the field in the linked table that links back to this one * inverseLinkFieldId?: FieldId, * // The ID of the view in the linked table to use when showing a list of records to select from * viewIdForRecordSelection?: ViewId, * } *` \*
_ @alias fieldTypes.MULTIPLE_RECORD_LINKS _ @memberof fieldTypes _/ MULTIPLE_RECORD_LINKS:
'multipleRecordLinks' as const, /\*\* _ A date. \* _ ##### Cell value format _ `js * string *` \* _
An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date. _ _ #####
Options _
`js * { * dateFormat: { * name: 'local' | 'friendly' | 'us' | 'european' | 'iso', * // a date format string as documented here: https://momentjs.com/docs/#/parsing/string-format/ * format: string, * } * } *` \*
_ @alias fieldTypes.DATE _ @memberof fieldTypes _/ DATE: 'date' as const, /\*\* _ A date & time. \*
_ ##### Cell value format _ `js * string *` \* _ An
[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time. _ _ #####
Options _
`js * { * dateFormat: { * name: 'local' | 'friendly' | 'us' | 'european' | 'iso', * // a date format string as documented here: https://momentjs.com/docs/#/parsing/string-format/ * format: string, * }, * timeFormat: { * name: '12hour' | '24hour', * // a time format string as documented here: https://momentjs.com/docs/#/parsing/string-format/ * format: string, * }, * timeZone: 'utc' | 'client', * } *` \*
_ @alias fieldTypes.DATE_TIME _ @memberof fieldTypes _/ DATE_TIME: 'dateTime' as const, /\*\* _ A
telephone number (e.g. (415) 555-9876). \* _ ##### Cell value format _ `js * string *` \* _ #####
Options _ None \* _ @alias fieldTypes.PHONE_NUMBER _ @memberof fieldTypes _/ PHONE_NUMBER:
'phoneNumber' as const, /\*\* _ Attachments allow you to add images, documents, or other files which
can then be viewed or downloaded. \* _ ##### Cell value format _
`js * Array<{ * // unique attachment id * id: string, * // url, e.g. "https://dl.airtable.com/foo.jpg" * url: string, * // filename, e.g. "foo.jpg" * filename: string, * // file size, in bytes * size?: number, * // content type, e.g. "image/jpeg" * type?: string, * // thumbnails if available * thumbnails: { * small?: { * url: string, * width?: number, * height?: number, * }, * large?: { * url: string, * width?: number, * height?: number, * }, * full?: { * url: string, * width?: number, * height?: number, * }, * }, * }> *` \*
_ ##### Options _ None \* _ @alias fieldTypes.MULTIPLE_ATTACHMENTS _ @memberof fieldTypes _/
MULTIPLE_ATTACHMENTS: 'multipleAttachments' as const, /\*\* _ A checkbox. \* _ ##### Cell value
format _ `js * boolean *` \* _ This field is "true" when checked and otherwise empty. _ _ #####
Options _
`js * { * // an {@link Icon} name * icon: string, * // the color of the check box * color: Color, * } *` \*
_ @alias fieldTypes.CHECKBOX _ @memberof fieldTypes _/ CHECKBOX: 'checkbox' as const, /\*\* _
Compute a value in each record based on other fields in the same record. \* _ ##### Cell value
format _ `js * any *` \* _ Check `options.result` to know the resulting field type. _ _ #####
Options _
`js * { * // false if the formula contains an error * isValid: boolean, * // the other fields in the record that are used in the formula * fieldIdsReferencedByFormulaText: Array<FieldId>, * // the resulting field type and options returned by the formula * result: { * // the field type of the formula result * type: string, * // that types options * options?: any, * }, * } *` \*
_ @alias fieldTypes.FORMULA _ @memberof fieldTypes _/ FORMULA: 'formula' as const, /\*\* _ The time
the record was created in UTC. \* _ ##### Cell value format _ `js * string *` \* _ An
[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time. _ _ #####
Options _
`js * { * result: { * type: 'date' | 'dateTime', * options: DateOrDateTimeFieldOptions, * }, * } *` \*
_ See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options. _ _ @alias
fieldTypes.CREATED_TIME _ @memberof fieldTypes _/ CREATED_TIME: 'createdTime' as const, /\*\* _ A
rollup allows you to summarize data from records that are linked to this table. \* _ ##### Cell
value format _ `js * any *` \* _ Check `options.result` to know the resulting field type. _ _ #####
Options _
`js * { * // false if the formula contains an error * isValid: boolean, * // the linked record field in this table that this field is summarizing. * recordLinkFieldId: FieldId, * // the field id in the linked table that this field is summarizing. * fieldIdInLinkedTable: FieldId, * // the other fields in the record that are used in the formula * fieldIdsReferencedByFormulaText: Array<FieldId>, * // the resulting field type and options returned by the formula * result: { * // the field type of the formula result * type: string, * // that types options * options?: any, * }, * } *` \*
_ @alias fieldTypes.ROLLUP _ @memberof fieldTypes _/ ROLLUP: 'rollup' as const, /\*\* _ Count the
number of linked records. \* _ ##### Cell value format _ `js * number *` \* _ ##### Options _
`js * { * // is the field currently valid (false if e.g. the linked record field is switched to a different type) * isValid: boolean, * // the linked record field in this table that we're counting * recordLinkFieldId: FieldId, * } *` \*
_ @alias fieldTypes.COUNT _ @memberof fieldTypes _/ COUNT: 'count' as const, /\*\* _ Lookup a field
on linked records. \* _ ##### Cell value format _ UNSTABLE \* _ ##### Options _ UNSTABLE \* _ @alias
fieldTypes.MULTIPLE_LOOKUP_VALUES _ @memberof fieldTypes _/ MULTIPLE_LOOKUP_VALUES:
'multipleLookupValues' as const, /\*\* _ Automatically incremented unique counter for each
record. \* _ ##### Cell value format _ `js * number *` \* _ ##### Options _ None \* _ @alias
fieldTypes.AUTO_NUMBER _ @memberof fieldTypes _/ AUTO_NUMBER: 'autoNumber' as const, /\*\* _ Use the
Airtable iOS or Android app to scan barcodes. \* _ ##### Cell value format _
`js * { * // the text value of the barcode * text: string, * // the type of barcode * type?: string, * } *` \*
_ ##### Options _ None \* _ @alias fieldTypes.BARCODE _ @memberof fieldTypes _/ BARCODE: 'barcode'
as const, /\*\* _ A rating (e.g. stars out of 5) \* _ ##### Cell value format _ `js * number *` \*
_ ##### Options _
`js * { * // the {@link Icon} name used to display the rating * icon: string, * // the maximum value for the rating * max: number, * // the color of selected icons * color: Color, * } *` \*
_ @alias fieldTypes.RATING _ @memberof fieldTypes _/ RATING: 'rating' as const, /\*\* _ @internal -
not yet generally available _ @alias fieldTypes.RICH_TEXT _ @memberof fieldTypes _/ RICH_TEXT:
'richText' as const, /\*\* _ A duration of time in seconds. \* _ ##### Cell value format _
`js * number *` \* _ ##### Options _
`js * { * // a time format string as documented here: https://momentjs.com/docs/#/parsing/string-format/ * durationFormat: string, * } *` \*
_ @alias fieldTypes.DURATION _ @memberof fieldTypes _/ DURATION: 'duration' as const, /\*\* _ Shows
the date and time that a record was most recently modified in any editable field or _ just in
specific editable fields. _ _ ##### Cell value format _ `js * string *` \* _ An
[ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time. _ _ #####
Options _
`js * { * // false if the formula contains an error * isValid: boolean, * // the fields to check the last modified time of * fieldIdsReferencedByFormulaText: Array<FieldId>, * // the cell value result type * result: { * type: 'date' | 'dateTime', * options: DateOrDateTimeFieldOptions, * }, * } *` \*
_ See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options. _ _ @alias
fieldTypes.LAST_MODIFIED_TIME _ @memberof fieldTypes \*/ LAST_MODIFIED_TIME: 'lastModifiedTime' as
const, })

_Defined in
[src/types/field.ts:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L18)_

An enum of Airtable's field types

**`alias`** fieldTypes

**`example`**

```js
import {fieldTypes} from '@airtable/blocks/models';
const numberFields = myTable.fields.filter(field => field.type === fieldTypes.NUMBER);
```
