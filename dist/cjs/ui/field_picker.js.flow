// @flow
import PropTypes from 'prop-types';
import invariant from 'invariant';
import * as React from 'react';
import {values} from '../private_utils';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Table from '../models/table';
import {FieldTypes, type FieldType} from '../types/field';
import ModelPickerSelect from './model_picker_select';
import createDataContainer from './create_data_container';

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

type FieldPickerProps = {
    table?: Table,
    field?: Field,
    shouldAllowPickingNone?: boolean,
    onChange?: (fieldModel: Field | null) => void,
    allowedTypes?: Array<FieldType>,
    placeholder?: string,
    style?: Object,
    className?: string,
    disabled?: boolean,
};

/** */
class FieldPicker extends React.Component<FieldPickerProps> {
    static propTypes = {
        table: PropTypes.instanceOf(Table),
        field: PropTypes.instanceOf(Field),
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(FieldTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
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
            field: selectedField,
            table,
            shouldAllowPickingNone,
            style,
            className,
            disabled,
        } = this.props;
        if (!table || table.isDeleted) {
            return null;
        }

        let placeholder;
        if (this.props.placeholder === undefined) {
            // Let's set a good default value for the placeholder, depending
            // on the shouldAllowPickingNone flag.
            placeholder = shouldAllowPickingNone ? 'None' : 'Pick a field...';
        } else {
            placeholder = this.props.placeholder;
        }

        let allowedTypes = null;
        if (this.props.allowedTypes) {
            allowedTypes = {};
            for (const allowedType of this.props.allowedTypes) {
                allowedTypes[allowedType] = true;
            }
        }
        const shouldAllowPickingFieldFn = field => {
            return !allowedTypes || allowedTypes[field.type];
        };

        const restOfProps = u.omit(this.props, Object.keys(FieldPicker.propTypes));

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
                ref={el => (this._select = el)}
                models={models}
                selectedModelId={
                    selectedField && !selectedField.isDeleted ? selectedField.id : null
                }
                shouldAllowPickingModelFn={shouldAllowPickingFieldFn}
                onChange={this._onChange}
                style={style}
                className={className}
                disabled={disabled}
                placeholder={placeholder}
                shouldAllowPickingNone={shouldAllowPickingNone}
                modelKeysToWatch={['name', 'type', 'options']}
                {...restOfProps}
            />
        );
    }
}

export default createDataContainer(
    FieldPicker,
    (props: FieldPickerProps) => {
        return [{watch: props.table, key: 'fields'}, {watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
