// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const FieldPicker = require('client/blocks/sdk/ui/field_picker');
const TableModel = require('client/blocks/sdk/models/table');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const permissions = require('client_server_shared/permissions');

import type FieldModel from 'client/blocks/sdk/models/field';
import type {ApiFieldType} from 'client_server_shared/column_types/api_field_types';

type FieldPickerSyncedProps = {
    table: ?TableModel,
    globalConfigKey: string,
    onChange?: (fieldModel: FieldModel | null) => void,
    allowedTypes?: Array<ApiFieldType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class FieldPickerSynced extends React.Component {
    static propTypes = {
        table: React.PropTypes.instanceOf(TableModel),
        globalConfigKey: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
        allowedTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(_.values(ApiFieldTypes))),
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: FieldPickerSyncedProps;
    componentDidMount() {
        // It is possible that since this component was last shown, the field was deleted,
        // so let's check for that before the initial render so we don't try to use a field
        // that no longer exists.
        const fieldId = getSdk().globalConfig.get(this.props.globalConfigKey);
        const field = this._getSelectedField();
        if (fieldId && !field) {
            // We have a fieldId, but the field no longer exists, so let's just
            // clear out the value in the globalConfig.
            this._onChange(null);
        }
    }
    componentWillReceiveProps(nextProps: FieldPickerSyncedProps) {
        const {table: newTable} = nextProps;
        const {table: currTable} = this.props;
        const newTableId = newTable ? newTable.id : null;
        const currTableId = currTable ? currTable.id : null;
        const fieldId = getSdk().globalConfig.get(this.props.globalConfigKey);
        if (fieldId && newTableId !== currTableId) {
            // The table that this picker is referring to changed, so we should
            // clear out the fieldId value in globalConfig. This way, if the user
            // switches back to the old table, the field picker won't automatically
            // re-select the old field.
            getSdk().globalConfig.set(this.props.globalConfigKey, null);
        }
    }
    _onChange(field: FieldModel | null) {
        const fieldId = field ? field.id : null;
        getSdk().globalConfig.set(this.props.globalConfigKey, fieldId);

        if (this.props.onChange) {
            this.props.onChange(field);
        }
    }
    _getSelectedField(): FieldModel | null {
        const {table} = this.props;
        const fieldId = getSdk().globalConfig.get(this.props.globalConfigKey);
        return (typeof fieldId === 'string') && table ? table.getFieldById(fieldId) : null;
    }
    render() {
        const {table} = this.props;
        const field = this._getSelectedField();
        return (
            <FieldPicker
                table={table}
                field={field}
                onChange={this._onChange.bind(this)}
                allowedTypes={this.props.allowedTypes}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || getSdk().base.permissionLevel === permissions.API_LEVELS.READ}
            />
        );
    }
}

module.exports = createDataContainer(FieldPickerSynced, (props: FieldPickerSyncedProps) => {
    return [
        {watch: getSdk().globalConfig, key: props.globalConfigKey},
        {watch: getSdk().base, key: 'permissionLevel'},
    ];
});
