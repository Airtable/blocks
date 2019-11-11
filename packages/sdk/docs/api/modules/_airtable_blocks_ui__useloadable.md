[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useLoadable](_airtable_blocks_ui__useloadable.md)

# External module: @airtable/blocks/ui: useLoadable

## Index

### Interfaces

-   [LoadableModel](_airtable_blocks_ui__useloadable.md#loadablemodel)
-   [UseLoadableOpts](_airtable_blocks_ui__useloadable.md#useloadableopts)

### Functions

-   [useLoadable](_airtable_blocks_ui__useloadable.md#useloadable)

## Interfaces

### LoadableModel

• **LoadableModel**:

_Defined in
[src/ui/use_loadable.ts:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_loadable.ts#L14)_

A model that can be loaded. Usually a [Cursor](_airtable_blocks_models__cursor.md#cursor),
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult), or a
[ViewMetadataQueryResult](_airtable_blocks_models__view.md#viewmetadataqueryresult).

---

### UseLoadableOpts

• **UseLoadableOpts**:

_Defined in
[src/ui/use_loadable.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_loadable.ts#L32)_

Options object for the [useLoadable](_airtable_blocks_ui__useloadable.md#useloadable) hook.

### `Optional` shouldSuspend

• **shouldSuspend**? : _undefined | false | true_

_Defined in
[src/ui/use_loadable.ts:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_loadable.ts#L34)_

Whether suspense mode is enabled. If suspense is disabled, you need to manually check
`model.isDataLoaded` so you don't use your model before it's ready.

## Functions

### useLoadable

▸ **useLoadable**(`models`:
ReadonlyArray‹[LoadableModel](_airtable_blocks_ui__useloadable.md#loadablemodel) | null› |
[LoadableModel](_airtable_blocks_ui__useloadable.md#loadablemodel) | null, `opts`:
[UseLoadableOpts](_airtable_blocks_ui__useloadable.md#useloadableopts)): _void_

_Defined in
[src/ui/use_loadable.ts:110](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_loadable.ts#L110)_

When you're writing a block, not all of the data in your base is available to work with straight
away. We need to load it from Airtable first. This hook is a low-level tool for managing that. You
might not need to use it directly though - if you're working with a
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult), try {@link
useRecords}, {@link useRecordIds}, or
[useRecordById](_airtable_blocks_ui__userecords.md#userecordbyid) first.

When you need to use a loadable model, `useLoadable(theModel)` will make sure that the model is
loaded when your component mounts, and unloaded when your component unmounts. By default, you don't
need to worry about waiting for the data to load - the hook uses React Suspense to make sure the
rest of your component doesn't run until the data is loaded. Whilst the data is loading, the entire
block will show a loading indicator. If you want to change where that indicator shows or how it
looks, use [`<React.Suspense />`](https://reactjs.org/docs/react-api.html#reactsuspense) around the
component that uses the hook.

You can pass several models to `useLoadable` in an array - it will load all of them simultaneously.
We'll memoize this array using shallow equality, so there's no need to use `useMemo`.

If you need more control, you can pass `{shouldSuspend: false}` as a second argument to the hook. In
that case though, `useLoadable` will cause your component to re-render whenever the load-state of
any model you passed in changes, and you should check each model's `.isDataLoaded` property before
trying to use the data you loaded.

**Example:**

```js
import {cursor} from '@airtable/blocks';
import {useLoadable, useWatchable} from '@airtable/blocks/ui';

function SelectedRecordIds() {
    // load selected records
    useLoadable(cursor);

    // re-render whenever the list of selected records changes
    useWatchable(cursor, ['selectedRecordIds']);

    // render the list of selected record ids
    return <div>Selected records: {cursor.selectedRecordIds.join(', ')}</div>;
}
```

**Example:**

```js
import {useLoadable} from '@airtable/blocks/ui';

function LoadTwoQueryResults({queryResultA, queryResultB}) {
    // load the queryResults:
    useLoadable([queryResultA, queryResultB]);

    // now, we can use the data
    return <SomeFancyComponent />;
}
```

**Example:**

```js
import {useLoadable, useBase} from '@airtable/blocks/ui';

function LoadAllRecords() {
    const base = useBase();

    // get a query result for every table in the base:
    const queryResults = base.tables.map(table => table.selectRecords());

    // load them all:
    useLoadable(queryResults);

    // use the data:
    return <SomeFancyComponent queryResults={queryResults} />;
}
```

**Parameters:**

| Name     | Type                                                                                                                                                                                | Default               | Description                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------- |
| `models` | ReadonlyArray‹[LoadableModel](_airtable_blocks_ui__useloadable.md#loadablemodel) &#124; null› &#124; [LoadableModel](_airtable_blocks_ui__useloadable.md#loadablemodel) &#124; null | -                     | The models to load.                             |
| `opts`   | [UseLoadableOpts](_airtable_blocks_ui__useloadable.md#useloadableopts)                                                                                                              | {shouldSuspend: true} | Optional options to control how the hook works. |

**Returns:** _void_
