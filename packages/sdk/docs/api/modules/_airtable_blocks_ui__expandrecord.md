[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: expandRecord](_airtable_blocks_ui__expandrecord.md)

# External module: @airtable/blocks/ui: expandRecord

## Index

### Type aliases

-   [ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts)

### Functions

-   [expandRecord](_airtable_blocks_ui__expandrecord.md#expandrecord)

## Type aliases

### ExpandRecordOpts

Ƭ **ExpandRecordOpts**: _Object_

_Defined in
[src/ui/expand_record.ts:6](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/expand_record.ts#L6)_

**`typedef`**

## Functions

### expandRecord

▸ **expandRecord**(`record`: [Record](_airtable_blocks_models__record.md#record), `opts?`:
[ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts)): _void_

_Defined in
[src/ui/expand_record.ts:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/expand_record.ts#L26)_

Expands the given record in the Airtable UI.

**`example`**

```js
import {expandRecord} from '@airtable/blocks/ui';
expandRecord(record1, {
    records: [record1, record2, record3],
});
```

**Parameters:**

| Name     | Type                                                                      | Description                 |
| -------- | ------------------------------------------------------------------------- | --------------------------- |
| `record` | [Record](_airtable_blocks_models__record.md#record)                       | the record to expand        |
| `opts?`  | [ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts) | An optional options object. |

**Returns:** _void_
