/** @module @airtable/blocks/ui: TablePicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import Table from '../models/table';
import {sharedSelectBasePropTypes, SharedSelectBaseProps} from './select';
import ModelPickerSelect from './model_picker_select';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/**
 * Props shared between the {@link TablePicker} and {@link TablePickerSynced} components.
 */
export interface SharedTablePickerProps extends SharedSelectBaseProps {
    /** If set to `true`, the user can unset the selected table. */
    shouldAllowPickingNone?: boolean;
    /** The placeholder text when no table is selected. */
    placeholder?: string;
    /** A function to be called when the selected table changes. */
    onChange?: (tableModel: Table | null) => void;
}

export const sharedTablePickerPropTypes = {
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * Props for the {@link TablePicker} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/TablePicker
 */
interface TablePickerProps extends SharedTablePickerProps {
    /** The selected table model. */
    table?: Table | null;
}

/**
 * Dropdown menu component for selecting tables.
 *
 * [[ Story id="modelpickers--tablepicker-example" title="Table picker example" ]]
 *
 * @docsPath UI/components/TablePicker
 * @component
 */
const TablePicker = (props: TablePickerProps, ref: React.Ref<HTMLSelectElement>) => {
    const {table, shouldAllowPickingNone, placeholder, onChange, ...restOfProps} = props;
    const selectedTable = table && !table.isDeleted ? table : null;
    const sdk = useSdk();
    useWatchable(sdk.base, ['tables']);

    function _onChange(tableId: string | null) {
        if (onChange) {
            const newTable = tableId ? sdk.base.getTableByIdIfExists(tableId) : null;
            onChange(newTable);
        }
    }

    let placeholderToUse;
    if (placeholder === undefined) {
        placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a table...';
    } else {
        placeholderToUse = placeholder;
    }

    return (
        <ModelPickerSelect
            {...restOfProps}
            ref={ref}
            models={sdk.base.tables}
            selectedModelId={selectedTable ? selectedTable.id : null}
            modelKeysToWatch={['name']}
            shouldAllowPickingNone={shouldAllowPickingNone}
            placeholder={placeholderToUse}
            onChange={_onChange}
        />
    );
};

const ForwardedRefTablePicker = React.forwardRef<HTMLSelectElement, TablePickerProps>(TablePicker);

ForwardedRefTablePicker.displayName = 'TablePicker';

ForwardedRefTablePicker.propTypes = {
    table: PropTypes.instanceOf(Table),
    ...sharedTablePickerPropTypes,
};

export default ForwardedRefTablePicker;
