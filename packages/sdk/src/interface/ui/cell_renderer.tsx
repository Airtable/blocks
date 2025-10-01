import * as React from 'react';
import {CellRenderer as CellRendererSharedImpl} from '../../shared/ui/cell_renderer';
import {type InterfaceSdkMode} from '../../sdk_mode';

/**
 * Props for the {@link CellRenderer} component.
 *
 * @docsPath UI/components/CellRenderer
 * @noInheritDoc
 */
type CellRendererProps = React.ComponentProps<typeof CellRendererSharedImpl<InterfaceSdkMode>>;

/**
 * Displays the contents of a cell given a field and record.
 *
 * @component
 * @docsPath UI/components/CellRenderer
 */
export function CellRenderer(props: CellRendererProps) {
    return <CellRendererSharedImpl<InterfaceSdkMode> {...props} />;
}
