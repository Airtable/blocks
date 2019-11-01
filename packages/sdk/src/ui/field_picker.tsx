/** @module @airtable/blocks/ui: FieldPicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {values, ObjectMap, has} from '../private_utils';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Table from '../models/table';
import {FieldTypes, FieldType} from '../types/field';
import {SharedSelectBaseProps, sharedSelectBasePropTypes} from './select';
import ModelPickerSelect from './model_picker_select';
import useWatchable from './use_watchable';

// Shared with `FieldPicker` and `FieldPickerSynced`.
/** */
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

// Shared with `FieldPicker` and `FieldPickerSynced`.
export const sharedFieldPickerPropTypes = {
    table: PropTypes.instanceOf(Table),
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes)).isRequired),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
};

/**
 * @typedef {object} FieldPickerProps
 */
interface FieldPickerProps extends SharedFieldPickerProps {
    /** The selected field model. */
    field?: Field | null;
}

/**
 * Dropdown menu component for selecting fields.
 *
 * @example
 * ```js
 * import {TablePicker, FieldPicker, useBase} from '@airtable/blocks/ui';
 * import {fieldTypes} from '@airtable/blocks/models';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     useBase();
 *     const [table, setTable] = useState(null);
 *     const [field, setField] = useState(null);
 *
 *     const summaryText = field ? `The field type for ${field.name} is ${field.type}.` : 'No field selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label style={{display: 'block', marginBottom: 16}}>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePicker
 *                     table={table}
 *                     onChange={newTable => {
 *                         setTable(newTable);
 *                         setField(null);
 *                     }}
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *             {table && (
 *                 <label>
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>Field</div>
 *                     <FieldPicker
 *                         table={table}
 *                         field={field}
 *                         onChange={newField => setField(newField)}
 *                         allowedTypes={[
 *                             fieldTypes.SINGLE_LINE_TEXT,
 *                             fieldTypes.MULTILINE_TEXT,
 *                             fieldTypes.EMAIL,
 *                             fieldTypes.URL,
 *                             fieldTypes.PHONE_NUMBER,
 *                         ]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 * ```
 */
function FieldPicker(props: FieldPickerProps, ref: React.Ref<HTMLSelectElement>) {
    const {
        table,
        field: selectedField,
        shouldAllowPickingNone,
        allowedTypes,
        placeholder,
        // Destructure `onChange` to prevent it from being passed to `ModelPickerSelect`.
        onChange,
        ...restOfProps
    } = props;

    useWatchable(getSdk().base, ['tables']);
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
        // Let's set a good default value for the placeholder, depending
        // on the shouldAllowPickingNone flag.
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

    // Fields are only ordered within a view, and views' column orders aren't
    // loaded by default. So we'll always list the primary field first, followed
    // by the rest of the fields in alphabetical order.
    const models = table.fields
        .filter(field => field !== table.primaryField)
        .sort((a, b) => {
            return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
        });
    models.unshift(table.primaryField);

    return (
        <ModelPickerSelect
            {...restOfProps}
            ref={ref}
            models={models}
            // `shouldAllowPickingModelFn` is typed as `AnyModel`. Cast to any since we only expect `Field`.
            shouldAllowPickingModelFn={shouldAllowPickingFieldFn as any}
            selectedModelId={selectedField && !selectedField.isDeleted ? selectedField.id : null}
            modelKeysToWatch={['name', 'type', 'options']}
            placeholder={placeholderToUse}
            onChange={_onChange}
        />
    );
}

const ForwardedRefFieldPicker = React.forwardRef(FieldPicker);

ForwardedRefFieldPicker.displayName = 'FieldPicker';

ForwardedRefFieldPicker.propTypes = {
    field: PropTypes.instanceOf(Field),
    ...sharedFieldPickerPropTypes,
};

export default ForwardedRefFieldPicker;
