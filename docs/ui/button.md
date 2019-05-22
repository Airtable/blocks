## Button

**Extends React.Component**

Clickable button component.

### Parameters

-   `props` **ButtonProps**

### Examples

```javascript
import {UI} from 'airtable-block';
const button = (
    <UI.Button
       disabled={false}
       theme={UI.Button.themes.BLUE}
       onClick={() = alert('Clicked!')}>
        Done
    </UI.Button>
);
```
