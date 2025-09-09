/** @module @airtable/blocks/ui: FieldPicker */ /** */
import * as React from 'react';
import {type ObjectMap, has} from '../../shared/private_utils';
import type Field from '../models/field';
import type Table from '../models/table';
import {type FieldType} from '../../shared/types/field_core';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {type BaseSdkMode} from '../../sdk_mode';
import {type SharedSelectBaseProps} from './select';
import ModelPickerSelect from './model_picker_select';

/**
 * Props shared between the {@link FieldPicker} and {@link FieldPickerSynced} components.
 */
export interface SharedFieldPickerProps extends SharedSelectBaseProps {
    /** The parent table model to select fields from. If `null` or `undefined`, the picker won't render. */
    table?: Table | null;
    /** An array indicating which field types can be selected. */
    allowedTypes?: Array<FieldType>;
    /** If set to `true`, the user can unset the selected field. */
    shouldAllowPickingNone?: boolean;
    /** The placeholder text when no field is selected. */
    placeholder?: string;
    /** A function to be called when the selected field changes. */
    onChange?: (fieldModel: Field | null) => void;
}

/**
 * Props for the {@link FieldPicker} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/FieldPicker
 */
export interface FieldPickerProps extends SharedFieldPickerProps {
    /** The selected field model. */
    field?: Field | null;
}

/**
 * Dropdown menu component for selecting fields.
 *
 * [[ Story id="modelpickers--fieldpicker-example" title="Field picker example" ]]
 *
 * @docsPath UI/components/FieldPicker
 * @component
 */
const FieldPicker = (props: FieldPickerProps, ref: React.Ref<HTMLSelectElement>) => {
    const {
        table,
        field: selectedField,
        shouldAllowPickingNone,
        allowedTypes,
        placeholder,
        onChange,
        ...restOfProps
    } = props;
    const sdk = useSdk<BaseSdkMode>();

    useWatchable(sdk.base, ['tables']);
    useWatchable(table, ['fields']);

    if (!table || table.isDeleted) {
        return null;
    }

    function _onChange(fieldId: string | null) {
        if (onChange) {
            const field =
                table && !table.isDeleted && fieldId ? table.getFieldByIdIfExists(fieldId) : null;
            onChange(field);
        }
    }

    let placeholderToUse;
    if (placeholder === undefined) {
        placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a field...';
    } else {
        placeholderToUse = placeholder;
    }

    const allowedTypesSet = {} as ObjectMap<FieldType, true>;
    if (allowedTypes) {
        for (const allowedType of allowedTypes) {
            allowedTypesSet[allowedType] = true;
        }
    }
    const shouldAllowPickingFieldFn = (field: Field) => {
        return !allowedTypes || has(allowedTypesSet, field.type);
    };

    const models = table.fields
        .filter((field) => field !== table.primaryField)
        .sort((a, b) => {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });
    models.unshift(table.primaryField);

    return (
        <ModelPickerSelect
            {...restOfProps}
            ref={ref}
            models={models}
            shouldAllowPickingModelFn={shouldAllowPickingFieldFn as any}
            selectedModelId={selectedField && !selectedField.isDeleted ? selectedField.id : null}
            modelKeysToWatch={['name', 'type', 'options']}
            shouldAllowPickingNone={shouldAllowPickingNone}
            placeholder={placeholderToUse}
            onChange={_onChange}
        />
    );
};

const ForwardedRefFieldPicker = React.forwardRef<HTMLSelectElement, FieldPickerProps>(FieldPicker);

ForwardedRefFieldPicker.displayName = 'FieldPicker';

export default ForwardedRefFieldPicker;
