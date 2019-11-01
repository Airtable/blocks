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
[src/types/field.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L21)_

An enum of Airtable's field types

**`alias`** fieldTypes

**`example`**

```js
import {fieldTypes} from '@airtable/blocks/models';
const numberFields = myTable.fields.filter(field => field.type === fieldTypes.NUMBER);
```

### AUTO_NUMBER

• **AUTO_NUMBER**: = "autoNumber"

_Defined in
[src/types/field.ts:571](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L571)_

Automatically incremented unique counter for each record.

##### Cell value format

```js
number;
```

##### Options

None

**`alias`** fieldTypes.AUTO_NUMBER

**`memberof`** fieldTypes

### BARCODE

• **BARCODE**: = "barcode"

_Defined in
[src/types/field.ts:591](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L591)_

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

**`alias`** fieldTypes.BARCODE

**`memberof`** fieldTypes

### CHECKBOX

• **CHECKBOX**: = "checkbox"

_Defined in
[src/types/field.ts:429](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L429)_

A checkbox.

##### Cell value format

```js
boolean;
```

This field is "true" when checked and otherwise empty.

##### Options

```js
{
    // an [Icon](_airtable_blocks_ui__icon.md#const-icon) name
    icon: string,
    // the color of the check box
    color: Color,
}
```

**`alias`** fieldTypes.CHECKBOX

**`memberof`** fieldTypes

### COUNT

• **COUNT**: = "count"

_Defined in
[src/types/field.ts:543](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L543)_

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

**`alias`** fieldTypes.COUNT

**`memberof`** fieldTypes

### CREATED_TIME

• **CREATED_TIME**: = "createdTime"

_Defined in
[src/types/field.ts:486](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L486)_

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

**`alias`** fieldTypes.CREATED_TIME

**`memberof`** fieldTypes

### CURRENCY

• **CURRENCY**: = "currency"

_Defined in
[src/types/field.ts:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L142)_

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

**`alias`** fieldTypes.CURRENCY

**`memberof`** fieldTypes

### DATE

• **DATE**: = "date"

_Defined in
[src/types/field.ts:315](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L315)_

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

**`alias`** fieldTypes.DATE

**`memberof`** fieldTypes

### DATE_TIME

• **DATE_TIME**: = "dateTime"

_Defined in
[src/types/field.ts:346](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L346)_

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

**`alias`** fieldTypes.DATE_TIME

**`memberof`** fieldTypes

### DURATION

• **DURATION**: = "duration"

_Defined in
[src/types/field.ts:641](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L641)_

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

**`alias`** fieldTypes.DURATION

**`memberof`** fieldTypes

### EMAIL

• **EMAIL**: = "email"

_Defined in
[src/types/field.ts:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L51)_

A valid email address (e.g. andrew@example.com).

##### Cell value format

```js
string;
```

##### Options

None

**`alias`** fieldTypes.EMAIL

**`memberof`** fieldTypes

### FORMULA

• **FORMULA**: = "formula"

_Defined in
[src/types/field.ts:460](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L460)_

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
    fieldIdsReferencedByFormulaText: Array<FieldId>,
    // the resulting field type and options returned by the formula
    result: {
        // the field type of the formula result
        type: string,
        // that types options
        options?: any,
    },
}
```

**`alias`** fieldTypes.FORMULA

**`memberof`** fieldTypes

### LAST_MODIFIED_TIME

• **LAST_MODIFIED_TIME**: = "lastModifiedTime"

_Defined in
[src/types/field.ts:673](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L673)_

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
    fieldIdsReferencedByFormulaText: Array<FieldId>,
    // the cell value result type
    result: {
        type: 'date' | 'dateTime',
        options: DateOrDateTimeFieldOptions,
    },
}
```

See {@link fieldTypes.DATE} and {@link fieldTypes.DATE_TIME} for `result` options.

**`alias`** fieldTypes.LAST_MODIFIED_TIME

**`memberof`** fieldTypes

### MULTILINE_TEXT

• **MULTILINE_TEXT**: = "multilineText"

_Defined in
[src/types/field.ts:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L84)_

A long text field that can span multiple lines.

###### Cell value format

```js
string;
```

Multiple lines of text, which may contain "mention tokens", e.g.
`<airtable:mention id="menE1i9oBaGX3DseR">@Alex</airtable:mention>`

###### Options

None

**`alias`** fieldTypes.MULTILINE_TEXT

**`memberof`** fieldTypes

### MULTIPLE_ATTACHMENTS

• **MULTIPLE_ATTACHMENTS**: = "multipleAttachments"

_Defined in
[src/types/field.ts:405](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L405)_

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

**`alias`** fieldTypes.MULTIPLE_ATTACHMENTS

**`memberof`** fieldTypes

### MULTIPLE_COLLABORATORS

• **MULTIPLE_COLLABORATORS**: = "multipleCollaborators"

_Defined in
[src/types/field.ts:261](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L261)_

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

@alias fieldTypes.MULTIPLE_COLLABORATORS
@memberof fieldTypes

###  MULTIPLE_LOOKUP_VALUES

• **MULTIPLE_LOOKUP_VALUES**: = "multipleLookupValues"

*Defined in [src/types/field.ts:556](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L556)*

Lookup a field on linked records.

##### Cell value format
UNSTABLE

##### Options
UNSTABLE

**`alias`** fieldTypes.MULTIPLE_LOOKUP_VALUES

**`memberof`** fieldTypes

###  MULTIPLE_RECORD_LINKS

• **MULTIPLE_RECORD_LINKS**: = "multipleRecordLinks"

*Defined in [src/types/field.ts:290](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L290)*

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

