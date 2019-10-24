[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Record Coloring](_airtable_blocks_models__record_coloring.md)

# External module: @airtable/blocks/models: Record Coloring

## Index

### Interfaces

-   [BySelectFieldRecordColorMode](_airtable_blocks_models__record_coloring.md#byselectfieldrecordcolormode)
-   [ByViewRecordColorMode](_airtable_blocks_models__record_coloring.md#byviewrecordcolormode)
-   [NoRecordColorMode](_airtable_blocks_models__record_coloring.md#norecordcolormode)

### Type aliases

-   [RecordColorMode](_airtable_blocks_models__record_coloring.md#recordcolormode)
-   [RecordColorModeType](_airtable_blocks_models__record_coloring.md#recordcolormodetype)

### Object literals

-   [ModeTypes](_airtable_blocks_models__record_coloring.md#const-modetypes)
-   [modes](_airtable_blocks_models__record_coloring.md#const-modes)

## Interfaces

### BySelectFieldRecordColorMode

• **BySelectFieldRecordColorMode**:

_Defined in
[src/models/record_coloring.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L41)_

### selectField

• **selectField**: _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/models/record_coloring.ts:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L45)_

### type

• **type**: _"bySelectField"_

_Defined in
[src/models/record_coloring.ts:43](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L43)_

---

### ByViewRecordColorMode

• **ByViewRecordColorMode**:

_Defined in
[src/models/record_coloring.ts:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L49)_

### type

• **type**: _"byView"_

_Defined in
[src/models/record_coloring.ts:51](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L51)_

### view

• **view**: _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/record_coloring.ts:53](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L53)_

---

### NoRecordColorMode

• **NoRecordColorMode**:

_Defined in
[src/models/record_coloring.ts:35](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L35)_

### type

• **type**: _"none"_

_Defined in
[src/models/record_coloring.ts:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L37)_

## Type aliases

### RecordColorMode

Ƭ **RecordColorMode**:
_[NoRecordColorMode](_airtable_blocks_models__record_coloring.md#norecordcolormode) |
[BySelectFieldRecordColorMode](_airtable_blocks_models__record_coloring.md#byselectfieldrecordcolormode)
| [ByViewRecordColorMode](_airtable_blocks_models__record_coloring.md#byviewrecordcolormode)_

_Defined in
[src/models/record_coloring.ts:57](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L57)_

---

### RecordColorModeType

Ƭ **RecordColorModeType**: _ObjectValues‹object›_

_Defined in
[src/models/record_coloring.ts:32](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L32)_

## Object literals

### `Const` ModeTypes

### ▪ **ModeTypes**: _object_

_Defined in
[src/models/record_coloring.ts:13](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L13)_

An enum of the different types of {@link recordColoring.modes}

**`alias`** recordColoring.ModeTypes

**`memberof`** recordColoring

### BY_SELECT_FIELD

• **BY_SELECT_FIELD**: _"bySelectField"_ = 'bySelectField' as const

_Defined in
[src/models/record_coloring.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L23)_

**`alias`** recordColoring.ModeTypes.BY_SELECT_FIELD

**`memberof`** recordColoring

### BY_VIEW

• **BY_VIEW**: _"byView"_ = 'byView' as const

_Defined in
[src/models/record_coloring.ts:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L28)_

**`alias`** recordColoring.ModeTypes.BY_VIEW

**`memberof`** recordColoring

### NONE

• **NONE**: _"none"_ = 'none' as const

_Defined in
[src/models/record_coloring.ts:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L18)_

**`alias`** recordColoring.ModeTypes.NONE

**`memberof`** recordColoring

---

### `Const` modes

### ▪ **modes**: _object_

_Defined in
[src/models/record_coloring.ts:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L82)_

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

▸ **bySelectField**(`selectField`: [Field](_airtable_blocks_models__field.md#field)):
_[BySelectFieldRecordColorMode](_airtable_blocks_models__record_coloring.md#byselectfieldrecordcolormode)_

_Defined in
[src/models/record_coloring.ts:99](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L99)_

**`alias`** recordColoring.modes.bySelectField

**`memberof`** recordColoring

**Parameters:**

| Name          | Type                                             |
| ------------- | ------------------------------------------------ |
| `selectField` | [Field](_airtable_blocks_models__field.md#field) |

**Returns:**
_[BySelectFieldRecordColorMode](_airtable_blocks_models__record_coloring.md#byselectfieldrecordcolormode)_

a record coloring mode

### byView

▸ **byView**(`view`: [View](_airtable_blocks_models__view.md#view)):
_[ByViewRecordColorMode](_airtable_blocks_models__record_coloring.md#byviewrecordcolormode)_

_Defined in
[src/models/record_coloring.ts:111](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L111)_

**`alias`** recordColoring.modes.byView

**`memberof`** recordColoring

**Parameters:**

| Name   | Type                                          |
| ------ | --------------------------------------------- |
| `view` | [View](_airtable_blocks_models__view.md#view) |

**Returns:**
_[ByViewRecordColorMode](_airtable_blocks_models__record_coloring.md#byviewrecordcolormode)_

a record coloring mode

### none

▸ **none**(): _[NoRecordColorMode](_airtable_blocks_models__record_coloring.md#norecordcolormode)_

_Defined in
[src/models/record_coloring.ts:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/record_coloring.ts#L88)_

**`alias`** recordColoring.modes.none

**`memberof`** recordColoring

**Returns:** _[NoRecordColorMode](_airtable_blocks_models__record_coloring.md#norecordcolormode)_

a record coloring mode
