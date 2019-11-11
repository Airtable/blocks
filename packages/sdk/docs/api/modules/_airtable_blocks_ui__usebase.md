[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useBase](_airtable_blocks_ui__usebase.md)

# External module: @airtable/blocks/ui: useBase

## Index

### Functions

-   [useBase](_airtable_blocks_ui__usebase.md#usebase)

## Functions

### useBase

▸ **useBase**(): _[Base](_airtable_blocks_models__base.md#base)_

_Defined in
[src/ui/use_base.ts:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_base.ts#L34)_

A hook for connecting a React component to your base's schema. This returns a
[Base](_airtable_blocks_models__base.md#base) instance and will re-render your component whenever
the base's schema changes. That means any change to your base like tables being added or removed,
fields getting renamed, etc. It excludes any change to the actual records in the base.

`useBase` should meet most of your needs for working with base schema. If you need more granular
control of when your component updates or want to do anything other than re-render, the lower level
[useWatchable](_airtable_blocks_ui__usewatchable.md#usewatchable) hook might help.

**Example:**

```js
import {useBase} from '@airtable/blocks/ui';

// renders a list of tables and automatically updates
function TableList() {
    const base = useBase();

    const tables = base.tables.map(table => {
        return <li key={table.id}>{table.name}</li>;
    });

    return <ul>{tables}</ul>;
}
```

**Returns:** _[Base](_airtable_blocks_models__base.md#base)_

The current base.
