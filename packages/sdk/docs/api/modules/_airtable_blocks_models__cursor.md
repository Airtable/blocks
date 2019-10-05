[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Cursor](_airtable_blocks_models__cursor.md)

# External module: @airtable/blocks/models: Cursor

## Index

### Classes

-   [Cursor](_airtable_blocks_models__cursor.md#cursor)

## Classes

### Cursor

• **Cursor**:

_Defined in
[src/models/cursor.ts:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/cursor.ts#L36)_

Contains information about the state of the user's current interactions in Airtable

**`example`**

```js
import {cursor} from '@airtable/blocks';
```

### activeTableId

• **activeTableId**:

_Defined in
[src/models/cursor.ts:176](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/cursor.ts#L176)_

The currently active table ID.

Can be watched.

**`returns`** The currently active table ID. Can return null when the active table has changed and
is not yet loaded.

### activeViewId

• **activeViewId**:

_Defined in
[src/models/cursor.ts:187](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/cursor.ts#L187)_

The currently active view ID. This will always be a view belonging to `activeTableId`

Can be watched.

**`returns`** The currently active view ID. Can return null when the active view has changed and is
not yet loaded.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L41)_

**`function`**

**`returns`** The ID for this model.

### isDataLoaded

• **isDataLoaded**:

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[isDataLoaded](_airtable_blocks_models__abstract_models.md#isdataloaded)_

_Defined in
[src/models/abstract_model_with_async_data.ts:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model_with_async_data.ts#L87)_

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L73)_

A boolean denoting whether the model has been deleted.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

**`function`**

**`returns`** `true` if the model has been deleted, and `false` otherwise.

### selectedRecordIds

• **selectedRecordIds**:

_Defined in
[src/models/cursor.ts:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/cursor.ts#L141)_

The record IDs of all currently selected records, or an empty array if no records are selected.

Can be watched.

**`returns`** The record IDs of all currently selected records, or an empty array if no records are
selected.

### isRecordSelected

▸ **isRecordSelected**(`recordOrRecordId`: [Record](_airtable_blocks_models__record.md#record) |
string): _boolean_

_Defined in
[src/models/cursor.ts:155](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/cursor.ts#L155)_

Checks whether a given record is selected.

**Parameters:**

| Name               | Type                                                              | Description                           |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------- |
| `recordOrRecordId` | [Record](_airtable_blocks_models__record.md#record) &#124; string | The record or record ID to check for. |

**Returns:** _boolean_

`true` if the given record is selected, `false` otherwise.

### loadDataAsync

▸ **loadDataAsync**(): _Promise‹void›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[loadDataAsync](_airtable_blocks_models__abstract_models.md#loaddataasync)_

_Defined in
[src/models/abstract_model_with_async_data.ts:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model_with_async_data.ts#L117)_

Will cause all the async data to be fetched and retained. Every call to `loadDataAsync` should have
a matching call to `unloadData`.

Returns a Promise that will resolve once the data is loaded.

**Returns:** _Promise‹void›_

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L94)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unloadData

▸ **unloadData**(): _void_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unloadData](_airtable_blocks_models__abstract_models.md#unloaddata)_

_Defined in
[src/models/abstract_model_with_async_data.ts:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model_with_async_data.ts#L151)_

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`: WatchableCursorKey | ReadonlyArray‹WatchableCursorKey›, `callback`:
FlowAnyFunction, `context?`: FlowAnyObject | null): _Array‹WatchableCursorKey›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/models/abstract_model_with_async_data.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model_with_async_data.ts#L69)_

Unwatching a key that needs to load data asynchronously will automatically cause the data to be
released. Once the data is available, the callback will be called.

**`inheritdoc`**

**Parameters:**

| Name       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| `keys`     | WatchableCursorKey &#124; ReadonlyArray‹WatchableCursorKey› |
| `callback` | FlowAnyFunction                                             |
| `context?` | FlowAnyObject &#124; null                                   |

**Returns:** _Array‹WatchableCursorKey›_

### watch

▸ **watch**(`keys`: WatchableCursorKey | ReadonlyArray‹WatchableCursorKey›, `callback`:
FlowAnyFunction, `context?`: FlowAnyObject | null): _Array‹WatchableCursorKey›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/models/abstract_model_with_async_data.ts:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model_with_async_data.ts#L44)_

Watching a key that needs to load data asynchronously will automatically cause the data to be
fetched. Once the data is available, the callback will be called.

**`inheritdoc`**

**Parameters:**

| Name       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| `keys`     | WatchableCursorKey &#124; ReadonlyArray‹WatchableCursorKey› |
| `callback` | FlowAnyFunction                                             |
| `context?` | FlowAnyObject &#124; null                                   |

**Returns:** _Array‹WatchableCursorKey›_
