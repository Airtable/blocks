/** @module @airtable/blocks/ui: TablePicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';
import Table from '../models/table';
import {sharedSelectBasePropTypes, SharedSelectBaseProps} from './select';
import ModelPickerSelect from './model_picker_select';
import useWatchable from './use_watchable';

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
 */
interface TablePickerProps extends SharedTablePickerProps {
    /** The selected table model. */
    table?: Table | null;
}

/**
 * Dropdown menu component for selecting tables.
 *
 * @example
 * ```js
 * import {TablePicker, useBase, useRecords} from '@airtable/blocks/ui';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     useBase();
 *     const [table, setTable] = useState(null);
 *     const queryResult = table ? table.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *
 *     const summaryText = table ? `${table.name} has ${records.length} record(s).` : 'No table selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePicker
 *                     table={table}
 *                     onChange={newTable => setTable(newTable)}
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *         </Fragment>
 *     );
 * }
 * ```
 */
function TablePicker(props: TablePickerProps, ref: React.Ref<HTMLSelectElement>) {
    const {table, shouldAllowPickingNone, placeholder, onChange, ...restOfProps} = props;
    const selectedTable = table && !table.isDeleted ? table : null;
    useWatchable(getSdk().base, ['tables']);

    function _onChange(tableId: string | null) {
        if (onChange) {
            const newTable = tableId ? getSdk().base.getTableByIdIfExists(tableId) : null;
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
            models={getSdk().base.tables}
            selectedModelId={selectedTable ? selectedTable.id : null}
            modelKeysToWatch={['name']}
            shouldAllowPickingNone={shouldAllowPickingNone}
            placeholder={placeholderToUse}
            onChange={_onChange}
        />
    );
}

const ForwardedRefTablePicker = React.forwardRef<HTMLSelectElement, TablePickerProps>(TablePicker);

ForwardedRefTablePicker.displayName = 'TablePicker';

ForwardedRefTablePicker.propTypes = {
    table: PropTypes.instanceOf(Table),
    ...sharedTablePickerPropTypes,
};

export default ForwardedRefTablePicker;
