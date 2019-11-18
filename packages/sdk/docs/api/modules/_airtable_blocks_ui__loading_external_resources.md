[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Loading external resources](_airtable_blocks_ui__loading_external_resources.md)

# External module: @airtable/blocks/ui: Loading external resources

## Index

### Functions

-   [loadCSSFromString](_airtable_blocks_ui__loading_external_resources.md#loadcssfromstring)
-   [loadCSSFromURLAsync](_airtable_blocks_ui__loading_external_resources.md#loadcssfromurlasync)
-   [loadScriptFromURLAsync](_airtable_blocks_ui__loading_external_resources.md#loadscriptfromurlasync)

## Functions

### loadCSSFromString

▸ **loadCSSFromString**(`css`: string): _HTMLStyleElement_

_Defined in
[src/ui/remote_utils.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/remote_utils.ts#L16)_

Injects CSS from a string into the page.

**Example:**

```js
import {loadCSSFromString} from '@airtable/blocks/ui';
loadCSSFromString('body { background: red; }');
```

**Parameters:**

| Name  | Type   | Description     |
| ----- | ------ | --------------- |
| `css` | string | The CSS string. |

**Returns:** _HTMLStyleElement_

The style tag inserted into the page.

---

### loadCSSFromURLAsync

▸ **loadCSSFromURLAsync**(`url`: string): _Promise‹HTMLLinkElement›_

_Defined in
[src/ui/remote_utils.ts:38](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/remote_utils.ts#L38)_

Injects CSS from a remote URL.

**Example:**

```js
import {loadCSSFromURLAsync} from '@airtable/blocks/ui';
loadCSSFromURLAsync('https://example.com/style.css');
```

**Parameters:**

| Name  | Type   | Description                |
| ----- | ------ | -------------------------- |
| `url` | string | The URL of the stylesheet. |

**Returns:** _Promise‹HTMLLinkElement›_

A Promise that resolves to the style tag inserted into the page.

---

### loadScriptFromURLAsync

▸ **loadScriptFromURLAsync**(`url`: string): _Promise‹HTMLScriptElement›_

_Defined in
[src/ui/remote_utils.ts:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/remote_utils.ts#L70)_

Injects Javascript from a remote URL.

**Example:**

```js
import {loadScriptFromURLAsync} from '@airtable/blocks/ui';
loadScriptFromURLAsync('https://example.com/script.js');
```

**Parameters:**

| Name  | Type   | Description            |
| ----- | ------ | ---------------------- |
| `url` | string | The URL of the script. |

**Returns:** _Promise‹HTMLScriptElement›_

A Promise that resolves to the script tag inserted into the page.
