[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks: globalConfig](_airtable_blocks__globalconfig.md)

# External module: @airtable/blocks: globalConfig

## Index

### Classes

-   [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig)

### Type aliases

-   [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)
-   [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)

## Classes

### GlobalConfig

• **GlobalConfig**:

_Defined in
[src/global_config.ts:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L84)_

A key-value store for persisting configuration options for a block installation.

The contents will be synced in real-time to all logged-in users of the installation. Contents will
not be updated in real-time when the installation is running in a publicly shared base.

Any key can be watched to know when the value of the key changes.

You should not need to construct this object yourself.

**`example`**

```js
import {globalConfig} from '@airtable/blocks';
```

### checkPermissionsForSet

▸ **checkPermissionsForSet**(`key?`: ReadonlyArray‹string | undefined› | string, `value?`:
[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)): _PermissionCheckResult_

_Defined in
[src/global_config.ts:206](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L206)_

Checks whether the current user has permission to set the given global config key.

Accepts partial input, in the same format as [setAsync](_airtable_blocks__globalconfig.md#setasync).
The more information provided, the more accurate the permissions check will be.

**`example`**

```js
// Check if user can update a specific key and value.
const setCheckResult = globalConfig.checkPermissionsForSet('favoriteColor', 'purple');
if (!setCheckResult.hasPermission) {
    alert(setCheckResult.reasonDisplayString);
}

// Check if user can update a specific key, when you don't know the value yet.
const setKeyCheckResult = globalConfig.checkPermissionsForSet('favoriteColor');

// Check if user could set globalConfig values, without knowing the specific key/value yet
const setUnknownKeyCheckResult = globalConfig.checkPermissionsForSet();
```

**Parameters:**

| Name     | Type                                                                     |
| -------- | ------------------------------------------------------------------------ |
| `key?`   | ReadonlyArray‹string &#124; undefined› &#124; string                     |
| `value?` | [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can set the specified key,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForSetPaths

▸ **checkPermissionsForSetPaths**(`updates?`: ReadonlyArray‹object›): _PermissionCheckResult_

_Defined in
[src/global_config.ts:309](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L309)_

Checks whether the current user has permission to perform the specified updates to global config.

Accepts partial input, in the same format as
[setPathsAsync](_airtable_blocks__globalconfig.md#setpathsasync). The more information provided, the
more accurate the permissions check will be.

**`example`**

```js
// Check if user can update a specific keys and values.
const setPathsCheckResult = globalConfig.checkPermissionsForSet([
    {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
    {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
]);
if (!setPathsCheckResult.hasPermission) {
    alert(setPathsCheckResult.reasonDisplayString);
}

// Check if user could potentially set globalConfig values.
// Equivalent to globalConfig.checkPermissionsForSet()
const setUnknownPathsCheckResult = globalConfig.checkPermissionsForSetPaths();
```

**Parameters:**

| Name       | Type                  |
| ---------- | --------------------- |
| `updates?` | ReadonlyArray‹object› |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can set the specified key,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### get

▸ **get**(`key`: [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)):
_[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) | undefined_

_Defined in
[src/global_config.ts:168](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L168)_

Get the value at a path. Throws an error if the path is invalid.

**`example`**

```js
import {globalConfig} from '@airtable/blocks';

const topLevelValue = globalConfig.get('topLevelKey');
const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
```

**Parameters:**

| Name  | Type                                                                 | Description                                                                              |
| ----- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `key` | [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey) | A string for the top-level key, or an array of strings describing the path to the value. |

**Returns:** _[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) | undefined_

The value at the provided path, or `undefined` if no value exists at that path.

### hasPermissionToSet

▸ **hasPermissionToSet**(`key?`: ReadonlyArray‹string | undefined› | string, `value?`:
[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)): _boolean_

_Defined in
[src/global_config.ts:241](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L241)_

An alias for `globalConfig.checkPermissionsForSet(key, value).hasPermission`.

Checks whether the current user has permission to set the given global config key.

Accepts partial input, in the same format as [setAsync](_airtable_blocks__globalconfig.md#setasync).
The more information provided, the more accurate the permissions check will be.

**`example`**

```js
// Check if user can update a specific key and value.
const canSetFavoriteColorToPurple = globalConfig.hasPermissionToSet('favoriteColor', 'purple');
if (!canSetFavoriteColorToPurple) {
    alert('Not allowed!');
}

// Check if user can update a specific key, when you don't know the value yet.
const canSetFavoriteColor = globalConfig.hasPermissionToSet('favoriteColor');

// Check if user could set globalConfig values, without knowing the specific key/value yet
const canSetGlobalConfig = globalConfig.hasPermissionToSet();
```

**Parameters:**

| Name     | Type                                                                     |
| -------- | ------------------------------------------------------------------------ |
| `key?`   | ReadonlyArray‹string &#124; undefined› &#124; string                     |
| `value?` | [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) |

**Returns:** _boolean_

boolean Whether or not the user can set the specified key.

### hasPermissionToSetPaths

▸ **hasPermissionToSetPaths**(`updates?`: ReadonlyArray‹object›): _boolean_

_Defined in
[src/global_config.ts:349](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L349)_

An alias for `globalConfig.checkPermissionsForSetPaths(updates).hasPermission`.

Checks whether the current user has permission to perform the specified updates to global config.

Accepts partial input, in the same format as
[setPathsAsync](_airtable_blocks__globalconfig.md#setpathsasync). The more information provided, the
more accurate the permissions check will be.

**`example`**

```js
// Check if user can update a specific keys and values.
const canSetPaths = globalConfig.hasPermissionToSetPaths([
    {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
    {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
]);
if (!canSetPaths) {
    alert('not allowed!');
}

// Check if user could potentially set globalConfig values.
// Equivalent to globalConfig.hasPermissionToSet()
const canSetAnyPaths = globalConfig.hasPermissionToSetPaths();
```

**Parameters:**

| Name       | Type                  |
| ---------- | --------------------- |
| `updates?` | ReadonlyArray‹object› |

**Returns:** _boolean_

boolean Whether or not the user has permission to apply the specified updates to globalConfig.

### setAsync

▸ **setAsync**(`key`: [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey),
`value?`: [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)): _Promise‹void›_

_Defined in
[src/global_config.ts:280](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L280)_

Sets a value at a path. Throws an error if the path or value is invalid.

This action is asynchronous: `await` the returned promise if you wish to wait for the update to be
persisted to Airtable servers. Updates are applied optimistically locally, so your change will be
reflected in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) before the promise
resolves.

**`example`**

```js
import {globalConfig} from '@airtable/blocks';

function updateFavoriteColorIfPossible(color) {
    if (globalConfig.hasPermissionToSetPaths('favoriteColor', color)) {
        globalConfig.setPathsAsync('favoriteColor', color);
    }
    // The update is now applied within your block (eg will be reflected in
    // globalConfig) but are still being saved to Airtable servers (eg.
    // may not be updated for other users yet)
}

async function updateFavoriteColorIfPossibleAsync(color) {
    if (globalConfig.hasPermissionToSet('favoriteColor', color)) {
        await globalConfig.setAsync('favoriteColor', color);
    }
    // globalConfig updates have been saved to Airtable servers.
    alert('favoriteColor has been updated');
}
```

**Parameters:**

| Name     | Type                                                                     | Description                                                                                    |
| -------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `key`    | [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)     | A string for the top-level key, or an array of strings describing the path to set.             |
| `value?` | [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) | The value to set at the specified path. Use `undefined` to delete the value at the given path. |

**Returns:** _Promise‹void›_

A promise that will resolve once the update is persisted to Airtable.

### setPathsAsync

▸ **setPathsAsync**(`updates`: Array‹GlobalConfigUpdate›): _Promise‹void›_

_Defined in
[src/global_config.ts:394](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L394)_

Sets multiple values. Throws if any path or value is invalid.

This action is asynchronous: `await` the returned promise if you wish to wait for the updates to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) before the promise
resolves.

**`example`**

```js
import {globalConfig} from '@airtable/blocks';

const updates = [
    {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
    {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
];

function applyUpdatesIfPossible() {
    if (globalConfig.hasPermissionToSetPaths(updates)) {
        globalConfig.setPathsAsync(updates);
    }
    // The updates are now applied within your block (eg will be reflected in
    // globalConfig) but are still being saved to Airtable servers (eg. they
    // may not be updated for other users yet)
}

async function applyUpdatesIfPossibleAsync() {
    if (globalConfig.hasPermissionToSetPaths(updates)) {
        await globalConfig.setPathsAsync(updates);
    }
    // globalConfig updates have been saved to Airtable servers.
    alert('globalConfig has been updated');
}
```

**Parameters:**

| Name      | Type                      |
| --------- | ------------------------- |
| `updates` | Array‹GlobalConfigUpdate› |

**Returns:** _Promise‹void›_

A promise that will resolve once the update is persisted to Airtable.

### unwatch

▸ **unwatch**(`keys`: WatchableGlobalConfigKey | ReadonlyArray‹WatchableGlobalConfigKey›,
`callback`: Object, `context?`: FlowAnyObject | null): _Array‹WatchableGlobalConfigKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                                    | Description                                    |
| ---------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableGlobalConfigKey &#124; ReadonlyArray‹WatchableGlobalConfigKey› | the keys to unwatch                            |
| `callback` | Object                                                                  | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                                               | -                                              |

**Returns:** _Array‹WatchableGlobalConfigKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableGlobalConfigKey | ReadonlyArray‹WatchableGlobalConfigKey›, `callback`:
Object, `context?`: FlowAnyObject | null): _Array‹WatchableGlobalConfigKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                                    | Description                               |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableGlobalConfigKey &#124; ReadonlyArray‹WatchableGlobalConfigKey› | the keys to watch                         |
| `callback` | Object                                                                  | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                                               | -                                         |

**Returns:** _Array‹WatchableGlobalConfigKey›_

the array of keys that were watched

## Type aliases

### GlobalConfigKey

Ƭ **GlobalConfigKey**: _GlobalConfigPath | string_

_Defined in
[src/global_config.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L21)_

**`typedef`** {string | Array<string>}

---

### GlobalConfigValue

Ƭ **GlobalConfigValue**: _null | boolean | number | string | GlobalConfigArray | GlobalConfigObject_

_Defined in
[src/global_config.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/global_config.ts#L29)_

**`typedef`** {null|boolean|number|string|Array<GlobalConfigValue>|object.<string,
GlobalConfigValue>}
