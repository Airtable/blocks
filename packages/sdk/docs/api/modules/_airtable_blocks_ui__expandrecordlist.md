[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: expandRecordList](_airtable_blocks_ui__expandrecordlist.md)

# External module: @airtable/blocks/ui: expandRecordList

## Index

### Interfaces

-   [ExpandRecordListOpts](_airtable_blocks_ui__expandrecordlist.md#expandrecordlistopts)

### Functions

-   [expandRecordList](_airtable_blocks_ui__expandrecordlist.md#expandrecordlist)

## Interfaces

### ExpandRecordListOpts

• **ExpandRecordListOpts**:

_Defined in
[src/ui/expand_record_list.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_list.ts#L10)_

Options object for expanding a record list.

### `Optional` fields

• **fields**? : _Array‹[Field](_airtable_blocks_models__field.md#field)›_

_Defined in
[src/ui/expand_record_list.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_list.ts#L12)_

The fields to include in the record cards. The primary field will always be shown. Duplicate fields
will be removed.

## Functions

### expandRecordList

▸ **expandRecordList**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›,
`opts?`: [ExpandRecordListOpts](_airtable_blocks_ui__expandrecordlist.md#expandrecordlistopts)):
_void_

_Defined in
[src/ui/expand_record_list.ts:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/expand_record_list.ts#L31)_

Expands a list of records in the Airtable UI.

**Example:**

```js
import {expandRecordList} from '@airtable/blocks/ui';
expandRecordList([record1, record2, record3]);

expandRecordList([record1, record2], {
    fields: [field1, field2],
});
```

**Parameters:**

| Name      | Type                                                                                  | Description                                               |
| --------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)›                            | The records to expand. Duplicate records will be removed. |
| `opts?`   | [ExpandRecordListOpts](_airtable_blocks_ui__expandrecordlist.md#expandrecordlistopts) | An optional options object.                               |

**Returns:** _void_
