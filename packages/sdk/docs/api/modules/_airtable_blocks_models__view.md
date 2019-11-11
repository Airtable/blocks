[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: View](_airtable_blocks_models__view.md)

# External module: @airtable/blocks/models: View

## Index

### Enumerations

-   [ViewTypes](_airtable_blocks_models__view.md#viewtypes)

### Classes

-   [View](_airtable_blocks_models__view.md#view)
-   [ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult)

### Type aliases

-   [ViewId](_airtable_blocks_models__view.md#viewid)
-   [ViewType](_airtable_blocks_models__view.md#viewtype)
-   [WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)
-   [WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)

## Enumerations

### ViewTypes

• **ViewTypes**:

_Defined in
[src/types/view.ts:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L22)_

An enum of Airtable's view types

**Alias:** viewTypes

**Example:**

```js
import {viewTypes} from '@airtable/blocks/models';
const gridViews = myTable.views.filter(view => view.type === viewTypes.GRID);
```

### CALENDAR

• **CALENDAR**: = "calendar"

_Defined in
[src/types/view.ts:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L28)_

### FORM

• **FORM**: = "form"

_Defined in
[src/types/view.ts:26](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L26)_

### GALLERY

• **GALLERY**: = "gallery"

_Defined in
[src/types/view.ts:30](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L30)_

### GRID

• **GRID**: = "grid"

_Defined in
[src/types/view.ts:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L24)_

### KANBAN

• **KANBAN**: = "kanban"

_Defined in
[src/types/view.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L32)_

## Classes

### View

• **View**:

_Defined in
[src/models/view.ts:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L28)_

A class that represents an Airtable view. Every [Table](_airtable_blocks_models__table.md#table) has
one or more views.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### name

• **name**:

_Defined in
[src/models/view.ts:89](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L89)_

The name of the view. Can be watched.

**Example:**

```js
console.log(myView.name);
// => 'Grid view'
```

### type

• **type**:

_Defined in
[src/models/view.ts:101](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L101)_

The type of the view, such as Grid, Calendar, or Kanban. Should never change because view types
cannot be modified.

**Example:**

```js
console.log(myView.type);
// => 'kanban'
```

### url

• **url**:

_Defined in
[src/models/view.ts:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L113)_

The URL for the view. You can visit this URL in the browser to be taken to the view in the Airtable
UI.

**Example:**

```js
console.log(myView.url);
// => 'https://airtable.com/tblxxxxxxxxxxxxxx/viwxxxxxxxxxxxxxx'
```

### selectMetadata

▸ **selectMetadata**():
_[ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult)_

_Defined in
[src/models/view.ts:187](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L187)_

Select the field order and visible fields from the view. See {@ViewMetadataQueryResult} for more.

**Example:**

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

▸ **selectRecords**(`opts`:
[RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts)):
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

_Defined in
[src/models/view.ts:150](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L150)_

Select records from the view. Returns a query result. See {@RecordQueryResult} for more.

**Example:**

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

| Name   | Type                                                                                         | Default | Description                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `opts` | [RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts) | {}      | Options for the query, such as sorts, fields, and record coloring. By default, records will be coloured according to the view. |

**Returns:**
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

A record query result.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: [WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey) |
ReadonlyArray‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)›, `callback`:
Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                                                                                                                              | Description                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `keys`     | [WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey) &#124; ReadonlyArray‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)› | the keys to unwatch                                         |
| `callback` | Object                                                                                                                                                            | the function passed to `.watch` for these keys              |
| `context?` | FlowAnyObject &#124; null                                                                                                                                         | the context that was passed to `.watch` for this `callback` |

**Returns:** _Array‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: [WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey) |
ReadonlyArray‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)›, `callback`:
Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                                                                                                                              | Description                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `keys`     | [WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey) &#124; ReadonlyArray‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)› | the keys to watch                             |
| `callback` | Object                                                                                                                                                            | a function to call when those keys change     |
| `context?` | FlowAnyObject &#124; null                                                                                                                                         | an optional context for `this` in `callback`. |

**Returns:** _Array‹[WatchableViewKey](_airtable_blocks_models__view.md#watchableviewkey)›_

the array of keys that were watched

---

### ViewMetadataQueryResult

• **ViewMetadataQueryResult**:

_Defined in
[src/models/view_metadata_query_result.ts:62](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view_metadata_query_result.ts#L62)_

Contains information about a view that isn't loaded by default e.g. field order and visible fields.

In a React component, you might want to use {@link useViewMetadata}.

**Example:**

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
[src/models/view_metadata_query_result.ts:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view_metadata_query_result.ts#L96)_

### allFields

• **allFields**:

_Defined in
[src/models/view_metadata_query_result.ts:161](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view_metadata_query_result.ts#L161)_

Returns every field in the table in the order they appear in this view. Watchable.

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDataLoaded

• **isDataLoaded**:

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[isDataLoaded](_airtable_blocks_models__abstract_models.md#isdataloaded)_

_Defined in
[src/models/abstract_model_with_async_data.ts:87](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model_with_async_data.ts#L87)_

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### visibleFields

• **visibleFields**:

_Defined in
[src/models/view_metadata_query_result.ts:172](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view_metadata_query_result.ts#L172)_

Returns every field visible in this view. Watchable.

### loadDataAsync

▸ **loadDataAsync**(): _Promise‹void›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[loadDataAsync](_airtable_blocks_models__abstract_models.md#loaddataasync)_

_Defined in
[src/models/abstract_model_with_async_data.ts:117](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model_with_async_data.ts#L117)_

Will cause all the async data to be fetched and retained. Every call to `loadDataAsync` should have
a matching call to `unloadData`.

Returns a Promise that will resolve once the data is loaded.

**Returns:** _Promise‹void›_

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unloadData

▸ **unloadData**(): _void_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unloadData](_airtable_blocks_models__abstract_models.md#unloaddata)_

_Defined in
[src/models/abstract_model_with_async_data.ts:151](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model_with_async_data.ts#L151)_

**Returns:** _void_

### unwatch

▸ **unwatch**(`keys`:
[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey) |
ReadonlyArray‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/models/abstract_model_with_async_data.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model_with_async_data.ts#L69)_

Unwatching a key that needs to load data asynchronously will automatically cause the data to be
released. Once the data is available, the callback will be called.

**Parameters:**

| Name       | Type                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | [WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey) &#124; ReadonlyArray‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)› |
| `callback` | FlowAnyFunction                                                                                                                                                                                   |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                         |

**Returns:**
_Array‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)›_

### watch

▸ **watch**(`keys`:
[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey) |
ReadonlyArray‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)›,
`callback`: FlowAnyFunction, `context?`: FlowAnyObject | null):
_Array‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)›_

_Inherited from
[AbstractModelWithAsyncData](_airtable_blocks_models__abstract_models.md#abstractmodelwithasyncdata).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Overrides
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/models/abstract_model_with_async_data.ts:44](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model_with_async_data.ts#L44)_

Watching a key that needs to load data asynchronously will automatically cause the data to be
fetched. Once the data is available, the callback will be called.

**Parameters:**

| Name       | Type                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | [WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey) &#124; ReadonlyArray‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)› |
| `callback` | FlowAnyFunction                                                                                                                                                                                   |
| `context?` | FlowAnyObject &#124; null                                                                                                                                                                         |

**Returns:**
_Array‹[WatchableViewMetadataKey](_airtable_blocks_models__view.md#watchableviewmetadatakey)›_

## Type aliases

### ViewId

Ƭ **ViewId**: _string_

_Defined in
[src/types/view.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L8)_

---

### ViewType

Ƭ **ViewType**: _[GRID](_airtable_blocks_models__view.md#grid) |
[FORM](_airtable_blocks_models__view.md#form) |
[CALENDAR](_airtable_blocks_models__view.md#calendar) |
[GALLERY](_airtable_blocks_models__view.md#gallery) |
[KANBAN](_airtable_blocks_models__view.md#kanban)_

_Defined in
[src/types/view.ts:36](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/view.ts#L36)_

---

### WatchableViewKey

Ƭ **WatchableViewKey**: _ObjectValues‹object›_

_Defined in
[src/models/view.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view.ts#L23)_

A key in [View](_airtable_blocks_models__view.md#view) that can be watched.

-   `name`

---

### WatchableViewMetadataKey

Ƭ **WatchableViewMetadataKey**: _"isDataLoaded" | "allFields" | "visibleFields"_

_Defined in
[src/models/view_metadata_query_result.ts:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/view_metadata_query_result.ts#L24)_

A key in [ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult) that
can be watched.

-   `allFields`
-   `visibleFields`
-   `isDataLoaded`
