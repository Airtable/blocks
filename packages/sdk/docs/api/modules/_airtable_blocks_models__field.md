[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Field](_airtable_blocks_models__field.md)

# External module: @airtable/blocks/models: Field

## Index

### Enumerations

-   [FieldTypes](_airtable_blocks_models__field.md#fieldtypes)

### Classes

-   [Field](_airtable_blocks_models__field.md#field)

### Type aliases

-   [FieldId](_airtable_blocks_models__field.md#fieldid)
-   [FieldType](_airtable_blocks_models__field.md#fieldtype)
-   [WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)

## Enumerations

### FieldTypes

• **FieldTypes**:

_Defined in
[src/types/field.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L21)_

An enum of Airtable's field types

**Alias:** fieldTypes

**Example:**

```js
import {fieldTypes} from '@airtable/blocks/models';
const numberFields = myTable.fields.filter(field => field.type === fieldTypes.NUMBER);
```

### AUTO_NUMBER

• **AUTO_NUMBER**: = "autoNumber"

_Defined in
[src/types/field.ts:502](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L502)_

Automatically incremented unique counter for each record.

##### Cell value format

```js
number;
```

##### Options

None

### BARCODE

• **BARCODE**: = "barcode"

_Defined in
[src/types/field.ts:519](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L519)_

Use the Airtable iOS or Android app to scan barcodes.

##### Cell value format

```js
{
    // the text value of the barcode
    text: string,
    // the type of barcode
    type?: string,
}
```

##### Options

None

### CHECKBOX

• **CHECKBOX**: = "checkbox"

_Defined in
[src/types/field.ts:378](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L378)_

A checkbox.

##### Cell value format

```js
boolean;
```

This field is "true" when checked and otherwise empty.

##### Options

```js
{
    // an [Icon](_airtable_blocks_ui__icon.md#icon) name
    icon: string,
    // the color of the check box
    color: Color,
}
```

### COUNT

• **COUNT**: = "count"

_Defined in
[src/types/field.ts:480](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L480)_

Count the number of linked records.

##### Cell value format

```js
number;
```

##### Options

```js
{
   // is the field currently valid (false if e.g. the linked record field is switched to a different type)
   isValid: boolean,
   // the linked record field in this table that we're counting
   recordLinkFieldId: FieldId,
}
```

### CREATED_TIME

• **CREATED_TIME**: = "createdTime"

_Defined in
[src/types/field.ts:429](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L429)_

The time the record was created in UTC.

##### Cell value format

```js
string;
```

An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.

##### Options

```js
{
    result: {
        type: 'date' | 'dateTime',
        options: DateOrDateTimeFieldOptions,
    },
}
```

See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options.

### CURRENCY

• **CURRENCY**: = "currency"

_Defined in
[src/types/field.ts:121](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L121)_

An amount of a currency.

##### Cell value format

```js
number;
```

##### Options

```js
{
    precision: number,
    symbol: string,
}
```

### DATE

• **DATE**: = "date"

_Defined in
[src/types/field.ts:276](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L276)_

A date.

##### Cell value format

```js
string;
```

An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date.

##### Options

```js
{
    dateFormat: {
        name: 'local' | 'friendly' | 'us' | 'european' | 'iso',
        // a date format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
        format: string,
    }
}
```

### DATE_TIME

• **DATE_TIME**: = "dateTime"

_Defined in
[src/types/field.ts:304](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L304)_

A date & time.

##### Cell value format

```js
string;
```

An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.

##### Options

```js
{
    dateFormat: {
        name: 'local' | 'friendly' | 'us' | 'european' | 'iso',
        // a date format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
        format: string,
    },
    timeFormat: {
        name: '12hour' | '24hour',
        // a time format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
        format: string,
    },
    timeZone: 'utc' | 'client',
}
```

### DURATION

• **DURATION**: = "duration"

_Defined in
[src/types/field.ts:561](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L561)_

A duration of time in seconds.

##### Cell value format

```js
number;
```

##### Options

```js
{
    // a time format string as documented here: https://momentjs.com/docs/#/parsing/string-format/
    durationFormat: string,
}
```

### EMAIL

• **EMAIL**: = "email"

_Defined in
[src/types/field.ts:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L45)_

A valid email address (e.g. andrew@example.com).

##### Cell value format

```js
string;
```

##### Options

None

### FORMULA

• **FORMULA**: = "formula"

_Defined in
[src/types/field.ts:406](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L406)_

Compute a value in each record based on other fields in the same record.

##### Cell value format

```js
any;
```

Check `options.result` to know the resulting field type.

##### Options

```js
{
    // false if the formula contains an error
    isValid: boolean,
    // the other fields in the record that are used in the formula
    referencedFieldIds: Array<FieldId>,
    // the resulting field type and options returned by the formula
    result: {
        // the field type of the formula result
        type: string,
        // that types options
        options?: any,
    },
}
```

### LAST_MODIFIED_TIME

• **LAST_MODIFIED_TIME**: = "lastModifiedTime"

_Defined in
[src/types/field.ts:590](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L590)_

Shows the date and time that a record was most recently modified in any editable field or just in
specific editable fields.

##### Cell value format

```js
string;
```

An [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date time.

##### Options

```js
{
    // false if the formula contains an error
    isValid: boolean,
    // the fields to check the last modified time of
    referencedFieldIds: Array<FieldId>,
    // the cell value result type
    result: {
        type: 'date' | 'dateTime',
        options: DateOrDateTimeFieldOptions,
    },
}
```

See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options.

### MULTILINE_TEXT

• **MULTILINE_TEXT**: = "multilineText"

_Defined in
[src/types/field.ts:72](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L72)_

A long text field that can span multiple lines.

###### Cell value format

```js
string;
```

Multiple lines of text, which may contain "mention tokens", e.g.
`<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>`

###### Options

None

### MULTIPLE_ATTACHMENTS

• **MULTIPLE_ATTACHMENTS**: = "multipleAttachments"

_Defined in
[src/types/field.ts:357](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L357)_

Attachments allow you to add images, documents, or other files which can then be viewed or
downloaded.

##### Cell value format

```js
Array<{
    // unique attachment id
    id: string,
    // url, e.g. "https://dl.airtable.com/foo.jpg"
    url: string,
    // filename, e.g. "foo.jpg"
    filename: string,
    // file size, in bytes
    size?: number,
    // content type, e.g. "image/jpeg"
    type?: string,
    // thumbnails if available
    thumbnails?: {
        small?: {
            url: string,
            width: number,
            height: number,
        },
        large?: {
            url: string,
            width: number,
            height: number,
        },
        full?: {
            url: string,
            width: number,
            height: number,
        },
    },
}>
```

##### Options

None

### MULTIPLE_COLLABORATORS

• **MULTIPLE_COLLABORATORS**: = "multipleCollaborators"

_Defined in
[src/types/field.ts:228](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L228)_

A collaborator field lets you add collaborators to your records. Collaborators can optionally be
notified when they're added.

##### Cell value format

```js
Array<{
    id: string,
    email: string,
    name?: string,
    profilePicUrl?: string,
}>
```

Array of selected choices.

##### Options

````js
{
    choices: Array<{
        id: string,
        email: string,
        name?: string,
        profilePicUrl?: string,
    }>,
}

###  MULTIPLE_LOOKUP_VALUES

• **MULTIPLE_LOOKUP_VALUES**: = "multipleLookupValues"

*Defined in [src/types/field.ts:490](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L490)*

Lookup a field on linked records.

##### Cell value format
UNSTABLE

##### Options
UNSTABLE

###  MULTIPLE_RECORD_LINKS

• **MULTIPLE_RECORD_LINKS**: = "multipleRecordLinks"

*Defined in [src/types/field.ts:254](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L254)*

Link to another record.

##### Cell value format
```js
Array<{
    id: RecordId,
    name: string,
}>
````

Array of selected record IDs and their primary cell values from the linked table.

##### Options

```js
{
    // The ID of the table this field links to
    linkedTableId: TableId,
    // The ID of the field in the linked table that links back to this one
    inverseLinkFieldId?: FieldId,
    // The ID of the view in the linked table to use when showing a list of records to select from
    viewIdForRecordSelection?: ViewId,
}
```

### MULTIPLE_SELECTS

• **MULTIPLE_SELECTS**: = "multipleSelects"

_Defined in
[src/types/field.ts:173](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L173)_

Multiple select allows you to select one or more predefined options from a dropdown

##### Cell value format

```js
Array<{
    id: string,
    name: string,
    color?: Color,
}>
```

Array of selected choices.

##### Options

```js
{
    choices: Array<{
        id: string,
        name: string,
        color?: Color,
    }>,
}
```

### NUMBER

• **NUMBER**: = "number"

_Defined in
[src/types/field.ts:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L88)_

A number.

##### Cell value format

```js
number;
```

##### Options

```js
{
    precision: number,
}
```

### PERCENT

• **PERCENT**: = "percent"

_Defined in
[src/types/field.ts:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L104)_

A percentage - 0 is 0%, 1 is 100%.

##### Cell value format

```js
number;
```

##### Options

```js
{
    precision: number,
}
```

### PHONE_NUMBER

• **PHONE_NUMBER**: = "phoneNumber"

_Defined in
[src/types/field.ts:316](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L316)_

A telephone number (e.g. (415) 555-9876).

##### Cell value format

```js
string;
```

##### Options

None

### RATING

• **RATING**: = "rating"

_Defined in
[src/types/field.ts:540](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L540)_

A rating (e.g. stars out of 5)

##### Cell value format

```js
number;
```

##### Options

```js
{
    // the [Icon](_airtable_blocks_ui__icon.md#icon) name used to display the rating
    icon: string,
    // the maximum value for the rating
    max: number,
    // the color of selected icons
    color: Color,
}
```

### ROLLUP

• **ROLLUP**: = "rollup"

_Defined in
[src/types/field.ts:461](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L461)_

A rollup allows you to summarize data from records that are linked to this table.

##### Cell value format

```js
any;
```

Check `options.result` to know the resulting field type.

##### Options

```js
{
    // false if the formula contains an error
    isValid: boolean,
    // the linked record field in this table that this field is summarizing.
    recordLinkFieldId: FieldId,
    // the field id in the linked table that this field is summarizing.
    fieldIdInLinkedTable: FieldId,
    // the other fields in the record that are used in the formula
    referencedFieldIds: Array<FieldId>,
    // the resulting field type and options returned by the formula
    result: {
        // the field type of the formula result
        type: string,
        // that types options
        options?: any,
    },
}
```

### SINGLE_COLLABORATOR

• **SINGLE_COLLABORATOR**: = "singleCollaborator"

_Defined in
[src/types/field.ts:201](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L201)_

A collaborator field lets you add collaborators to your records. Collaborators can optionally be
notified when they're added.

##### Cell value format

```js
{
    id: string,
    email: string,
    name?: string,
    profilePicUrl?: string,
}
```

The currently selected choice.

##### Options

```js
{
    choices: Array<{
        id: string,
        email: string,
        name?: string,
        profilePicUrl?: string,
    }>,
}
```

### SINGLE_LINE_TEXT

• **SINGLE_LINE_TEXT**: = "singleLineText"

_Defined in
[src/types/field.ts:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L33)_

A single line of text.

##### Cell value format

```js
string;
```

##### Options

None

### SINGLE_SELECT

• **SINGLE_SELECT**: = "singleSelect"

_Defined in
[src/types/field.ts:147](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L147)_

Single select allows you to select a single option from predefined options in a dropdown.

##### Cell value format

```js
{
    id: string,
    name: string,
    color?: Color
}
```

The currently selected choice.

##### Options

```js
{
    choices: Array<{
        id: string,
        name: string,
        color?: Color,
    }>,
}
```

### URL

• **URL**: = "url"

_Defined in
[src/types/field.ts:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L57)_

A valid URL (e.g. airtable.com or https://airtable.com/universe).

###### Cell value format

```js
string;
```

###### Options

None

## Classes

### Field

• **Field**:

_Defined in
[src/models/field.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L41)_

Model class representing a field in a table.

**Example:**

```js
import {base} from '@airtable/blocks';

const table = base.getTableByName('Table 1');
const field = table.getFieldByName('Name');
console.log('The type of this field is', field.type);
```

### availableAggregators

• **availableAggregators**:

_Defined in
[src/models/field.ts:182](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L182)_

A list of available aggregators given this field's configuration.

**Example:**

```js
const fieldAggregators = myField.availableAggregators;
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isComputed

• **isComputed**:

_Defined in
[src/models/field.ts:163](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L163)_

`true` if this field is computed, `false` otherwise. A field is "computed" if it's value is not set
by user input (e.g. autoNumber, formula, etc.). Can be watched

**Example:**

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
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### isPrimaryField

• **isPrimaryField**:

_Defined in
[src/models/field.ts:171](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L171)_

`true` if this field is its parent table's primary field, `false` otherwise. Should never change
because the primary field of a table cannot change.

### name

• **name**:

_Defined in
[src/models/field.ts:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L92)_

The name of the field. Can be watched.

**Example:**

```js
console.log(myField.name);
// => 'Name'
```

### options

• **options**:

_Defined in
[src/models/field.ts:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L137)_

The configuration options of the field. The structure of the field's options depend on the field's
type. Can be watched.

**See:** [FieldTypes](_airtable_blocks_models__field.md#fieldtypes)

**Example:**

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
[src/models/field.ts:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L104)_

The type of the field. Can be watched.

**Example:**

```js
console.log(myField.type);
// => 'singleLineText'
```

### convertStringToCellValue

▸ **convertStringToCellValue**(`string`: string): _unknown_

_Defined in
[src/models/field.ts:233](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L233)_

Given a string, will attempt to parse it and return a valid cell value for the field's current
config.

**Example:**

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
[Aggregator](_airtable_blocks_models__aggregators.md#aggregator) |
[AggregatorKey](_airtable_blocks_models__aggregators.md#aggregatorkey)): _boolean_

_Defined in
[src/models/field.ts:209](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L209)_

**Example:**

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

| Name         | Type                                                                                                                                           | Description                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `aggregator` | [Aggregator](_airtable_blocks_models__aggregators.md#aggregator) &#124; [AggregatorKey](_airtable_blocks_models__aggregators.md#aggregatorkey) | The aggregator object or aggregator key. |

**Returns:** _boolean_

`true` if the given aggregator is available for this field, `false` otherwise.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: [WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey) |
ReadonlyArray‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)›, `callback`:
Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                                                                                                                                    | Description                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `keys`     | [WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey) &#124; ReadonlyArray‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)› | the keys to unwatch                                         |
| `callback` | Object                                                                                                                                                                  | the function passed to `.watch` for these keys              |
| `context?` | FlowAnyObject &#124; null                                                                                                                                               | the context that was passed to `.watch` for this `callback` |

**Returns:** _Array‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: [WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey) |
ReadonlyArray‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)›, `callback`:
Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                                                                                                                                    | Description                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `keys`     | [WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey) &#124; ReadonlyArray‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)› | the keys to watch                             |
| `callback` | Object                                                                                                                                                                  | a function to call when those keys change     |
| `context?` | FlowAnyObject &#124; null                                                                                                                                               | an optional context for `this` in `callback`. |

**Returns:** _Array‹[WatchableFieldKey](_airtable_blocks_models__field.md#watchablefieldkey)›_

the array of keys that were watched

## Type aliases

### FieldId

Ƭ **FieldId**: _string_

_Defined in
[src/types/field.ts:5](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L5)_

---

### FieldType

Ƭ **FieldType**: _[SINGLE_LINE_TEXT](_airtable_blocks_models__field.md#single_line_text) |
[EMAIL](_airtable_blocks_models__field.md#email) | [URL](_airtable_blocks_models__field.md#url) |
[MULTILINE_TEXT](_airtable_blocks_models__field.md#multiline_text) |
[NUMBER](_airtable_blocks_models__field.md#number) |
[PERCENT](_airtable_blocks_models__field.md#percent) |
[CURRENCY](_airtable_blocks_models__field.md#currency) |
[SINGLE_SELECT](_airtable_blocks_models__field.md#single_select) |
[MULTIPLE_SELECTS](_airtable_blocks_models__field.md#multiple_selects) |
[SINGLE_COLLABORATOR](_airtable_blocks_models__field.md#single_collaborator) |
[MULTIPLE_COLLABORATORS](_airtable_blocks_models__field.md#multiple_collaborators) |
[MULTIPLE_RECORD_LINKS](_airtable_blocks_models__field.md#multiple_record_links) |
[DATE](_airtable_blocks_models__field.md#date) |
[DATE_TIME](_airtable_blocks_models__field.md#date_time) |
[PHONE_NUMBER](_airtable_blocks_models__field.md#phone_number) |
[MULTIPLE_ATTACHMENTS](_airtable_blocks_models__field.md#multiple_attachments) |
[CHECKBOX](_airtable_blocks_models__field.md#checkbox) |
[FORMULA](_airtable_blocks_models__field.md#formula) |
[CREATED_TIME](_airtable_blocks_models__field.md#created_time) |
[ROLLUP](_airtable_blocks_models__field.md#rollup) |
[COUNT](_airtable_blocks_models__field.md#count) |
[MULTIPLE_LOOKUP_VALUES](_airtable_blocks_models__field.md#multiple_lookup_values) |
[AUTO_NUMBER](_airtable_blocks_models__field.md#auto_number) |
[BARCODE](_airtable_blocks_models__field.md#barcode) |
[RATING](_airtable_blocks_models__field.md#rating) | RICH_TEXT |
[DURATION](_airtable_blocks_models__field.md#duration) |
[LAST_MODIFIED_TIME](_airtable_blocks_models__field.md#last_modified_time)_

_Defined in
[src/types/field.ts:594](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/field.ts#L594)_

---

### WatchableFieldKey

Ƭ **WatchableFieldKey**: _"name" | "type" | "options" | "isComputed"_

_Defined in
[src/models/field.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/field.ts#L27)_

All the watchable keys in a field.

-   `name`
-   `type`
-   `options`
-   `isComputed`
