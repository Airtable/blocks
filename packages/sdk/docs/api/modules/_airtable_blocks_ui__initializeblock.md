[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: initializeBlock](_airtable_blocks_ui__initializeblock.md)

# External module: @airtable/blocks/ui: initializeBlock

## Index

### Functions

-   [initializeBlock](_airtable_blocks_ui__initializeblock.md#initializeblock)

## Functions

### initializeBlock

▸ **initializeBlock**(`getEntryElement`: Object): _void_

_Defined in
[src/ui/initialize_block.tsx:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/initialize_block.tsx#L29)_

`initializeBlock` takes the top-level React component in your tree and renders it. It is
conceptually similar to `ReactDOM.render`, but takes care of some Blocks-specific things.

**Example:**

```js
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';

function App() {
    return <div>Hello world 🚀</div>;
}

initializeBlock(() => <App />);
```

**Parameters:**

| Name              | Type   | Description                              |
| ----------------- | ------ | ---------------------------------------- |
| `getEntryElement` | Object | A function that returns your React Node. |

**Returns:** _void_
