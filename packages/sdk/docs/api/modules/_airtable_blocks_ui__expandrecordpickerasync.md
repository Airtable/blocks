[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: expandRecordPickerAsync](_airtable_blocks_ui__expandrecordpickerasync.md)

# External module: @airtable/blocks/ui: expandRecordPickerAsync

## Index

### Interfaces

-   [ExpandRecordPickerOpts](_airtable_blocks_ui__expandrecordpickerasync.md#expandrecordpickeropts)

### Functions

-   [expandRecordPickerAsync](_airtable_blocks_ui__expandrecordpickerasync.md#expandrecordpickerasync)

## Interfaces

### ExpandRecordPickerOpts

• **ExpandRecordPickerOpts**:

_Defined in
[src/ui/expand_record_picker_async.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_picker_async.ts#L10)_

Options object for expanding a record picker.

### `Optional` fields

• **fields**? : _Array‹[Field](_airtable_blocks_models__field.md#field)›_

_Defined in
[src/ui/expand_record_picker_async.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_picker_async.ts#L12)_

The fields to include in the record cards. The primary field will always be shown. Duplicate fields
will be removed.

### `Optional` shouldAllowCreatingRecord

• **shouldAllowCreatingRecord**? : _undefined | false | true_

_Defined in
[src/ui/expand_record_picker_async.ts:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_picker_async.ts#L14)_

If set to true, the user will be able to create an empty new record from the record picker.

## Functions

### expandRecordPickerAsync

▸ **expandRecordPickerAsync**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›,
`opts?`:
[ExpandRecordPickerOpts](_airtable_blocks_ui__expandrecordpickerasync.md#expandrecordpickeropts)):
_Promise‹[Record](_airtable_blocks_models__record.md#record) | null›_

_Defined in
[src/ui/expand_record_picker_async.ts:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_picker_async.ts#L47)_

Expands a list of records in the Airtable UI, and prompts the user to pick one. The selected record
is returned to the block, and the modal is automatically closed.

If the user dismisses the modal, or another one is opened before this one has been closed, it will
return null.

**Example:**

```js
import {expandRecordPickerAsync} from '@airtable/blocks/ui';

async function pickRecordsAsync() {
    const recordA = await expandRecordPickerAsync([record1, record2, record3]);
    if (recordA !== null) {
        alert(recordA.primaryCellValueAsString);
    } else {
        alert('no record picked');
    }

    const recordB = await expandRecordPickerAsync([record1, record2], {
        fields: [field1, field2],
    });
}
```

**Parameters:**

| Name      | Type                                                                                             | Description                                                            |
| --------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)›                                       | the records the user can pick from. Duplicate records will be removed. |
| `opts?`   | [ExpandRecordPickerOpts](_airtable_blocks_ui__expandrecordpickerasync.md#expandrecordpickeropts) | An optional options object.                                            |

**Returns:** _Promise‹[Record](_airtable_blocks_models__record.md#record) | null›_

A Promise that resolves to the record chosen by the user or null.
