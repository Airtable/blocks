[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Record Coloring](_airtable_blocks_models__record_coloring.md)

# External module: @airtable/blocks/models: Record Coloring

## Index

### Variables

-   [ModeTypes](_airtable_blocks_models__record_coloring.md#const-modetypes)

### Object literals

-   [modes](_airtable_blocks_models__record_coloring.md#const-modes)

## Variables

### `Const` ModeTypes

• **ModeTypes**: _Object_ = Object.freeze({ /** _ @alias recordColoring.ModeTypes.NONE _ @memberof
recordColoring \*/ NONE: 'none' as const, /** _ @alias recordColoring.ModeTypes.BY_SELECT_FIELD _
@memberof recordColoring _/ BY_SELECT_FIELD: 'bySelectField' as const, /\*\* _ @alias
recordColoring.ModeTypes.BY_VIEW _ @memberof recordColoring _/ BY_VIEW: 'byView' as const, })

_Defined in
[src/models/record_coloring.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L19)_

An enum of the different types of {@link recordColoring.modes}

**`alias`** recordColoring.ModeTypes

**`memberof`** recordColoring

## Object literals

### `Const` modes

### ▪ **modes**: _object_

_Defined in
[src/models/record_coloring.ts:64](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L64)_

Record coloring config creators.

**`alias`** recordColoring.modes

**`memberof`** recordColoring

**`example`**

```js
import {recordColoring} from '@airtable/blocks/models';

// no record coloring:
const recordColorMode = recordColoring.modes.none();
// color by select field:
const recordColorMode = recordColoring.modes.bySelectField(someSelectField);
// color from view:
const recordColorMode = recordColoring.modes.byView(someView);

// with a query result:
const queryResult = table.selectRecords({recordColorMode});
```

### bySelectField

▸ **bySelectField**(`selectField`: [Field](_airtable_blocks_models__field.md#field)): _Object_

_Defined in
[src/models/record_coloring.ts:79](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L79)_

**Parameters:**

| Name          | Type                                             |
| ------------- | ------------------------------------------------ |
| `selectField` | [Field](_airtable_blocks_models__field.md#field) |

**Returns:** _Object_

a record coloring mode

### byView

▸ **byView**(`view`: [View](_airtable_blocks_models__view.md#view)): _Object_

_Defined in
[src/models/record_coloring.ts:89](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L89)_

**Parameters:**

| Name   | Type                                          |
| ------ | --------------------------------------------- |
| `view` | [View](_airtable_blocks_models__view.md#view) |

**Returns:** _Object_

a record coloring mode

### none

▸ **none**(): _Object_

_Defined in
[src/models/record_coloring.ts:70](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L70)_

**Returns:** _Object_

a record coloring mode
