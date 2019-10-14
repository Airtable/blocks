[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: RecordCardList](_airtable_blocks_ui__recordcardlist.md)

# External module: @airtable/blocks/ui: RecordCardList

## Index

### Classes

-   [RecordCardList](_airtable_blocks_ui__recordcardlist.md#recordcardlist)

### Interfaces

-   [RecordCardListProps](_airtable_blocks_ui__recordcardlist.md#recordcardlistprops)

## Classes

### RecordCardList

• **RecordCardList**:

_Defined in
[src/ui/record_card_list.tsx:276](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/record_card_list.tsx#L276)_

Scrollable list of record cards.

**`example`**

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
[src/ui/record_card_list.tsx:211](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/record_card_list.tsx#L211)_

**`typedef`** {object} RecordCardListProps

**`property`** {Array.<Record>} records Records to display in card list.

**`property`** {Function} [onScroll] Scroll event handler for the list window.

**`property`** {Function} [onRecordClick] Click event handler for an individual record card. If
undefined, uses default behavior to expand record. If null, no operation is performed.

**`property`** {Function} [onRecordMouseEnter] Mouse enter event handler for an individual record
card.

**`property`** {Function} [onRecordMouseLeave] Mouse leave event handler for an individual record
card.

**`property`** {Array.<Field>} [fields] Fields to display in each record card. The primary field is
always displayed.

**`property`** {View} [view] The view model to use for field order and record coloring.

**`property`** {Field} [attachmentCoverField] Attachment field to display as an image in the square
preview for each record card. If omitted or not an attachment field, it uses for the first
attachment field in `fields`. If `fields` is not defined, it uses the first attachment field in the
view.

**`property`** {string} [className] Additional class names to apply to the record card list.

**`property`** {object} [style] Additional styles to apply to the record card list.
