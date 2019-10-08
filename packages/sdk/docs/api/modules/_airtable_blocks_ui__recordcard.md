[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: RecordCard](_airtable_blocks_ui__recordcard.md)

# External module: @airtable/blocks/ui: RecordCard

## Index

### Classes

-   [RecordCard](_airtable_blocks_ui__recordcard.md#recordcard)

### Type aliases

-   [RecordCardProps](_airtable_blocks_ui__recordcard.md#recordcardprops)

## Classes

### RecordCard

• **RecordCard**:

_Defined in
[src/ui/record_card.tsx:218](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/record_card.tsx#L218)_

## Type aliases

### RecordCardProps

Ƭ **RecordCardProps**: _object & TooltipAnchorProps & object & object & object & object & object &
object & object & object & object & object & object & object & object & object_

_Defined in
[src/ui/record_card.tsx:137](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/record_card.tsx#L137)_

**`typedef`** {object} RecordCardProps

**`property`** {Record} record Record to display in the card.

**`property`** {Array.<Field>} [fields] Fields to display in the card. The primary field is always
displayed.

**`property`** {View} [view] The view model to use for field order and record coloring.

**`property`** {Field} [attachmentCoverField] Attachment field to display as an image in the square
preview for the card. If omitted or not an attachment field, it uses for the first attachment field
in `fields`. If `fields` is not defined, it uses the first attachment field in the view.

**`property`** {number} [width] Width of the record card.

**`property`** {number} [height] Height of the record card.

**`property`** {object} [expandRecordOptions] Options object for expanding a record.

**`property`** {Array.<Record>} [expandRecordOptions.records] List of all records, used for cycling
through records in the same expanded record window.

**`property`** {Function} [onClick] Click event handler for the record card. If undefined, uses
default behavior to expand record. If null, no operation is performed.

**`property`** {Function} [onMouseEnter] Mouse enter event handler for the record card.

**`property`** {Function} [onMouseLeave] Mouse leave event handler for the record card.

**`property`** {string} [className] Additional class names to apply to the record card.

**`property`** {object} [style] Additional styles to apply to the record card.
