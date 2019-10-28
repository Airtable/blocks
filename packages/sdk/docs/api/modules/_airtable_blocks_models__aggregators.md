[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Aggregators](_airtable_blocks_models__aggregators.md)

# External module: @airtable/blocks/models: Aggregators

## Index

### Interfaces

-   [Aggregator](_airtable_blocks_models__aggregators.md#aggregator)

## Interfaces

### Aggregator

• **Aggregator**:

_Defined in
[src/models/aggregators.ts:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L24)_

Aggregators can be used to compute aggregates for cell values.

**`example`**

```js
import {aggregators} from '@airtable/blocks/models';

// To get a list of aggregators supported for a specific field:
const fieldAggregators = myField.availableAggregators;

// To compute the total attachment size of an attachment field:
const aggregator = aggregators.totalAttachmentSize;
const value = aggregator.aggregate(myRecords, myAttachmentField);
const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
```

### displayName

• **displayName**: _string_

_Defined in
[src/models/aggregators.ts:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L28)_

A user friendly name for this aggregator that can be displayed to users.

### key

• **key**: _AggregatorKey_

_Defined in
[src/models/aggregators.ts:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L26)_

A unique key for this aggregator that can be used to identify it in code.

### shortDisplayName

• **shortDisplayName**: _string_

_Defined in
[src/models/aggregators.ts:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L30)_

A short user friendly name for this aggregator that can be displayed to users.

### aggregate

▸ **aggregate**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›, `field`:
[Field](_airtable_blocks_models__field.md#field)): _unknown_

_Defined in
[src/models/aggregators.ts:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L36)_

Aggregates the value of `field` in each of `records` to produce a single value.

**Parameters:**

| Name      | Type                                                       |
| --------- | ---------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)› |
| `field`   | [Field](_airtable_blocks_models__field.md#field)           |

**Returns:** _unknown_

### aggregateToString

▸ **aggregateToString**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›,
`field`: [Field](_airtable_blocks_models__field.md#field)): _string_

_Defined in
[src/models/aggregators.ts:38](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L38)_

Aggregates the value of `field` in each of `records` to produce a single value, formatted as a
string.

**Parameters:**

| Name      | Type                                                       |
| --------- | ---------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)› |
| `field`   | [Field](_airtable_blocks_models__field.md#field)           |

**Returns:** _string_
