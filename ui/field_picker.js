// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const FieldModel = require('client/blocks/sdk/models/field');
const TableModel = require('client/blocks/sdk/models/table');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const ModelPickerSelect = require('client/blocks/sdk/ui/model_picker_select');

import type {ApiFieldType} from 'client_server_shared/column_types/api_field_types';

type FieldPickerProps = {
    table: ?TableModel,
    field: ?FieldModel,
    shouldAllowPickingNone?: boolean,
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
        shouldAllowPickingNone: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        allowedTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(_.values(ApiFieldTypes))),
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: FieldPickerProps;
    _onChange: (string | null) => void;
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }
    _onChange(fieldId: string | null) {
        const {onChange, table} = this.props;
        if (onChange) {
            const field = table && !table.isDeleted && fieldId ? table.getFieldById(fieldId) : null;
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
            return !allowedTypes || allowedTypes[field.config.type];
        };

        return (
            <ModelPickerSelect
                models={table.fields}
                selectedModelId={selectedField && !selectedField.isDeleted ? selectedField.id : null}
                shouldAllowPickingModelFn={shouldAllowPickingFieldFn}
                onChange={this._onChange}
                style={style}
                className={className}
                disabled={disabled}
                placeholder={placeholder}
                shouldAllowPickingNone={shouldAllowPickingNone}
                modelKeysToWatch={['name', 'config']}
            />
        );
    }
}

module.exports = createDataContainer(FieldPicker, (props: FieldPickerProps) => {
    return [
        {watch: props.table, key: 'fields'},
        {watch: getSdk().base, key: 'tables'},
    ];
});
