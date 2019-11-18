[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Abstract models](_airtable_blocks_models__abstract_models.md)

# External module: @airtable/blocks/models: Abstract models

## Index

### Classes

-   [AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel)
-   [AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata)
-   [Watchable](_airtable_blocks_models__abstract_models.md#watchable)

## Classes

### AbstractModel

• **AbstractModel**:

_Defined in
[src/models/abstract_model.ts:9](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L9)_

Abstract superclass for all models. You won't use this class directly.

### id

• **id**:

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDeleted

• **isDeleted**:

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### toString

▸ **toString**(): _string_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: WatchableKey | ReadonlyArray‹WatchableKey›, `callback`: function, `context?`:
FlowAnyObject | null): _Array‹WatchableKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

▪ **keys**: _WatchableKey | ReadonlyArray‹WatchableKey›_

the keys to unwatch

▪ **callback**: _function_

the function passed to `.watch` for these keys

▸ (`model`: this, `key`: WatchableKey, ...`args`: Array‹any›): _unknown_

**Parameters:**

| Name      | Type         |
| --------- | ------------ |
| `model`   | this         |
| `key`     | WatchableKey |
| `...args` | Array‹any›   |

▪`Optional` **context**: _FlowAnyObject | null_

the context that was passed to `.watch` for this `callback`

**Returns:** _Array‹WatchableKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableKey | ReadonlyArray‹WatchableKey›, `callback`: function, `context?`:
FlowAnyObject | null): _Array‹WatchableKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

▪ **keys**: _WatchableKey | ReadonlyArray‹WatchableKey›_

the keys to watch

▪ **callback**: _function_

a function to call when those keys change

▸ (`model`: this, `key`: WatchableKey, ...`args`: Array‹any›): _unknown_

**Parameters:**

| Name      | Type         |
| --------- | ------------ |
| `model`   | this         |
| `key`     | WatchableKey |
| `...args` | Array‹any›   |

▪`Optional` **context**: _FlowAnyObject | null_

an optional context for `this` in `callback`.

**Returns:** _Array‹WatchableKey›_

the array of keys that were watched

---

### AbstractModelWithAsyncData

• **AbstractModelWithAsyncData**:

_Defined in
[src/models/abstract_model_with_async_data.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L8)_

Abstract superclass for all block SDK models that need to fetch async data.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDataLoaded

• **isDataLoaded**:

_Defined in
[src/models/abstract_model_with_async_data.ts:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L87)_

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### loadDataAsync

▸ **loadDataAsync**(): _Promise‹void›_

_Defined in
[src/models/abstract_model_with_async_data.ts:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L117)_

Will cause all the async data to be fetched and retained. Every call to `loadDataAsync` should have
a matching call to `unloadData`.

Returns a Promise that will resolve once the data is loaded.

**Returns:** _Promise‹void›_

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unloadData

▸ **unloadData**(): _void_

_Defined in
[src/models/abstract_model_with_async_data.ts:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L151)_

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`: WatchableKey | ReadonlyArray‹WatchableKey›, `callback`: FlowAnyFunction,
`context?`: FlowAnyObject | null): _Array‹WatchableKey›_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/models/abstract_model_with_async_data.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L69)_

Unwatching a key that needs to load data asynchronously will automatically cause the data to be
released. Once the data is available, the callback will be called.

**Parameters:**

| Name       | Type                                            |
| ---------- | ----------------------------------------------- |
| `keys`     | WatchableKey &#124; ReadonlyArray‹WatchableKey› |
| `callback` | FlowAnyFunction                                 |
| `context?` | FlowAnyObject &#124; null                       |

**Returns:** _Array‹WatchableKey›_

### watch

▸ **watch**(`keys`: WatchableKey | ReadonlyArray‹WatchableKey›, `callback`: FlowAnyFunction,
`context?`: FlowAnyObject | null): _Array‹WatchableKey›_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/models/abstract_model_with_async_data.ts:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model_with_async_data.ts#L44)_

Watching a key that needs to load data asynchronously will automatically cause the data to be
fetched. Once the data is available, the callback will be called.

**Parameters:**

| Name       | Type                                            |
| ---------- | ----------------------------------------------- |
| `keys`     | WatchableKey &#124; ReadonlyArray‹WatchableKey› |
| `callback` | FlowAnyFunction                                 |
| `context?` | FlowAnyObject &#124; null                       |

**Returns:** _Array‹WatchableKey›_

---

### Watchable

• **Watchable**:

_Defined in
[src/watchable.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L11)_

Abstract superclass for watchable models. All watchable models expose `watch` and `unwatch` methods
that allow consumers to subscribe to changes to that model.

This class should not be used directly.

### unwatch

▸ **unwatch**(`keys`: WatchableKey | ReadonlyArray‹WatchableKey›, `callback`: function, `context?`:
FlowAnyObject | null): _Array‹WatchableKey›_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

▪ **keys**: _WatchableKey | ReadonlyArray‹WatchableKey›_

the keys to unwatch

▪ **callback**: _function_

the function passed to `.watch` for these keys

▸ (`model`: this, `key`: WatchableKey, ...`args`: Array‹any›): _unknown_

**Parameters:**

| Name      | Type         |
| --------- | ------------ |
| `model`   | this         |
| `key`     | WatchableKey |
| `...args` | Array‹any›   |

▪`Optional` **context**: _FlowAnyObject | null_

the context that was passed to `.watch` for this `callback`

**Returns:** _Array‹WatchableKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableKey | ReadonlyArray‹WatchableKey›, `callback`: function, `context?`:
FlowAnyObject | null): _Array‹WatchableKey›_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

▪ **keys**: _WatchableKey | ReadonlyArray‹WatchableKey›_

the keys to watch

▪ **callback**: _function_

a function to call when those keys change

▸ (`model`: this, `key`: WatchableKey, ...`args`: Array‹any›): _unknown_

**Parameters:**

| Name      | Type         |
| --------- | ------------ |
| `model`   | this         |
| `key`     | WatchableKey |
| `...args` | Array‹any›   |

▪`Optional` **context**: _FlowAnyObject | null_

an optional context for `this` in `callback`.

**Returns:** _Array‹WatchableKey›_

the array of keys that were watched
