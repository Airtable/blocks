[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: RecordCardList](_airtable_blocks_ui__recordcardlist.md)

# External module: @airtable/blocks/ui: RecordCardList

## Index

### Classes

-   [RecordCardList](_airtable_blocks_ui__recordcardlist.md#recordcardlist)

### Interfaces

-   [RecordCardListProps](_airtable_blocks_ui__recordcardlist.md#recordcardlistprops)
-   [RecordCardListScrollEvent](_airtable_blocks_ui__recordcardlist.md#recordcardlistscrollevent)
-   [RecordCardListStyleProps](_airtable_blocks_ui__recordcardlist.md#recordcardliststyleprops)

## Classes

### RecordCardList

• **RecordCardList**:

_Defined in
[src/ui/record_card_list.tsx:301](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L301)_

Scrollable list of record cards.

**Example:**

```js
import {RecordCardList} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function Block() {
    const base = useBase();
    const [selectedRecord, setSelectedRecord] = useState(null);
    const table = base.getTableByName('Table 1');
    const view = table ? table.getViewByName('View 1') : null;
    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    return (
        <RecordCardList
            records={records}
            view={view}
            onRecordClick={record => {
                setSelectedRecord(record);
            }}
        />
    );
}
```

## Interfaces

### RecordCardListProps

• **RecordCardListProps**:

_Defined in
[src/ui/record_card_list.tsx:216](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L216)_

Props for the [RecordCardList](_airtable_blocks_ui__recordcardlist.md#recordcardlist) component.
Also accepts:

-   [RecordCardListStyleProps](_airtable_blocks_ui__recordcardlist.md#recordcardliststyleprops)

### `Optional` attachmentCoverField

• **attachmentCoverField**? : _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/ui/record_card_list.tsx:232](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L232)_

Attachment field to display as an image in the square preview for each record card. If omitted or
not an attachment field, it uses for the first attachment field in `fields`. If `fields` is not
defined, it uses the first attachment field in the view.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/record_card_list.tsx:234](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L234)_

Additional class names to apply to the record card list.

### `Optional` fields

• **fields**? : _Array‹[Field](_airtable_blocks_models__field.md#field)›_

_Defined in
[src/ui/record_card_list.tsx:228](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L228)_

Fields to display in each record card. The primary field is always displayed.

### `Optional` onRecordClick

• **onRecordClick**? : _null | function_

_Defined in
[src/ui/record_card_list.tsx:222](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L222)_

Click event handler for an individual record card. If undefined, uses default behavior to expand
record. If null, no operation is performed.

### `Optional` onRecordMouseEnter

• **onRecordMouseEnter**? : _undefined | function_

_Defined in
[src/ui/record_card_list.tsx:224](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L224)_

Mouse enter event handler for an individual record card.

### `Optional` onRecordMouseLeave

• **onRecordMouseLeave**? : _undefined | function_

_Defined in
[src/ui/record_card_list.tsx:226](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L226)_

Mouse leave event handler for an individual record card.

### `Optional` onScroll

• **onScroll**? : _undefined | function_

_Defined in
[src/ui/record_card_list.tsx:220](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L220)_

Scroll event handler for the list window.

### records

• **records**: _Array‹[Record](_airtable_blocks_models__record.md#record)› |
Array‹[RecordDef](_airtable_blocks_models__record.md#recorddef)›_

_Defined in
[src/ui/record_card_list.tsx:218](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L218)_

Records to display in card list.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/record_card_list.tsx:236](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L236)_

Additional styles to apply to the record card list.

### `Optional` view

• **view**? : _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/ui/record_card_list.tsx:230](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L230)_

The view model to use for field order and record coloring.

---

### RecordCardListScrollEvent

• **RecordCardListScrollEvent**:

_Defined in
[src/ui/record_card_list.tsx:201](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L201)_

Scroll event for [RecordCardList](_airtable_blocks_ui__recordcardlist.md#recordcardlist).

### scrollDirection

• **scrollDirection**: _"forward" | "backward"_

_Defined in
[src/ui/record_card_list.tsx:203](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L203)_

The direction of the scroll event.

### scrollOffset

• **scrollOffset**: _number_

_Defined in
[src/ui/record_card_list.tsx:205](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L205)_

The vertical offset of the scrollable area.

### scrollUpdateWasRequested

• **scrollUpdateWasRequested**: _boolean_

_Defined in
[src/ui/record_card_list.tsx:207](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L207)_

`true` for programmatic scrolling and `false` if the scroll was the result of a user interaction in
the browser.

---

### RecordCardListStyleProps

• **RecordCardListStyleProps**:

_Defined in
[src/ui/record_card_list.tsx:248](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/record_card_list.tsx#L248)_

Style props for the [RecordCardList](_airtable_blocks_ui__recordcardlist.md#recordcardlist)
component. Accepts:

-   [DimensionsSetProps](_airtable_blocks_ui_system__dimensions.md#dimensionssetprops)
-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
