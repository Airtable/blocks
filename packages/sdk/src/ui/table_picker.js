// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import Table from '../models/table';
import ModelPickerSelect from './model_picker_select';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

/**
 * @typedef {object} TablePickerProps
 * @property {Table} [table] The selected table model.
 * @property {function} [onChange] A function to be called when the selected table changes.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the picker.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected table.
 * @property {string} [placeholder='Pick a table...'] The placeholder text when no table is selected.
 * @property {string} [id] The ID of the picker element.
 * @property {string} [className] Additional class names to apply to the picker.
 * @property {object} [style] Additional styles to apply to the picker.
 * @property {number | string} [tabIndex] Indicates if the picker can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type TablePickerProps = {
    table?: Table | null,
    shouldAllowPickingNone?: boolean,
    disabled?: boolean,
    onChange?: (tableModel: Table | null) => void,
    placeholder?: string,
    id?: string,
    className?: string,
    style?: Object,
    tabIndex?: number | string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
};

/**
 * Dropdown menu component for selecting tables.
 *
 * @example
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
 */
class TablePicker extends React.Component<TablePickerProps> {
    static propTypes = {
        table: PropTypes.instanceOf(Table),
        shouldAllowPickingNone: PropTypes.bool,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
    };
    props: TablePickerProps;
    _select: ModelPickerSelect<Table> | null;
    _onChange: (string | null) => void;
    constructor(props: TablePickerProps) {
        super(props);
        this._select = null;
        this._onChange = this._onChange.bind(this);
    }
    focus() {
        invariant(this._select, 'No select to focus');
        this._select.focus();
    }
    blur() {
        invariant(this._select, 'No select to blur');
        this._select.blur();
    }
    click() {
        invariant(this._select, 'No select to click');
        this._select.click();
    }
    _onChange(tableId: string | null) {
        const {onChange} = this.props;
        if (onChange) {
            const table = tableId ? getSdk().base.getTableByIdIfExists(tableId) : null;
            onChange(table);
        }
    }
    render() {
        const {
            table,
            shouldAllowPickingNone,
            disabled,
            placeholder,
            id,
            className,
            style,
            tabIndex,
        } = this.props;
        const selectedTable = table && !table.isDeleted ? table : null;

        let placeholderToUse;
        if (placeholder === undefined) {
            placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a table...';
        } else {
            placeholderToUse = placeholder;
        }

        return (
            <ModelPickerSelect
                ref={el => (this._select = el)}
                models={getSdk().base.tables}
                selectedModelId={selectedTable ? selectedTable.id : null}
                modelKeysToWatch={['name']}
                onChange={this._onChange}
                disabled={disabled}
                shouldAllowPickingNone={shouldAllowPickingNone}
                placeholder={placeholderToUse}
                id={id}
                className={className}
                style={style}
                tabIndex={tabIndex}
                aria-labelledby={this.props['aria-labelledby']}
                aria-describedby={this.props['aria-describedby']}
            />
        );
    }
}

export default withHooks<TablePickerProps, {}, TablePicker>(TablePicker, () => {
    useWatchable(getSdk().base, ['tables']);
    return {};
});
