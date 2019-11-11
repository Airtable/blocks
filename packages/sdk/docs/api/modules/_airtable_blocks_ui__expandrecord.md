[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: expandRecord](_airtable_blocks_ui__expandrecord.md)

# External module: @airtable/blocks/ui: expandRecord

## Index

### Interfaces

-   [ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts)

### Functions

-   [expandRecord](_airtable_blocks_ui__expandrecord.md#expandrecord)

## Interfaces

### ExpandRecordOpts

• **ExpandRecordOpts**:

_Defined in
[src/ui/expand_record.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/expand_record.ts#L8)_

Options object for expanding a record.

### `Optional` records

• **records**? : _Array‹[Record](_airtable_blocks_models__record.md#record)›_

_Defined in
[src/ui/expand_record.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/expand_record.ts#L10)_

If `records` is provided, the list will be used to page through records from the expanded record
dialog.

## Functions

### expandRecord

▸ **expandRecord**(`record`: [Record](_airtable_blocks_models__record.md#record), `opts?`:
[ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts)): _void_

_Defined in
[src/ui/expand_record.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/expand_record.ts#L27)_

Expands the given record in the Airtable UI.

**Example:**

```js
import {expandRecord} from '@airtable/blocks/ui';
expandRecord(record1, {
    records: [record1, record2, record3],
});
```

**Parameters:**

| Name     | Type                                                                      | Description                 |
| -------- | ------------------------------------------------------------------------- | --------------------------- |
| `record` | [Record](_airtable_blocks_models__record.md#record)                       | The record to expand.       |
| `opts?`  | [ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts) | An optional options object. |

**Returns:** _void_
