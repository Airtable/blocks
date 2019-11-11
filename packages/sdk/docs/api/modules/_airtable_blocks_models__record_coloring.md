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
[src/models/record_coloring.ts:37](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L37)_

### selectField

• **selectField**: _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/models/record_coloring.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L41)_

### type

• **type**: _"bySelectField"_

_Defined in
[src/models/record_coloring.ts:39](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L39)_

---

### ByViewRecordColorMode

• **ByViewRecordColorMode**:

_Defined in
[src/models/record_coloring.ts:45](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L45)_

### type

• **type**: _"byView"_

_Defined in
[src/models/record_coloring.ts:47](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L47)_

### view

• **view**: _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/record_coloring.ts:49](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L49)_

---

### NoRecordColorMode

• **NoRecordColorMode**:

_Defined in
[src/models/record_coloring.ts:31](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L31)_

### type

• **type**: _"none"_

_Defined in
[src/models/record_coloring.ts:33](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L33)_

## Type aliases

### RecordColorMode

Ƭ **RecordColorMode**:
_[NoRecordColorMode](_airtable_blocks_models__record_coloring.md#norecordcolormode) |
[BySelectFieldRecordColorMode](_airtable_blocks_models__record_coloring.md#byselectfieldrecordcolormode)
| [ByViewRecordColorMode](_airtable_blocks_models__record_coloring.md#byviewrecordcolormode)_

_Defined in
[src/models/record_coloring.ts:53](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L53)_

---

### RecordColorModeType

Ƭ **RecordColorModeType**: _"none" | "bySelectField" | "byView"_

_Defined in
[src/models/record_coloring.ts:28](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L28)_

## Object literals

### `Const` ModeTypes

### ▪ **ModeTypes**: _object_

_Defined in
[src/models/record_coloring.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L12)_

An enum of the different types of {@link recordColoring.modes}

**Alias:** recordColoring.ModeTypes

### BY_SELECT_FIELD

• **BY_SELECT_FIELD**: _"bySelectField"_ = 'bySelectField' as const

_Defined in
[src/models/record_coloring.ts:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L20)_

**Alias:** recordColoring.ModeTypes.BY_SELECT_FIELD

### BY_VIEW

• **BY_VIEW**: _"byView"_ = 'byView' as const

_Defined in
[src/models/record_coloring.ts:24](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L24)_

**Alias:** recordColoring.ModeTypes.BY_VIEW

### NONE

• **NONE**: _"none"_ = 'none' as const

_Defined in
[src/models/record_coloring.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L16)_

**Alias:** recordColoring.ModeTypes.NONE

---

### `Const` modes

### ▪ **modes**: _object_

_Defined in
[src/models/record_coloring.ts:77](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L77)_

Record coloring config creators.

**Alias:** recordColoring.modes

**Example:**

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
[src/models/record_coloring.ts:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L92)_

**Alias:** recordColoring.modes.bySelectField

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
[src/models/record_coloring.ts:103](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L103)_

**Alias:** recordColoring.modes.byView

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
[src/models/record_coloring.ts:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/record_coloring.ts#L82)_

**Alias:** recordColoring.modes.none

**Returns:** _[NoRecordColorMode](_airtable_blocks_models__record_coloring.md#norecordcolormode)_

a record coloring mode
