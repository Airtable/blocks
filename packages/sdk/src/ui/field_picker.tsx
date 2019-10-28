/** @module @airtable/blocks/ui: FieldPicker */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {values, ObjectMap, has} from '../private_utils';
import {spawnInvariantViolationError} from '../error_utils';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Table from '../models/table';
import {FieldTypes, FieldType} from '../types/field';
import {
    SharedSelectBaseProps,
    sharedSelectBasePropTypes,
    selectStylePropTypes,
    SelectStyleProps,
} from './select';
import ModelPickerSelect from './model_picker_select';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

// Shared with `FieldPicker` and `FieldPickerSynced`.
/** */
export interface SharedFieldPickerProps extends SharedSelectBaseProps, SelectStyleProps {
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
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes))),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
    ...selectStylePropTypes,
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
export class FieldPicker extends React.Component<FieldPickerProps> {
    /** @hidden */
    static propTypes = {
        field: PropTypes.instanceOf(Field),
        table: PropTypes.instanceOf(Table),
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes))),
        shouldAllowPickingNone: PropTypes.bool,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        ...sharedSelectBasePropTypes,
    };
    /** @internal */
    _select: ModelPickerSelect<Field> | null;
    /** @hidden */
    constructor(props: FieldPickerProps) {
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
    _onChange(fieldId: string | null) {
        const {onChange, table} = this.props;
        if (onChange) {
            const field =
                table && !table.isDeleted && fieldId ? table.getFieldByIdIfExists(fieldId) : null;
            onChange(field);
        }
    }
    /** @hidden */
    render() {
        const {
            table,
            field: selectedField,
            shouldAllowPickingNone,
            allowedTypes,
            placeholder,
            // Destructure `onChange` to prevent it from being passed to `ModelPickerSelect`.
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
                ref={el => (this._select = el)}
                models={models}
                shouldAllowPickingModelFn={shouldAllowPickingFieldFn}
                selectedModelId={
                    selectedField && !selectedField.isDeleted ? selectedField.id : null
                }
                modelKeysToWatch={['name', 'type', 'options']}
                placeholder={placeholderToUse}
                onChange={this._onChange}
            />
        );
    }
}

export default withHooks<{}, FieldPickerProps, FieldPicker>(FieldPicker, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['fields']);
    return {};
});
