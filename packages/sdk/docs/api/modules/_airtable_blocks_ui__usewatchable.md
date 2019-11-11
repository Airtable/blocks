[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useWatchable](_airtable_blocks_ui__usewatchable.md)

# External module: @airtable/blocks/ui: useWatchable

## Index

### Functions

-   [useWatchable](_airtable_blocks_ui__usewatchable.md#usewatchable)

## Functions

### useWatchable

▸ **useWatchable**<**Keys**>(`models`:
[Watchable](_airtable_blocks_models__abstract_models.md#watchable)‹Keys› |
ReadonlyArray‹[Watchable](_airtable_blocks_models__abstract_models.md#watchable)‹Keys› | null |
undefined› | null | undefined, `keys`: ReadonlyArray‹Keys | null | undefined›, `callback?`:
undefined | function): _void_

_Defined in
[src/ui/use_watchable.ts:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_watchable.ts#L50)_

A React hook for watching data in Airtable models like
[Table](_airtable_blocks_models__table.md#table) and
[Record](_airtable_blocks_models__record.md#record). Each model has several watchable keys that can
be used with this hook to have your component automatically re-render when data in the models
changes. You can also provide an optional callback if you need to do anything other than re-render
when the data changes.

This is a low-level tool that you should only use when you specifically need it. There are more
convenient model-specific hooks available:

-   For [Base](_airtable_blocks_models__base.md#base),
    [Table](_airtable_blocks_models__table.md#table), [View](_airtable_blocks_models__view.md#view),
    or [Field](_airtable_blocks_models__field.md#field), use
    [useBase](_airtable_blocks_ui__usebase.md#usebase).
-   For [RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) or
    [Record](_airtable_blocks_models__record.md#record), use {@link useRecords}, {@link
    useRecordIds}, or [useRecordById](_airtable_blocks_ui__userecords.md#userecordbyid).
-   For [Viewport](_airtable_blocks__viewport.md#viewport), use
    [useViewport](_airtable_blocks_ui__useviewport.md#useviewport).

If you're writing a class component and still want to be able to use hooks, try
[withHooks](_airtable_blocks_ui__withhooks.md#withhooks).

**Example:**

```js
import {useWatchable} from '@airtable/blocks/ui';

function TableName({table}) {
    useWatchable(table, ['name']);
    return <span>The table name is {table.name}</span>;
}
```

**Example:**

```js
import {useWatchable} from '@airtable/blocks/ui';

function ActiveView({cursor}) {
    useWatchable(cursor, ['activeViewId'], () => {
        alert('active view changed!!!');
    });

    return <span>Active view id: {cursor.activeViewId}</span>;
}
```

**Type parameters:**

▪ **Keys**: _string_

**Parameters:**

| Name        | Type                                                                                                                                                                                                                              | Description                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `models`    | [Watchable](_airtable_blocks_models__abstract_models.md#watchable)‹Keys› &#124; ReadonlyArray‹[Watchable](_airtable_blocks_models__abstract_models.md#watchable)‹Keys› &#124; null &#124; undefined› &#124; null &#124; undefined | The model or models to watch.                                   |
| `keys`      | ReadonlyArray‹Keys &#124; null &#124; undefined›                                                                                                                                                                                  | The keys to watch.                                              |
| `callback?` | undefined &#124; function                                                                                                                                                                                                         | An optional callback to call when any of the watch keys change. |

**Returns:** _void_
