[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: View](_airtable_blocks_models__view.md)

# External module: @airtable/blocks/models: View

## Index

### Classes

-   [View](_airtable_blocks_models__view.md#view)
-   [ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult)

### Variables

-   [ViewTypes](_airtable_blocks_models__view.md#const-viewtypes)

## Classes

### View

• **View**:

_Defined in
[src/models/view.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view.ts#L27)_

A class that represents an Airtable view. Every [Table](_airtable_blocks_models__table.md#table) has
one or more views.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L41)_

**`function`**

**`returns`** The ID for this model.

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

### name

• **name**:

_Defined in
[src/models/view.ts:122](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view.ts#L122)_

**`function`**

**`returns`** The name of the view. Can be watched.

**`example`**

```js
console.log(myView.name);
// => 'Grid view'
```

### type

• **type**:

_Defined in
[src/models/view.ts:134](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view.ts#L134)_

**`function`**

**`returns`** The type of the view, such as Grid, Calendar, or Kanban. Should never change because
view types cannot be modified.

**`example`**

```js
console.log(myView.type);
// => 'kanban'
```

### url

• **url**:

_Defined in
[src/models/view.ts:146](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view.ts#L146)_

**`function`**

**`returns`** The URL for the view. You can visit this URL in the browser to be taken to the view in
the Airtable UI.

**`example`**

```js
console.log(myView.url);
// => 'https://airtable.com/tblxxxxxxxxxxxxxx/viwxxxxxxxxxxxxxx'
```

### selectMetadata

▸ **selectMetadata**():
_[ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult)_

_Defined in
[src/models/view.ts:220](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view.ts#L220)_

Select the field order and visible fields from the view. See {@ViewMetadataQueryResult} for more.

**`example`**

```js
async function loadMetadataForViewAsync(view) {
    const viewMetadata = view.selectMetadata();
    await viewMetadata.loadDataAsync();

    console.log('Visible fields:');
    console.log(viewMetadata.visibleFields.map(field => field.name));
    // => ['Field 1', 'Field 2', 'Field 3']

    console.log('All fields:');
    console.log(viewMetadata.allFields.map(field => field.name));
    // => ['Field 1', 'Field 2', 'Field 3', 'Hidden field 4']

    viewMetadata.unloadData();
}
```

**Returns:** _[ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult)_

a {@ViewMetadataQueryResult}

### selectRecords

▸ **selectRecords**(`opts`: RecordQueryResultOpts):
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

_Defined in
[src/models/view.ts:183](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view.ts#L183)_

Select records from the view. Returns a query result. See {@RecordQueryResult} for more.

**`example`**

```js
import {UI} from '@airtable/blocks';
import React from 'react';

function TodoList() {
    const base = UI.useBase();
    const table = base.getTableByName('Tasks');
    const view = table.getViewByName('Grid view');

    const queryResult = view.selectRecords();
    const records = UI.useRecords(queryResult);

    return (
        <ul>
            {records.map(record => (
                <li key={record.id}>{record.primaryCellValueAsString || 'Unnamed record'}</li>
            ))}
        </ul>
    );
}
```

**Parameters:**

| Name   | Type                  | Default |
| ------ | --------------------- | ------- |
| `opts` | RecordQueryResultOpts | {}      |

**Returns:**
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

A record query result.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L94)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: WatchableViewKey | ReadonlyArray‹WatchableViewKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableViewKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                    | Description                                    |
| ---------- | ------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableViewKey &#124; ReadonlyArray‹WatchableViewKey› | the keys to unwatch                            |
| `callback` | Object                                                  | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                               | -                                              |

**Returns:** _Array‹WatchableViewKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableViewKey | ReadonlyArray‹WatchableViewKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableViewKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                    | Description                               |
| ---------- | ------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableViewKey &#124; ReadonlyArray‹WatchableViewKey› | the keys to watch                         |
| `callback` | Object                                                  | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                               | -                                         |

**Returns:** _Array‹WatchableViewKey›_

the array of keys that were watched

---

### ViewMetadataQueryResult

• **ViewMetadataQueryResult**:

_Defined in
[src/models/view_metadata_query_result.ts:55](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view_metadata_query_result.ts#L55)_

Contains information about a view that isn't loaded by default e.g. field order and visible fields.

In a React component, you might want to use {@link useViewMetadata}.

**`example`**

```js
async function loadMetadataForViewAsync(view) {
    const viewMetadata = view.selectMetadata();
    await viewMetadata.loadDataAsync();

    console.log(viewMetadata.visibleField);
    // => [Field, Field, Field]

    console.log(viewMetadata.allFields);
    // => [Field, Field, Field, Field, Field]

    viewMetadata.unloadData();
}
```

### parentView

• **parentView**: _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/view_metadata_query_result.ts:89](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view_metadata_query_result.ts#L89)_

### allFields

• **allFields**:

_Defined in
[src/models/view_metadata_query_result.ts:187](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view_metadata_query_result.ts#L187)_

Returns every field in the table in the order they appear in this view. Watchable.

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

### visibleFields

• **visibleFields**:

_Defined in
[src/models/view_metadata_query_result.ts:198](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/view_metadata_query_result.ts#L198)_

Returns every field visible in this view. Watchable.

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

▸ **unwatch**(`keys`: WatchableViewMetadataKey | ReadonlyArray‹WatchableViewMetadataKey›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null): _Array‹WatchableViewMetadataKey›_

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

| Name       | Type                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| `keys`     | WatchableViewMetadataKey &#124; ReadonlyArray‹WatchableViewMetadataKey› |
| `callback` | FlowAnyFunction                                                         |
| `context?` | FlowAnyObject &#124; null                                               |

**Returns:** _Array‹WatchableViewMetadataKey›_

### watch

▸ **watch**(`keys`: WatchableViewMetadataKey | ReadonlyArray‹WatchableViewMetadataKey›, `callback`:
FlowAnyFunction, `context?`: FlowAnyObject | null): _Array‹WatchableViewMetadataKey›_

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

| Name       | Type                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| `keys`     | WatchableViewMetadataKey &#124; ReadonlyArray‹WatchableViewMetadataKey› |
| `callback` | FlowAnyFunction                                                         |
| `context?` | FlowAnyObject &#124; null                                               |

**Returns:** _Array‹WatchableViewMetadataKey›_

## Variables

### `Const` ViewTypes

• **ViewTypes**: _Object_ = Object.freeze({ /** _ @alias viewTypes.GRID _ @memberof viewTypes \*/
GRID: 'grid' as const, /** _ @alias viewTypes.FORM _ @memberof viewTypes _/ FORM: 'form' as const,
/\*\* _ @alias viewTypes.CALENDAR _ @memberof viewTypes _/ CALENDAR: 'calendar' as const, /** _
@alias viewTypes.GALLERY _ @memberof viewTypes \*/ GALLERY: 'gallery' as const, /** _ @alias
viewTypes.KANBAN _ @memberof viewTypes \*/ KANBAN: 'kanban' as const, })

_Defined in
[src/types/view.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/types/view.ts#L21)_

An enum of Airtable's view types

**`alias`** viewTypes

**`example`**

```js
import {viewTypes} from '@airtable/blocks/models';
const gridViews = myTable.views.filter(view => view.type === viewTypes.GRID);
```
