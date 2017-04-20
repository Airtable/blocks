// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const FieldModel = require('client/blocks/sdk/models/field');
const TableModel = require('client/blocks/sdk/models/table');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');

import type {ApiFieldType} from 'client_server_shared/column_types/api_field_types';

type FieldPickerOptionProps = {
    field: FieldModel,
    // This is a hack around the fact that FieldPicker can't easily
    // listen to all field config changes....
    allowedTypes: Object | null,
};
const _FieldPickerOption = (props: FieldPickerOptionProps) => {
    const {field} = props;
    const isDisabled = props.allowedTypes && !props.allowedTypes[props.field.config.type];
    return <option value={field.id} disabled={isDisabled}>{field.name}</option>;
};
const FieldPickerOption = createDataContainer(_FieldPickerOption, (props: FieldPickerOptionProps) => {
    return [
        {watch: props.field, key: ['name', 'config']},
    ];
});

type FieldPickerProps = {
    table: ?TableModel,
    field: ?FieldModel,
    onChange?: (fieldModel: FieldModel | null) => void,
    allowedTypes?: Array<ApiFieldType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class FieldPicker extends React.Component {
    static propTypes = {
        table: React.PropTypes.instanceOf(TableModel),
        field: React.PropTypes.instanceOf(FieldModel),
        onChange: React.PropTypes.func,
        allowedTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(_.values(ApiFieldTypes))),
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    static defaultProps = {
        placeholder: 'Pick a field...',
    };
    props: FieldPickerProps;
    _onChange(e) {
        const {onChange, table} = this.props;
        if (onChange) {
            const field = table && !table.isDeleted ? table.getFieldById(e.target.value) : null;
            onChange(field);
        }
    }
    _onFieldsChanged() {
        const {field} = this.props;
        if (field && field.isDeleted && this.props.onChange) {
            this.props.onChange(null);
        }
        this.forceUpdate();
    }
    _onTablesChanged() {
        const {table} = this.props;
        if (table && table.isDeleted && this.props.onChange) {
            this.props.onChange(null);
        }
        this.forceUpdate();
    }
    render() {
        const {field: selectedField, table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }

        let allowedTypes = null;
        if (this.props.allowedTypes) {
            allowedTypes = {};
            for (const allowedType of this.props.allowedTypes) {
                allowedTypes[allowedType] = true;
            }
        }

        return (
            <select
                value={selectedField && !selectedField.isDeleted ? selectedField.id : ''}
                onChange={this._onChange.bind(this)}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled}>
                <option value={''} disabled={true}>{this.props.placeholder}</option>
                {table.fields.map(field => {
                    return (
                        <FieldPickerOption
                            key={field.id}
                            field={field}
                            allowedTypes={allowedTypes}
                        />
                    );
                })}
            </select>
        );
    }
}

module.exports = createDataContainer(FieldPicker, (props: FieldPickerProps) => {
    return [
        {watch: props.table, key: 'fields', callback: FieldPicker.prototype._onFieldsChanged},
        {watch: getSdk().base, key: 'tables', callback: FieldPicker.prototype._onTablesChanged},
    ];
});
