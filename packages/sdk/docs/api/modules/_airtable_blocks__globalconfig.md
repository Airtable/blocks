[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks: globalConfig](_airtable_blocks__globalconfig.md)

# External module: @airtable/blocks: globalConfig

## Index

### Classes

-   [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig)

### Interfaces

-   [GlobalConfigArray](_airtable_blocks__globalconfig.md#globalconfigarray)
-   [GlobalConfigObject](_airtable_blocks__globalconfig.md#globalconfigobject)
-   [GlobalConfigUpdate](_airtable_blocks__globalconfig.md#globalconfigupdate)
-   [PartialGlobalConfigUpdate](_airtable_blocks__globalconfig.md#partialglobalconfigupdate)

### Type aliases

-   [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)
-   [GlobalConfigPath](_airtable_blocks__globalconfig.md#globalconfigpath)
-   [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)
-   [PartialGlobalConfigKey](_airtable_blocks__globalconfig.md#partialglobalconfigkey)
-   [PartialGlobalConfigPath](_airtable_blocks__globalconfig.md#partialglobalconfigpath)
-   [WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)

## Classes

### GlobalConfig

• **GlobalConfig**:

_Defined in
[src/global_config.ts:104](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L104)_

A key-value store for persisting configuration options for a block installation.

The contents will be synced in real-time to all logged-in users of the installation. Contents will
not be updated in real-time when the installation is running in a publicly shared base.

Any key can be watched to know when the value of the key changes.

You should not need to construct this object yourself.

**Example:**

```js
import {globalConfig} from '@airtable/blocks';
```

### checkPermissionsForSet

▸ **checkPermissionsForSet**(`key?`:
[PartialGlobalConfigKey](_airtable_blocks__globalconfig.md#partialglobalconfigkey), `value?`:
[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/global_config.ts:196](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L196)_

Checks whether the current user has permission to set the given global config key.

Accepts partial input, in the same format as [setAsync](_airtable_blocks__globalconfig.md#setasync).
The more information provided, the more accurate the permissions check will be.

**Example:**

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

| Name     | Type                                                                               | Description                                                                                    |
| -------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `key?`   | [PartialGlobalConfigKey](_airtable_blocks__globalconfig.md#partialglobalconfigkey) | A string for the top-level key, or an array of strings describing the path to set.             |
| `value?` | [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)           | The value to set at the specified path. Use `undefined` to delete the value at the given path. |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can set the specified key,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForSetPaths

▸ **checkPermissionsForSetPaths**(`updates?`:
ReadonlyArray‹[PartialGlobalConfigUpdate](_airtable_blocks__globalconfig.md#partialglobalconfigupdate)›):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/global_config.ts:296](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L296)_

Checks whether the current user has permission to perform the specified updates to global config.

Accepts partial input, in the same format as
[setPathsAsync](_airtable_blocks__globalconfig.md#setpathsasync). The more information provided, the
more accurate the permissions check will be.

**Example:**

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

| Name       | Type                                                                                                    | Description                  |
| ---------- | ------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `updates?` | ReadonlyArray‹[PartialGlobalConfigUpdate](_airtable_blocks__globalconfig.md#partialglobalconfigupdate)› | The paths and values to set. |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can set the specified key,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### get

▸ **get**(`key`: [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey)): _unknown_

_Defined in
[src/global_config.ts:158](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L158)_

Get the value at a path. Throws an error if the path is invalid.

**Example:**

```js
import {globalConfig} from '@airtable/blocks';

const topLevelValue = globalConfig.get('topLevelKey');
const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
```

**Parameters:**

| Name  | Type                                                                 | Description                                                                              |
| ----- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `key` | [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey) | A string for the top-level key, or an array of strings describing the path to the value. |

**Returns:** _unknown_

The value at the provided path, or `undefined` if no value exists at that path.

### hasPermissionToSet

▸ **hasPermissionToSet**(`key?`:
[PartialGlobalConfigKey](_airtable_blocks__globalconfig.md#partialglobalconfigkey), `value?`:
[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)): _boolean_

_Defined in
[src/global_config.ts:231](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L231)_

An alias for `globalConfig.checkPermissionsForSet(key, value).hasPermission`.

Checks whether the current user has permission to set the given global config key.

Accepts partial input, in the same format as [setAsync](_airtable_blocks__globalconfig.md#setasync).
The more information provided, the more accurate the permissions check will be.

**Example:**

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

| Name     | Type                                                                               | Description                                                                                    |
| -------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `key?`   | [PartialGlobalConfigKey](_airtable_blocks__globalconfig.md#partialglobalconfigkey) | A string for the top-level key, or an array of strings describing the path to set.             |
| `value?` | [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)           | The value to set at the specified path. Use `undefined` to delete the value at the given path. |

**Returns:** _boolean_

boolean Whether or not the user can set the specified key.

### hasPermissionToSetPaths

▸ **hasPermissionToSetPaths**(`updates?`:
ReadonlyArray‹[PartialGlobalConfigUpdate](_airtable_blocks__globalconfig.md#partialglobalconfigupdate)›):
_boolean_

_Defined in
[src/global_config.ts:333](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L333)_

An alias for `globalConfig.checkPermissionsForSetPaths(updates).hasPermission`.

Checks whether the current user has permission to perform the specified updates to global config.

Accepts partial input, in the same format as
[setPathsAsync](_airtable_blocks__globalconfig.md#setpathsasync). The more information provided, the
more accurate the permissions check will be.

**Example:**

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

| Name       | Type                                                                                                    | Description                  |
| ---------- | ------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `updates?` | ReadonlyArray‹[PartialGlobalConfigUpdate](_airtable_blocks__globalconfig.md#partialglobalconfigupdate)› | The paths and values to set. |

**Returns:** _boolean_

boolean Whether or not the user has permission to apply the specified updates to globalConfig.

### setAsync

▸ **setAsync**(`key`: [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey),
`value?`: [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)): _Promise‹void›_

_Defined in
[src/global_config.ts:267](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L267)_

Sets a value at a path. Throws an error if the path or value is invalid.

This action is asynchronous: `await` the returned promise if you wish to wait for the update to be
persisted to Airtable servers. Updates are applied optimistically locally, so your change will be
reflected in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) before the promise
resolves.

**Example:**

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

▸ **setPathsAsync**(`updates`:
Array‹[GlobalConfigUpdate](_airtable_blocks__globalconfig.md#globalconfigupdate)›): _Promise‹void›_

_Defined in
[src/global_config.ts:373](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L373)_

Sets multiple values. Throws if any path or value is invalid.

This action is asynchronous: `await` the returned promise if you wish to wait for the updates to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) before the promise
resolves.

**Example:**

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

| Name      | Type                                                                              | Description                  |
| --------- | --------------------------------------------------------------------------------- | ---------------------------- |
| `updates` | Array‹[GlobalConfigUpdate](_airtable_blocks__globalconfig.md#globalconfigupdate)› | The paths and values to set. |

**Returns:** _Promise‹void›_

A promise that will resolve once the update is persisted to Airtable.

### unwatch

▸ **unwatch**(`keys`:
[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey) |
ReadonlyArray‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›,
`callback`: function, `context?`: FlowAnyObject | null):
_Array‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

▪ **keys**: _[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)
|
ReadonlyArray‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›_

the keys to unwatch

▪ **callback**: _function_

the function passed to `.watch` for these keys

▸ (`model`: this, `key`:
[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey), ...`args`:
Array‹any›): _unknown_

**Parameters:**

| Name      | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `model`   | this                                                                                   |
| `key`     | [WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey) |
| `...args` | Array‹any›                                                                             |

▪`Optional` **context**: _FlowAnyObject | null_

the context that was passed to `.watch` for this `callback`

**Returns:**
_Array‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`:
[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey) |
ReadonlyArray‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›,
`callback`: function, `context?`: FlowAnyObject | null):
_Array‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

▪ **keys**: _[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)
|
ReadonlyArray‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›_

the keys to watch

▪ **callback**: _function_

a function to call when those keys change

▸ (`model`: this, `key`:
[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey), ...`args`:
Array‹any›): _unknown_

**Parameters:**

| Name      | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `model`   | this                                                                                   |
| `key`     | [WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey) |
| `...args` | Array‹any›                                                                             |

▪`Optional` **context**: _FlowAnyObject | null_

an optional context for `this` in `callback`.

**Returns:**
_Array‹[WatchableGlobalConfigKey](_airtable_blocks__globalconfig.md#watchableglobalconfigkey)›_

the array of keys that were watched

## Interfaces

### GlobalConfigArray

• **GlobalConfigArray**:

_Defined in
[src/global_config.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L25)_

An array of [GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue)s

---

### GlobalConfigObject

• **GlobalConfigObject**:

_Defined in
[src/global_config.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L27)_

An object containing {@GlobalConfigValue}s

---

### GlobalConfigUpdate

• **GlobalConfigUpdate**:

_Defined in
[src/global_config.ts:46](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L46)_

An instruction to set `path` within globalConfig to `value`.

### path

• **path**: _[GlobalConfigPath](_airtable_blocks__globalconfig.md#globalconfigpath)_

_Defined in
[src/global_config.ts:48](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L48)_

The path to update.

### value

• **value**: _[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) | undefined_

_Defined in
[src/global_config.ts:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L50)_

The value at `path` after updating.

---

### PartialGlobalConfigUpdate

• **PartialGlobalConfigUpdate**:

_Defined in
[src/global_config.ts:54](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L54)_

A version of [GlobalConfigUpdate](_airtable_blocks__globalconfig.md#globalconfigupdate) where not
all values are yet known.

### `Optional` path

• **path**? : _[PartialGlobalConfigPath](_airtable_blocks__globalconfig.md#partialglobalconfigpath)
| undefined_

_Defined in
[src/global_config.ts:56](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L56)_

The path to update.

### `Optional` value

• **value**? : _[GlobalConfigValue](_airtable_blocks__globalconfig.md#globalconfigvalue) |
undefined_

_Defined in
[src/global_config.ts:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L58)_

The value at `path` after updating.

## Type aliases

### GlobalConfigKey

Ƭ **GlobalConfigKey**: _[GlobalConfigPath](_airtable_blocks__globalconfig.md#globalconfigpath) |
string_

_Defined in
[src/global_config.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L19)_

A single top level key or a path into the global config object

---

### GlobalConfigPath

Ƭ **GlobalConfigPath**: _ReadonlyArray‹string›_

_Defined in
[src/global_config.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L17)_

A path of keys indexing into the global config object

---

### GlobalConfigValue

Ƭ **GlobalConfigValue**: _null | boolean | number | string |
[GlobalConfigArray](_airtable_blocks__globalconfig.md#globalconfigarray) |
[GlobalConfigObject](_airtable_blocks__globalconfig.md#globalconfigobject)_

_Defined in
[src/global_config.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L32)_

The types of value that can be stored in globalConfig.

---

### PartialGlobalConfigKey

Ƭ **PartialGlobalConfigKey**:
_[PartialGlobalConfigPath](_airtable_blocks__globalconfig.md#partialglobalconfigpath) | string |
undefined_

_Defined in
[src/global_config.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L23)_

A [GlobalConfigKey](_airtable_blocks__globalconfig.md#globalconfigkey) with some parts of the
path/key unknown (`undefined`)

---

### PartialGlobalConfigPath

Ƭ **PartialGlobalConfigPath**: _ReadonlyArray‹string | undefined›_

_Defined in
[src/global_config.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L21)_

A [GlobalConfigPath](_airtable_blocks__globalconfig.md#globalconfigpath), with some parts of the
path unknown (`undefined`)

---

### WatchableGlobalConfigKey

Ƭ **WatchableGlobalConfigKey**: _string_

_Defined in
[src/global_config.ts:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/global_config.ts#L64)_

You can watch any top-level key in global config. Use '\*' to watch every change.
