/** @module @airtable/blocks/ui: ViewPicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {values, ObjectMap} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import View from '../models/view';
import Table from '../models/table';
import {ViewTypes, ViewType} from '../types/view';
import {
    sharedSelectBasePropTypes,
    SharedSelectBaseProps,
    selectStylePropTypes,
    SelectStyleProps,
} from './select';
import ModelPickerSelect from './model_picker_select';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

// Shared with `ViewPicker` and `ViewPickerSynced`.
/** */
export interface SharedViewPickerProps extends SharedSelectBaseProps, SelectStyleProps {
    /** The parent table model to select views from. If `null` or `undefined`, the picker won't render. */
    table?: Table | null;
    /** An array indicating which view types can be selected. */
    allowedTypes?: Array<ViewType>;
    /** If set to `true`, the user can unset the selected view. */
    shouldAllowPickingNone?: boolean;
    /** The placeholder text when no view is selected. Defaults to `'Pick a view...'` */
    placeholder?: string;
    /** A function to be called when the selected view changes. */
    onChange?: (viewModel: View | null) => void;
}

// Shared with `ViewPicker` and `ViewPickerSynced`.
export const sharedViewPickerPropTypes = {
    table: PropTypes.instanceOf(Table),
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewTypes))),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
    ...selectStylePropTypes,
};

/**
 * @typedef {object} ViewPickerProps
 */
interface ViewPickerProps extends SharedViewPickerProps {
    /** The selected view model. */
    view?: View | null;
}

/**
 * Dropdown menu component for selecting views.
 *
 * @example
 * ```js
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
 * ```
 */
export class ViewPicker extends React.Component<ViewPickerProps> {
    /** @hidden */
    static propTypes = {
        view: PropTypes.instanceOf(View),
        ...sharedViewPickerPropTypes,
    };
    /** @hidden */
    static defaultProps = {
        // Exclude ViewTypes.FORM
        allowedTypes: [ViewTypes.GRID, ViewTypes.CALENDAR, ViewTypes.GALLERY, ViewTypes.KANBAN],
    };
    /** @internal */
    _select: ModelPickerSelect<View> | null;
    /** @hidden */
    constructor(props: ViewPickerProps) {
        super(props);
        // TODO (stephen): Use React.forwardRef
        this._select = null;
        this._onChange = this._onChange.bind(this);
    }
    /** */
    focus() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to focus');
        }
        this._select.focus();
    }
    /** */
    blur() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to blur');
        }
        this._select.blur();
    }
    /** */
    click() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to click');
        }
        this._select.click();
    }
    /** @internal */
    _onChange(viewId: string | null) {
        const {onChange, table} = this.props;
        if (onChange) {
            const view =
                table && !table.isDeleted && viewId ? table.getViewByIdIfExists(viewId) : null;
            onChange(view);
        }
    }
    /** @hidden */
    render() {
        const {
            table,
            view: selectedView,
            shouldAllowPickingNone,
            allowedTypes,
            placeholder,
            // Destructure `onChange` to prevent it from being passed to `Select`.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange,
            ...restOfProps
        } = this.props;
        if (!table || table.isDeleted) {
            return null;
        }

        let placeholderToUse;
        if (placeholder === undefined) {
            // Let's set a good default value for the placeholder, depending
            // on the shouldAllowPickingNone flag.
            placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a view...';
        } else {
            placeholderToUse = placeholder;
        }

        const allowedTypesSet = {} as ObjectMap<ViewType, true>;
        if (allowedTypes) {
            for (const allowedType of allowedTypes) {
                allowedTypesSet[allowedType] = true;
            }
        }
        const shouldAllowPickingViewFn = (view: View) => allowedTypesSet[view.type];

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

export default withHooks<{}, ViewPickerProps, ViewPicker>(ViewPicker, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['views']);
    return {};
});