**`alias`** fieldTypes.MULTIPLE_RECORD_LINKS

**`memberof`** fieldTypes

### MULTIPLE_SELECTS

• **MULTIPLE_SELECTS**: = "multipleSelects"

_Defined in
[src/types/field.ts:200](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L200)_

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

**`alias`** fieldTypes.MULTIPLE_SELECTS

**`memberof`** fieldTypes

### NUMBER

• **NUMBER**: = "number"

_Defined in
[src/types/field.ts:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L103)_

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

**`alias`** fieldTypes.NUMBER

**`memberof`** fieldTypes

### PERCENT

• **PERCENT**: = "percent"

_Defined in
[src/types/field.ts:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L122)_

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

**`alias`** fieldTypes.PERCENT

**`memberof`** fieldTypes

### PHONE_NUMBER

• **PHONE_NUMBER**: = "phoneNumber"

_Defined in
[src/types/field.ts:361](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L361)_

A telephone number (e.g. (415) 555-9876).

##### Cell value format

```js
string;
```

##### Options

None

**`alias`** fieldTypes.PHONE_NUMBER

**`memberof`** fieldTypes

### RATING

• **RATING**: = "rating"

_Defined in
[src/types/field.ts:615](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L615)_

A rating (e.g. stars out of 5)

##### Cell value format

```js
number;
```

##### Options

```js
{
    // the [Icon](_airtable_blocks_ui__icon.md#const-icon) name used to display the rating
    icon: string,
    // the maximum value for the rating
    max: number,
    // the color of selected icons
    color: Color,
}
```

**`alias`** fieldTypes.RATING

**`memberof`** fieldTypes

### ROLLUP

• **ROLLUP**: = "rollup"

_Defined in
[src/types/field.ts:521](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L521)_

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
    fieldIdsReferencedByFormulaText: Array<FieldId>,
    // the resulting field type and options returned by the formula
    result: {
        // the field type of the formula result
        type: string,
        // that types options
        options?: any,
    },
}
```

**`alias`** fieldTypes.ROLLUP

**`memberof`** fieldTypes

### SINGLE_COLLABORATOR

• **SINGLE_COLLABORATOR**: = "singleCollaborator"

_Defined in
[src/types/field.ts:231](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L231)_

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

**`alias`** fieldTypes.SINGLE_COLLABORATOR

**`memberof`** fieldTypes

### SINGLE_LINE_TEXT

• **SINGLE_LINE_TEXT**: = "singleLineText"

_Defined in
[src/types/field.ts:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L36)_

A single line of text.

##### Cell value format

```js
string;
```

##### Options

None

**`alias`** fieldTypes.SINGLE_LINE_TEXT

**`memberof`** fieldTypes

### SINGLE_SELECT

• **SINGLE_SELECT**: = "singleSelect"

_Defined in
[src/types/field.ts:171](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L171)_

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

**`alias`** fieldTypes.SINGLE_SELECT

**`memberof`** fieldTypes

### URL

• **URL**: = "url"

_Defined in
[src/types/field.ts:66](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L66)_

A valid URL (e.g. airtable.com or https://airtable.com/universe).

###### Cell value format

```js
string;
```

###### Options

None

**`alias`** fieldTypes.URL

**`memberof`** fieldTypes

## Classes

### Field

• **Field**:

_Defined in
[src/models/field.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L41)_

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
[src/models/field.ts:249](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L249)_

A list of available aggregators given this field's configuration.

**`example`**

```js
const fieldAggregators = myField.availableAggregators;
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isComputed

• **isComputed**:

_Defined in
[src/models/field.ts:230](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L230)_

`true` if this field is computed, `false` otherwise. A field is "computed" if it's value is not set
by user input (e.g. autoNumber, formula, etc.). Can be watched

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
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### isPrimaryField

• **isPrimaryField**:

_Defined in
[src/models/field.ts:238](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L238)_

`true` if this field is its parent table's primary field, `false` otherwise. Should never change
because the primary field of a table cannot change.

### name

• **name**:

_Defined in
[src/models/field.ts:159](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L159)_

The name of the field. Can be watched.

**`example`**

```js
console.log(myField.name);
// => 'Name'
```

### options

• **options**:

_Defined in
[src/models/field.ts:204](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L204)_

The configuration options of the field. The structure of the field's options depend on the field's
type. Can be watched.

**`see`** [FieldTypes](_airtable_blocks_models__field.md#fieldtypes)

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
[src/models/field.ts:171](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L171)_

The type of the field. Can be watched.

**`example`**

```js
console.log(myField.type);
// => 'singleLineText'
```

### convertStringToCellValue

▸ **convertStringToCellValue**(`string`: string): _unknown_

_Defined in
[src/models/field.ts:301](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L301)_

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
[Aggregator](_airtable_blocks_models__aggregators.md#aggregator) | AggregatorKey): _boolean_

_Defined in
[src/models/field.ts:277](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L277)_

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

| Name         | Type                                                                                  | Description                              |
| ------------ | ------------------------------------------------------------------------------------- | ---------------------------------------- |
| `aggregator` | [Aggregator](_airtable_blocks_models__aggregators.md#aggregator) &#124; AggregatorKey | The aggregator object or aggregator key. |

**Returns:** _boolean_

`true` if the given aggregator is available for this field, `false` otherwise.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L90)_

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
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

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
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

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
[src/types/field.ts:5](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L5)_

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
[src/types/field.ts:677](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L677)_

---

### WatchableFieldKey

Ƭ **WatchableFieldKey**: _"name" | "type" | "options" | "isComputed"_

_Defined in
[src/models/field.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L27)_

All the watchable keys in a field.

-   `name`
-   `type`
-   `options`
-   `isComputed`
