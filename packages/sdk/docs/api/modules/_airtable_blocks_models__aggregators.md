[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Aggregators](_airtable_blocks_models__aggregators.md)

# External module: @airtable/blocks/models: Aggregators

## Index

### Interfaces

-   [Aggregator](_airtable_blocks_models__aggregators.md#aggregator)

### Type aliases

-   [AggregatorKey](_airtable_blocks_models__aggregators.md#aggregatorkey)

## Interfaces

### Aggregator

• **Aggregator**:

_Defined in
[src/models/aggregators.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/aggregators.ts#L25)_

Aggregators can be used to compute aggregates for cell values.

**Example:**

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
[src/models/aggregators.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/aggregators.ts#L29)_

A user friendly name for this aggregator that can be displayed to users.

### key

• **key**: _[AggregatorKey](_airtable_blocks_models__aggregators.md#aggregatorkey)_

_Defined in
[src/models/aggregators.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/aggregators.ts#L27)_

A unique key for this aggregator that can be used to identify it in code.

### shortDisplayName

• **shortDisplayName**: _string_

_Defined in
[src/models/aggregators.ts:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/aggregators.ts#L31)_

A short user friendly name for this aggregator that can be displayed to users.

### aggregate

▸ **aggregate**(`records`: Array‹[Record](_airtable_blocks_models__record.md#record)›, `field`:
[Field](_airtable_blocks_models__field.md#field)): _unknown_

_Defined in
[src/models/aggregators.ts:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/aggregators.ts#L37)_

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
[src/models/aggregators.ts:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/aggregators.ts#L39)_

Aggregates the value of `field` in each of `records` to produce a single value, formatted as a
string.

**Parameters:**

| Name      | Type                                                       |
| --------- | ---------------------------------------------------------- |
| `records` | Array‹[Record](_airtable_blocks_models__record.md#record)› |
| `field`   | [Field](_airtable_blocks_models__field.md#field)           |

**Returns:** _string_

## Type aliases

### AggregatorKey

Ƭ **AggregatorKey**: _string_

_Defined in
[src/types/aggregators.ts:4](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/aggregators.ts#L4)_
