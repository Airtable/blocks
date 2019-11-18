[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useGlobalConfig](_airtable_blocks_ui__useglobalconfig.md)

# External module: @airtable/blocks/ui: useGlobalConfig

## Index

### Functions

-   [useGlobalConfig](_airtable_blocks_ui__useglobalconfig.md#useglobalconfig)

## Functions

### useGlobalConfig

▸ **useGlobalConfig**(): _[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig)_

_Defined in
[src/ui/use_global_config.ts:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/use_global_config.ts#L33)_

Returns the [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) and updates whenever any
key in [GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig) changes.

**Example:**

```js
import {useGlobalConfig} from '@airtable/blocks/ui';

function SyncedCounter() {
    const globalConfig = useGlobalConfig();
    const count = globalConfig.get('count');

    const increment = () => globalConfig.setAsync('count', count + 1);
    const decrement = () => globalConfig.setAsync('count', count - 1);
    const isEnabled = globalConfig.hasPermissionToSet('count');

    return (
        <React.Fragment>
            <button onClick={decrement} disabled={!isEnabled}>
                -
            </button>
            {count}
            <button onClick={increment} disabled={!isEnabled}>
                +
            </button>
        </React.Fragment>
    );
}
```

**Returns:** _[GlobalConfig](_airtable_blocks__globalconfig.md#globalconfig)_

The block's global config.
