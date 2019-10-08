[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: CellRenderer](_airtable_blocks_ui__cellrenderer.md)

# External module: @airtable/blocks/ui: CellRenderer

## Index

### Classes

-   [CellRenderer](_airtable_blocks_ui__cellrenderer.md#cellrenderer)

### Type aliases

-   [CellRendererProps](_airtable_blocks_ui__cellrenderer.md#cellrendererprops)

## Classes

### CellRenderer

• **CellRenderer**:

_Defined in
[src/ui/cell_renderer.tsx:134](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/cell_renderer.tsx#L134)_

Displays the contents of a cell.

**`example`**

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

## Type aliases

### CellRendererProps

Ƭ **CellRendererProps**: _object & TooltipAnchorProps & object & object & object & object & object &
object & object & object & object & object & object & object & object & object & object & object &
object & object_

_Defined in
[src/ui/cell_renderer.tsx:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/cell_renderer.tsx#L90)_

**`typedef`** {object} CellRendererProps

**`property`** {Record} [record] The [Record](_airtable_blocks_models__record.md#record) from which
to render a cell. Either `record` or `cellValue` must be provided to the CellRenderer. If both are
provided, `record` will be used.

**`property`** {string|number|object|Array.<object>} [cellValue] The cell value to render. Either
`record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be
used.

**`property`** {Field} field The [Field](_airtable_blocks_models__field.md#field) for a given
[Record](_airtable_blocks_models__record.md#record) being rendered as a cell.

**`property`** {boolean} [shouldWrap] Whether to wrap cell contents. Defaults to true.

**`property`** {string} [className] Additional class names to apply to the cell renderer container,
separated by spaces.

**`property`** {object} [style] Additional styles to apply to the cell renderer container.

**`property`** {string} [cellClassName] Additional class names to apply to the cell itself,
separated by spaces.

**`property`** {object} [cellStyle] Additional styles to apply to the cell itself.
