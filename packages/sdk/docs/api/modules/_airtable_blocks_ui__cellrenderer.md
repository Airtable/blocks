[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: CellRenderer](_airtable_blocks_ui__cellrenderer.md)

# External module: @airtable/blocks/ui: CellRenderer

## Index

### Classes

-   [CellRenderer](_airtable_blocks_ui__cellrenderer.md#cellrenderer)

### Interfaces

-   [CellRendererProps](_airtable_blocks_ui__cellrenderer.md#cellrendererprops)
-   [CellRendererStyleProps](_airtable_blocks_ui__cellrenderer.md#cellrendererstyleprops)

## Classes

### CellRenderer

• **CellRenderer**:

_Defined in
[src/ui/cell_renderer.tsx:131](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L131)_

Displays the contents of a cell.

**Example:**

```js
import React, {useState} from 'react';
import {Box, CellRenderer, FieldPicker, useBase, useRecords} from '@airtable/blocks/ui';

export default function CellRendererExample(props) {
    const [field, setField] = useState(null);
    const base = useBase();
    const table = base.tables[0];
    const queryResult = table.selectRecords();
    const records = useRecords(queryResult);
    return (
        <Box display="flex" flexDirection="column">
            <FieldPicker table={table} field={field} onChange={setField} />
            {field && (
                <CellRenderer
                    className="user-defined-class"
                    field={field}
                    record={records[0]}
                    margin={3}
                />
            )}
        </Box>
    );
}
```

## Interfaces

### CellRendererProps

• **CellRendererProps**:

_Defined in
[src/ui/cell_renderer.tsx:80](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L80)_

Props for the [CellRenderer](_airtable_blocks_ui__cellrenderer.md#cellrenderer) component. Also
accepts:

-   [CellRendererStyleProps](_airtable_blocks_ui__cellrenderer.md#cellrendererstyleprops)

### `Optional` cellClassName

• **cellClassName**? : _undefined | string_

_Defined in
[src/ui/cell_renderer.tsx:96](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L96)_

Additional class names to apply to the cell itself, separated by spaces.

### `Optional` cellStyle

• **cellStyle**? : _React.CSSProperties_

_Defined in
[src/ui/cell_renderer.tsx:98](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L98)_

Additional styles to apply to the cell itself.

### `Optional` cellValue

• **cellValue**? : _unknown_

_Defined in
[src/ui/cell_renderer.tsx:84](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L84)_

The cell value to render. Either `record` or `cellValue` must be provided to the CellRenderer. If
both are provided, `record` will be used.

### `Optional` className

• **className**? : _undefined | string_

_Defined in
[src/ui/cell_renderer.tsx:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L90)_

Additional class names to apply to the cell renderer container, separated by spaces.

### field

• **field**: _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/ui/cell_renderer.tsx:86](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L86)_

The [Field](_airtable_blocks_models__field.md#field) for a given
[Record](_airtable_blocks_models__record.md#record) being rendered as a cell.

### `Optional` record

• **record**? : _[Record](_airtable_blocks_models__record.md#record) | null | undefined_

_Defined in
[src/ui/cell_renderer.tsx:82](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L82)_

The [Record](_airtable_blocks_models__record.md#record) from which to render a cell. Either `record`
or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used.

### `Optional` shouldWrap

• **shouldWrap**? : _undefined | false | true_

_Defined in
[src/ui/cell_renderer.tsx:88](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L88)_

Whether to wrap cell contents. Defaults to true.

### `Optional` style

• **style**? : _React.CSSProperties_

_Defined in
[src/ui/cell_renderer.tsx:92](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L92)_

Additional styles to apply to the cell renderer container.

---

### CellRendererStyleProps

• **CellRendererStyleProps**:

_Defined in
[src/ui/cell_renderer.tsx:50](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L50)_

Style props for the [CellRenderer](_airtable_blocks_ui__cellrenderer.md#cellrenderer) component.
Also accepts:

-   [FlexItemSetProps](_airtable_blocks_ui_system__flex_item.md#flexitemsetprops)
-   [MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops)
-   [MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops)
-   [MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops)
-   [PositionSetProps](_airtable_blocks_ui_system__position.md#positionsetprops)
-   [WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops)

### `Optional` display

• **display**? :
_[OptionalResponsiveProp](_airtable_blocks_ui_system__responsive_props.md#optionalresponsiveprop)‹"block"
| "inline" | "inline-block"›_

_Defined in
[src/ui/cell_renderer.tsx:58](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/cell_renderer.tsx#L58)_

Defines the display type of an element, which consists of the two basic qualities of how an element
generates boxes — the outer display type defining how the box participates in flow layout, and the
inner display type defining how the children of the box are laid out.
