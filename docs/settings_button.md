## SettingsButton

**Extends Watchable**

Interface to the settings button that lives outside the block's viewport.

Watch `click` to handle click events on the button.

### Parameters

-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {settingsButton} from 'airtable-block';
settingsButton.isVisible = true;
settingsButton.watch('click', () => {
    alert('Clicked!');
});
```

### isVisible

Whether the settings button is being shown. Set to `true` to show the settings button. Can be
watched.

Type: [boolean][1]

Returns **[boolean][1]**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
