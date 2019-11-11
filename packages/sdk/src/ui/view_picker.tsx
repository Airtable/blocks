/** @module @airtable/blocks/ui: ViewPicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {values, ObjectMap} from '../private_utils';
import getSdk from '../get_sdk';
import View from '../models/view';
import Table from '../models/table';
import {ViewTypes, ViewType} from '../types/view';
import {sharedSelectBasePropTypes, SharedSelectBaseProps} from './select';
import ModelPickerSelect from './model_picker_select';
import useWatchable from './use_watchable';

/**
 * Props shared between the {@link ViewPicker} and {@link ViewPickerSynced} components. Also accepts:
 * * {@link SharedSelectBaseProps}
 *
 * @noInheritDoc
 */
export interface SharedViewPickerProps extends SharedSelectBaseProps {
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

export const sharedViewPickerPropTypes = {
    table: PropTypes.instanceOf(Table),
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewTypes)).isRequired),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * Props for the {@link ViewPicker} component. Also accepts:
 * * {@link SharedViewPickerProps}
 *
 * @noInheritDoc
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
function ViewPicker(props: ViewPickerProps, ref: React.Ref<HTMLSelectElement>) {
    const {
        table,
        view: selectedView,
        shouldAllowPickingNone,
        allowedTypes = [ViewTypes.GRID, ViewTypes.CALENDAR, ViewTypes.GALLERY, ViewTypes.KANBAN],
        placeholder,
        onChange,
        ...restOfProps
    } = props;

    useWatchable(getSdk().base, ['tables']);
    useWatchable(table, ['views']);

    if (!table || table.isDeleted) {
        return null;
    }

    function _onChange(viewId: string | null) {
        if (onChange) {
            const view =
                table && !table.isDeleted && viewId ? table.getViewByIdIfExists(viewId) : null;
            onChange(view);
        }
    }

    let placeholderToUse;
    if (placeholder === undefined) {
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
            ref={ref}
            models={table.views}
            shouldAllowPickingModelFn={shouldAllowPickingViewFn as any}
            selectedModelId={selectedView && !selectedView.isDeleted ? selectedView.id : null}
            modelKeysToWatch={['name']}
            shouldAllowPickingNone={shouldAllowPickingNone}
            placeholder={placeholderToUse}
            onChange={_onChange}
        />
    );
}

const ForwardedRefViewPicker = React.forwardRef<HTMLSelectElement, ViewPickerProps>(ViewPicker);

ForwardedRefViewPicker.displayName = 'ViewPicker';

ForwardedRefViewPicker.propTypes = {
    view: PropTypes.instanceOf(View),
    ...sharedViewPickerPropTypes,
};

export default ForwardedRefViewPicker;
