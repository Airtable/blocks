[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: expandRecordList](_airtable_blocks_ui__expandrecordlist.md)

# External module: @airtable/blocks/ui: expandRecordList

## Index

### Functions

-   [expandRecordList](_airtable_blocks_ui__expandrecordlist.md#expandrecordlist)

## Functions

### expandRecordList

▸ **expandRecordList**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›,
`opts?`: undefined | object): _void_

_Defined in
[src/ui/expand_record_list.ts:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/expand_record_list.ts#L26)_

Expands a list of records in the Airtable UI

**`example`**

```js
import {expandRecordList} from '@airtable/blocks/ui';
expandRecordList([record1, record2, record3]);

expandRecordList([record1, record2], {
    fields: [field1, field2],
});
```

**Parameters:**

| Name      | Type                                                       | Description                                               |
| --------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)› | the records to expand. Duplicate records will be removed. |
| `opts?`   | undefined &#124; object                                    | -                                                         |

**Returns:** _void_
