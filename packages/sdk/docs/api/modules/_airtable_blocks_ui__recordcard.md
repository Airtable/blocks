[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: RecordCard](_airtable_blocks_ui__recordcard.md)

# External module: @airtable/blocks/ui: RecordCard

## Index

### Classes

-   [RecordCard](_airtable_blocks_ui__recordcard.md#recordcard)

### Interfaces

-   [RecordCardProps](_airtable_blocks_ui__recordcard.md#recordcardprops)
-   [RecordCardStyleProps](_airtable_blocks_ui__recordcard.md#recordcardstyleprops)

## Classes

### RecordCard

• **RecordCard**:

_Defined in
[src/ui/record_card.tsx:251](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L251)_

A card component that displays an Airtable record.

**Example:**

```js
import {RecordCard} from '@airtable/blocks/ui';
import React from 'react';

function Block() {
    const base = useBase();
    const table = base.getTableByName('Table 1');
    const fields = table ? table.fields : null;
    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    return <RecordCard record={records[0]} fields={fields} expandRecordOptions={{records}} />;
}
```

## Interfaces

### RecordCardProps

• **RecordCardProps**:

_Defined in
[src/ui/record_card.tsx:133](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L133)_

Props for the [RecordCard](_airtable_blocks_ui__recordcard.md#recordcard) component. Also accepts:

-   [RecordCardStyleProps](_airtable_blocks_ui__recordcard.md#recordcardstyleprops)

### `Optional` attachmentCoverField

• **attachmentCoverField**? : _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/ui/record_card.tsx:139](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L139)_

Attachment field to display as an image in the square preview for the card. If omitted or not an
attachment field, it uses for the first attachment field in `fields`. If `fields` is not defined, it
uses the first attachment field in the view.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/record_card.tsx:159](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L159)_

Additional class names to apply to the record card.

### `Optional` expandRecordOptions

• **expandRecordOptions**? :
_[ExpandRecordOpts](_airtable_blocks_ui__expandrecord.md#expandrecordopts) | null_

_Defined in
[src/ui/record_card.tsx:145](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L145)_

Options object for expanding a record.

### `Optional` fields

• **fields**? : _Array‹[Field](_airtable_blocks_models__field.md#field)›_

_Defined in
[src/ui/record_card.tsx:147](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L147)_

Fields to display in the card. The primary field is always displayed.

### `Optional` height

• **height**? : _undefined | number_

_Defined in
[src/ui/record_card.tsx:143](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L143)_

Height of the record card.

### `Optional` onClick

• **onClick**? : _function | null_

_Defined in
[src/ui/record_card.tsx:155](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L155)_

Click event handler for the record card. If undefined, uses default behavior to expand record. If
null, no operation is performed.

### `Optional` onMouseEnter

• **onMouseEnter**? : _function | null_

_Defined in
[src/ui/record_card.tsx:150](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L150)_

Mouse enter event handler for the record card.

### `Optional` onMouseLeave

• **onMouseLeave**? : _function | null_

_Defined in
[src/ui/record_card.tsx:152](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L152)_

Mouse leave event handler for the record card.

### record

• **record**: _[Record](_airtable_blocks_models__record.md#record) |
[RecordDef](_airtable_blocks_models__record.md#recorddef)_

_Defined in
[src/ui/record_card.tsx:135](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L135)_

Record to display in the card.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/record_card.tsx:161](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L161)_

Additional styles to apply to the record card.

### `Optional` view

• **view**? : _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/ui/record_card.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L137)_

The view model to use for field order and record coloring.

### `Optional` width

• **width**? : _undefined | number_

_Defined in
[src/ui/record_card.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L141)_

Width of the record card.

---

### RecordCardStyleProps

• **RecordCardStyleProps**:

_Defined in
[src/ui/record_card.tsx:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/record_card.tsx#L59)_

Style props for the [RecordCard](_airtable_blocks_ui__recordcard.md#recordcard) component. Accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
