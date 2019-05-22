## GlobalConfig

**Extends Watchable**

A key-value store for persisting configuration options for a block installation.

The contents will be synced in real-time to all logged-in users of the installation. Contents will
not be updated in real-time when the installation is running in a publicly shared base, or in
development mode.

Any key can be watched to know when the value of the key changes.

### Parameters

-   `initialKvValuesByKey` **GlobalConfigData**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {globalConfig} from 'airtable-block';
```

### get

#### Parameters

-   `key` **GlobalConfigKey**

Returns **GlobalConfigValue**

### canSet

#### Parameters

-   `key` **GlobalConfigKey**

### set

#### Parameters

-   `key` **GlobalConfigKey**
-   `value` **GlobalConfigValue**

Returns **AirtableWriteAction&lt;void, {}>**

### canSetPaths

#### Parameters

-   `updates` **[Array][1]&lt;GlobalConfigUpdate>**

### setPaths

#### Parameters

-   `updates` **[Array][1]&lt;GlobalConfigUpdate>**

Returns **AirtableWriteAction&lt;void, {}>**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
