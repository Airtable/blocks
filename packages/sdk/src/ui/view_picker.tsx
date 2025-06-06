/** @module @airtable/blocks/ui: ViewPicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {values, ObjectMap} from '../private_utils';
import View from '../models/view';
import Table from '../models/table';
import {ViewType} from '../types/view';
import {sharedSelectBasePropTypes, SharedSelectBaseProps} from './select';
import ModelPickerSelect from './model_picker_select';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/**
 * Props shared between the {@link ViewPicker} and {@link ViewPickerSynced} components.
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
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewType)).isRequired),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * Props for the {@link ViewPicker} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/ViewPicker
 */
export interface ViewPickerProps extends SharedViewPickerProps {
    /** The selected view model. */
    view?: View | null;
}

/**
 * Dropdown menu component for selecting views.
 *
 * [[ Story id="modelpickers--viewpicker-example" title="View picker example" ]]
 *
 * @component
 * @docsPath UI/components/ViewPicker
 */
const ViewPicker = (props: ViewPickerProps, ref: React.Ref<HTMLSelectElement>) => {
    const {
        table,
        view: selectedView,
        shouldAllowPickingNone,
        allowedTypes = [ViewType.GRID, ViewType.CALENDAR, ViewType.GALLERY, ViewType.KANBAN],
        placeholder,
        onChange,
        ...restOfProps
    } = props;
    const sdk = useSdk();

    useWatchable(sdk.base, ['tables']);
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
};

const ForwardedRefViewPicker = React.forwardRef<HTMLSelectElement, ViewPickerProps>(ViewPicker);

ForwardedRefViewPicker.displayName = 'ViewPicker';

ForwardedRefViewPicker.propTypes = {
    view: PropTypes.instanceOf(View),
    ...sharedViewPickerPropTypes,
};

export default ForwardedRefViewPicker;
