## fieldTypes

### Examples

```javascript
import {models} from 'airtable-block';
const numberFields = myTable.fields.filter(field => field.config.type === models.fieldTypes.NUMBER);
```

## viewTypes

### Examples

```javascript
import {models} from 'airtable-block';
const gridViews = myTable.views.filter(view => view.type === models.viewTypes.GRID);
```

## generateGuid

Helper to generate a GUID

### Examples

```javascript
import {models} from 'airtable-block';
const id = models.generateGuid();
```
