import * as React from 'react';
import {CellRenderer as CellRendererSharedImpl} from '../../shared/ui/cell_renderer';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {type Record} from '../models/record';
import {type Field} from '../models/field';

/**
 * Props for the {@link CellRenderer} component.
 *
 * @docsPath UI/components/CellRenderer
 * @noInheritDoc
 */
interface CellRendererProps {
    /** The {@link Record} from which to render a cell. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used. */
    record?: Record | null | undefined;
    /** The cell value to render. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used. */
    cellValue?: unknown;
    /** The {@link Field} for a given {@link Record} being rendered as a cell. */
    field: Field;
    /** Whether to wrap cell contents. Defaults to true. */
    shouldWrap?: boolean;
    /** Additional class names to apply to the cell renderer container, separated by spaces. */
    className?: string;
    /** Additional styles to apply to the cell renderer container. */
    style?: React.CSSProperties;
    /** Additional class names to apply to the cell itself, separated by spaces. */
    cellClassName?: string;
    /** Additional styles to apply to the cell itself. */
    cellStyle?: React.CSSProperties;
    /** Render function if provided and validation fails. */
    renderInvalidCellValue?: (cellValue: unknown, field: Field) => React.ReactElement;
}

/**
 * Displays the contents of a cell given a field and record.
 *
 * @component
 * @docsPath UI/components/CellRenderer
 */
export function CellRenderer(props: CellRendererProps) {
    return <CellRendererSharedImpl<InterfaceSdkMode> {...props} />;
}
