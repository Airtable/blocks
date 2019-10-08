[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Field](_airtable_blocks_models__field.md)

# External module: @airtable/blocks/models: Field

## Index

### Enumerations

-   [FieldTypes](_airtable_blocks_models__field.md#fieldtypes)

### Classes

-   [Field](_airtable_blocks_models__field.md#field)

## Enumerations

### FieldTypes

• **FieldTypes**:

_Defined in
[src/types/field.ts:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L18)_

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
[src/types/field.ts:568](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L568)_

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
[src/types/field.ts:588](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L588)_

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
[src/types/field.ts:426](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L426)_

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

**`alias`** fieldTypes.CHECKBOX

**`memberof`** fieldTypes

### COUNT

• **COUNT**: = "count"

_Defined in
[src/types/field.ts:540](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L540)_

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
[src/types/field.ts:483](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L483)_

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
[src/types/field.ts:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L139)_

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
[src/types/field.ts:312](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L312)_

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
[src/types/field.ts:343](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L343)_

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
[src/types/field.ts:638](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L638)_

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
[src/types/field.ts:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L48)_

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
[src/types/field.ts:457](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L457)_

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
[src/types/field.ts:670](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L670)_

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
[src/types/field.ts:81](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L81)_

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
[src/types/field.ts:402](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L402)_

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
    thumbnails: {
        small?: {
            url: string,
            width?: number,
            height?: number,
        },
        large?: {
            url: string,
            width?: number,
            height?: number,
        },
        full?: {
            url: string,
            width?: number,
            height?: number,
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
[src/types/field.ts:258](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L258)_

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

*Defined in [src/types/field.ts:553](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L553)*

Lookup a field on linked records.

##### Cell value format
UNSTABLE

##### Options
UNSTABLE

**`alias`** fieldTypes.MULTIPLE_LOOKUP_VALUES

**`memberof`** fieldTypes

###  MULTIPLE_RECORD_LINKS

• **MULTIPLE_RECORD_LINKS**: = "multipleRecordLinks"

*Defined in [src/types/field.ts:287](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L287)*

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
[src/types/field.ts:197](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L197)_

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
[src/types/field.ts:100](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L100)_

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
[src/types/field.ts:119](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L119)_

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
[src/types/field.ts:358](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L358)_

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
[src/types/field.ts:612](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L612)_

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

**`alias`** fieldTypes.RATING

**`memberof`** fieldTypes

### ROLLUP

• **ROLLUP**: = "rollup"

_Defined in
[src/types/field.ts:518](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L518)_

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
[src/types/field.ts:228](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L228)_

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
[src/types/field.ts:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L33)_

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
[src/types/field.ts:168](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L168)_

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
[src/types/field.ts:63](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/field.ts#L63)_

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
[src/models/field.ts:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L34)_

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
[src/models/field.ts:243](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L243)_

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
[src/models/field.ts:223](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L223)_

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
[src/models/field.ts:232](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L232)_

**`function`**

**`returns`** `true` if this field is its parent table's primary field, `false` otherwise. Should
never change because the primary field of a table cannot change.

### name

• **name**:

_Defined in
[src/models/field.ts:153](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L153)_

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
[src/models/field.ts:197](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L197)_

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
[src/models/field.ts:165](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L165)_

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
[src/models/field.ts:297](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L297)_

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
[src/models/field.ts:271](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/field.ts#L271)_

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
