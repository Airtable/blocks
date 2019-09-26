// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {values} from '../private_utils';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import View from '../models/view';
import Table from '../models/table';
import {ViewTypes, type ViewType} from '../types/view';
import {
    sharedSelectBasePropTypes,
    type SharedSelectBaseProps,
    stylePropTypes,
    type StyleProps,
} from './select';
import ModelPickerSelect from './model_picker_select';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

export type SharedViewPickerProps = {|
    table?: Table | null,
    allowedTypes?: Array<ViewType>,
    shouldAllowPickingNone?: boolean,
    placeholder?: string,
    onChange?: (viewModel: View | null) => void,
    ...SharedSelectBaseProps,
    ...StyleProps,
|};

export const sharedViewPickerPropTypes = {
    table: PropTypes.instanceOf(Table),
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewTypes))),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    sharedSelectBasePropTypes,
    ...stylePropTypes,
};

/**
 * @typedef {object} ViewPickerProps
 * @property {View} [view] The selected view model.
 * @property {Table} [table] The parent table model to select views from. If `null` or `undefined`, the picker won't render.
 * @property {Array.<ViewType>} [allowedTypes] An array indicating which view types can be selected.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected view.
 * @property {string} [placeholder='Pick a view...'] The placeholder text when no view is selected.
 * @property {function} [onChange] A function to be called when the selected view changes.
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
type ViewPickerProps = {|
    view?: View | null,
    ...SharedViewPickerProps,
|};

/**
 * Dropdown menu component for selecting views.
 *
 * @example
 * import {TablePicker, ViewPicker, useBase, useRecords} from '@airtable/blocks/ui';
 * import {viewTypes} from '@airtable/blocks/models';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     useBase();
 *     const [table, setTable] = useState(null);
 *     const [view, setView] = useState(null);
 *     const queryResult = view ? view.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *
 *     const summaryText = view ? `${view.name} has ${records.length} record(s).` : 'No view selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label style={{display: 'block', marginBottom: 16}}>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePicker
 *                     table={table}
 *                     onChange={newTable => {
 *                         setTable(newTable);
 *                         setView(null);
 *                     }}
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *             {table && (
 *                 <label>
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
 *                     <ViewPicker
 *                         table={table}
 *                         view={view}
 *                         onChange={newView => setView(newView)}
 *                         allowedTypes={[viewTypes.GRID]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 */
class ViewPicker extends React.Component<ViewPickerProps> {
    static propTypes = {
        view: PropTypes.instanceOf(View),
        ...sharedViewPickerPropTypes,
    };
    static defaultProps = {
        allowedTypes: [ViewTypes.GRID, ViewTypes.CALENDAR, ViewTypes.GALLERY, ViewTypes.KANBAN],
    };
    props: ViewPickerProps;
    _onChange: (string | null) => void;
    _select: ModelPickerSelect<View> | null;
    constructor(props: ViewPickerProps) {
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
    _onChange(viewId: string | null) {
        const {onChange, table} = this.props;
        if (onChange) {
            const view =
                table && !table.isDeleted && viewId ? table.getViewByIdIfExists(viewId) : null;
            onChange(view);
        }
    }
    render() {
        const {
            table,
            view: selectedView,
            shouldAllowPickingNone,
            allowedTypes,
            placeholder,
            // eslint-disable-next-line no-unused-vars
            onChange,
            ...restOfProps
        } = this.props;
        if (!table || table.isDeleted) {
            return null;
        }

        let placeholderToUse;
        if (placeholder === undefined) {
            placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a view...';
        } else {
            placeholderToUse = placeholder;
        }

        const allowedTypesSet = {};
        if (allowedTypes) {
            for (const allowedType of allowedTypes) {
                allowedTypesSet[allowedType] = true;
            }
        }
        const shouldAllowPickingViewFn = view => allowedTypesSet[view.type];

        return (
            <ModelPickerSelect
                {...restOfProps}
                ref={el => (this._select = el)}
                models={table.views}
                shouldAllowPickingModelFn={shouldAllowPickingViewFn}
                selectedModelId={selectedView && !selectedView.isDeleted ? selectedView.id : null}
                modelKeysToWatch={['name']}
                shouldAllowPickingNone={shouldAllowPickingNone}
                placeholder={placeholderToUse}
                onChange={this._onChange}
            />
        );
    }
}

export default withHooks<ViewPickerProps, {}, ViewPicker>(ViewPicker, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['views']);
    return {};
});
