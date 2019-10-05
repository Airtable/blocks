[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: expandRecordPickerAsync](_airtable_blocks_ui__expandrecordpickerasync.md)

# External module: @airtable/blocks/ui: expandRecordPickerAsync

## Index

### Functions

-   [expandRecordPickerAsync](_airtable_blocks_ui__expandrecordpickerasync.md#expandrecordpickerasync)

## Functions

### expandRecordPickerAsync

▸ **expandRecordPickerAsync**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›,
`opts?`: undefined | object): _Promise‹[Record](_airtable_blocks_models__record.md#record) | null›_

_Defined in
[src/ui/expand_record_picker_async.ts:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/expand_record_picker_async.ts#L44)_

Expands a list of records in the Airtable UI, and prompts the user to pick one. The selected record
is returned to the block, and the modal is automatically closed.

If the user dismisses the modal, or another one is opened before this one has been closed, it will
return null.

**`example`**

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

| Name      | Type                                                       | Description                                                            |
| --------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)› | the records the user can pick from. Duplicate records will be removed. |
| `opts?`   | undefined &#124; object                                    | -                                                                      |

**Returns:** _Promise‹[Record](_airtable_blocks_models__record.md#record) | null›_

a Promise that resolves to the record chosen by the user or null
