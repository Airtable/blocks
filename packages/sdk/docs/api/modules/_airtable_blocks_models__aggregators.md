[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Aggregators](_airtable_blocks_models__aggregators.md)

# External module: @airtable/blocks/models: Aggregators

## Index

### Type aliases

-   [Aggregator](_airtable_blocks_models__aggregators.md#aggregator)

## Type aliases

### Aggregator

Ƭ **Aggregator**: _Object_

_Defined in
[src/models/aggregators.ts:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/aggregators.ts#L30)_

Aggregators can be used to compute aggregates for cell values.

**`example`**

```js
// To get a list of aggregators supported for a specific field:
const fieldAggregators = myField.availableAggregators;

// To compute the total attachment size of an attachment field:
import {aggregators} from '@airtable/blocks/models';
const aggregator = aggregators.totalAttachmentSize;
const value = aggregator.aggregate(myRecords, myAttachmentField);
const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
```
