## modes

create a record coloring mode object

### Examples

```javascript
import {models} from 'airtable-block';

// no record coloring:
const recordColorMode = models.recordColoring.modes.none();
// color by select field:
const recordColorMode = models.recordColoring.modes.bySelectField(someSelectField);
// color from view:
const recordColorMode = models.recordColoring.modes.fromView(someView);

// with a query result:
const queryResult = table.selectRecords({recordColorMode});
```
