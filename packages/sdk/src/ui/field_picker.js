// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {values} from '../private_utils';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Table from '../models/table';
import {FieldTypes, type FieldType} from '../types/field';
import {
    type SharedSelectBaseProps,
    sharedSelectBasePropTypes,
    stylePropTypes,
    type StyleProps,
} from './select';
import ModelPickerSelect from './model_picker_select';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

export type SharedFieldPickerProps = {|
    table?: Table | null,
    allowedTypes?: Array<FieldType>,
    shouldAllowPickingNone?: boolean,
    placeholder?: string,
    onChange?: (fieldModel: Field | null) => void,
    ...SharedSelectBaseProps,
    ...StyleProps,
|};

export const sharedFieldPickerPropTypes = {
    table: PropTypes.instanceOf(Table),
    allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes))),
    shouldAllowPickingNone: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    ...sharedSelectBasePropTypes,
    ...stylePropTypes,
};

/**
 * @typedef {object} FieldPickerProps
 * @property {Field} [field] The selected field model.
 * @property {Table} [table] The parent table model to select fields from. If `null` or `undefined`, the picker won't render.
 * @property {Array.<FieldType>} [allowedTypes] An array indicating which field types can be selected.
 * @property {boolean} [shouldAllowPickingNone] If set to `true`, the user can unset the selected field.
 * @property {string} [placeholder='Pick a field...'] The placeholder text when no field is selected.
 * @property {function} [onChange] A function to be called when the selected field changes.
 * @property {string} [autoFocus] The `autoFocus` attribute.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {string} [id] The `id` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {string} [aria-label] The `aria-label` attribute. Use this if the select is not referenced by a label element.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type FieldPickerProps = {|
    field?: Field | null,
    ...SharedFieldPickerProps,
|};

/**
 * Dropdown menu component for selecting fields.
 *
 * @example
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
 */
class FieldPicker extends React.Component<FieldPickerProps> {
    static propTypes = {
        field: PropTypes.instanceOf(Field),
        table: PropTypes.instanceOf(Table),
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes))),
        shouldAllowPickingNone: PropTypes.bool,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        ...sharedSelectBasePropTypes,
    };
    props: FieldPickerProps;
    _onChange: (string | null) => void;
    _select: ModelPickerSelect<Field> | null;
    constructor(props: FieldPickerProps) {
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
    _onChange(fieldId: string | null) {
        const {onChange, table} = this.props;
        if (onChange) {
            const field =
                table && !table.isDeleted && fieldId ? table.getFieldByIdIfExists(fieldId) : null;
            onChange(field);
        }
    }
    render() {
        const {
            table,
            field: selectedField,
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
            placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a field...';
        } else {
            placeholderToUse = placeholder;
        }

        const allowedTypesSet = {};
        if (allowedTypes) {
            for (const allowedType of allowedTypes) {
                allowedTypesSet[allowedType] = true;
            }
        }
        const shouldAllowPickingFieldFn = field => {
            return !allowedTypes || allowedTypesSet[field.type];
        };

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

export default withHooks<FieldPickerProps, {}, FieldPicker>(FieldPicker, props => {
    useWatchable(getSdk().base, ['tables']);
    useWatchable(props.table, ['fields']);
    return {};
});
