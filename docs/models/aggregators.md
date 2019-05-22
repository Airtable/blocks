## Aggregator

Aggregators can be used to compute aggregates for cell values.

Type: {key: [string][1], displayName: [string][1], shortDisplayName: [string][1], aggregate:
function (records: [Array][2]&lt;Record>, field: Field): any, aggregateToString: function (records:
[Array][2]&lt;Record>, field: Field): [string][1]}

### Properties

-   `key` **[string][1]**
-   `displayName` **[string][1]**
-   `shortDisplayName` **[string][1]**
-   `aggregate` **function (records: [Array][2]&lt;Record>, field: Field): any**
-   `aggregateToString` **function (records: [Array][2]&lt;Record>, field: Field): [string][1]**

### Examples

```javascript
// To get a list of aggregators supported for a specific field:
const aggregators = myField.availableAggregators;

// To compute the total attachment size of an attachment field:
import {models} from 'airtable-block';
const aggregator = models.aggregators.totalAttachmentSize;
const value = aggregator.aggregate(myRecords, myAttachmentField);
const valueAsString = aggregate.aggregateToString(myRecords, myAttachmentField);
```

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
