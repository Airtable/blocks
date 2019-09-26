// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import Table from '../models/table';
import {
    sharedSelectBasePropTypes,
    type SharedSelectBaseProps,
    stylePropTypes,
    type StyleProps,
} from './select';
import ModelPickerSelect from './model_picker_select';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

export type SharedTablePickerProps = {|
    shouldAllowPickingNone?: boolean,
    placeholder?: string,
    onChange?: (tableModel: Table | null) => void,
    ...SharedSelectBaseProps,
    ...StyleProps,
|};

export const sharedTablePickerPropTypes = {
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
    ...stylePropTypes,
};

/**
 * @typedef {object} TablePickerProps
 * @property {Table} [table] The selected table model.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected table.
 * @property {string} [placeholder='Pick a table...'] The placeholder text when no table is selected.
 * @property {function} [onChange] A function to be called when the selected table changes.
 * @property {string} [autoFocus] The `autoFocus` attribute.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the picker.
 * @property {string} [id] The `id` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the picker.
 * @property {object} [style] Additional styles to apply to the picker.
 * @property {string} [aria-label] The `aria-label` attribute. Use this if the select is not referenced by a label element.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type TablePickerProps = {|
    table?: Table | null,
    ...SharedTablePickerProps,
|};

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
        ...sharedTablePickerPropTypes,
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
            placeholder,
            // eslint-disable-next-line no-unused-vars
            onChange,
            ...restOfProps
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
                {...restOfProps}
                ref={el => (this._select = el)}
                models={getSdk().base.tables}
                selectedModelId={selectedTable ? selectedTable.id : null}
                modelKeysToWatch={['name']}
                shouldAllowPickingNone={shouldAllowPickingNone}
                placeholder={placeholderToUse}
                onChange={this._onChange}
            />
        );
    }
}

export default withHooks<TablePickerProps, {}, TablePicker>(TablePicker, () => {
    useWatchable(getSdk().base, ['tables']);
    return {};
});
