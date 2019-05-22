## loadCSSFromString

Injects CSS from a string into the page.

### Parameters

-   `string` **[string][1]**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.loadCSSFromString('body { background: red; }');
```

Returns **[HTMLStyleElement][2]** the style tag inserted into the page.

## loadCSSFromURLAsync

Injects CSS from a remote URL.

### Parameters

-   `url` **[string][1]**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.loadCSSFromURLAsync('https://example.com/style.css');
```

Returns **[Promise][3]&lt;[HTMLLinkElement][4]>** a Promise that resolves to the style tag inserted
into the page.

## loadScriptFromURLAsync

Injects Javascript from a remote URL.

### Parameters

-   `url` **[string][1]**

### Examples

```javascript
import {UI} from 'airtable-block';
UI.loadScriptFromURLAsync('https://example.com/script.js');
```

Returns **[Promise][3]&lt;[HTMLScriptElement][5]>** a Promise that resolves to the script tag
inserted into the page.

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/API/HTMLStyleElement
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[4]: https://developer.mozilla.org/docs/Web/API/HTMLLinkElement
[5]: https://developer.mozilla.org/docs/Web/API/HTMLScriptElement
