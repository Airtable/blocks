// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const FieldPicker = require('client/blocks/sdk/ui/field_picker');
const TableModel = require('client/blocks/sdk/models/table');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const permissions = require('client_server_shared/permissions');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

import type FieldModel from 'client/blocks/sdk/models/field';
import type {ApiFieldType} from 'client_server_shared/column_types/api_field_types';
import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type FieldPickerSyncedProps = {
    table: ?TableModel,
    globalConfigKey: GlobalConfigKey,
    shouldAllowPickingNone?: boolean,
    onChange?: (fieldModel: FieldModel | null) => void,
    allowedTypes?: Array<ApiFieldType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class FieldPickerSynced extends React.Component {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(_.values(ApiFieldTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: FieldPickerSyncedProps;
    _fieldPicker: FieldPicker | null;
    _onChange: (field: FieldModel | null) => void;
    constructor(props: FieldPickerSyncedProps) {
        super(props);

        this._fieldPicker = null;
        this._onChange = this._onChange.bind(this);
    }
    focus() {
        invariant(this._fieldPicker, 'No field picker to focus');
        this._fieldPicker.focus();
    }
    blur() {
        invariant(this._fieldPicker, 'No field picker to blur');
        this._fieldPicker.blur();
    }
    click() {
        invariant(this._fieldPicker, 'No field picker to click');
        this._fieldPicker.click();
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
        if (!table || table.isDeleted) {
            return null;
        }
        const fieldId = getSdk().globalConfig.get(this.props.globalConfigKey);
        return (typeof fieldId === 'string') && table ? table.getFieldById(fieldId) : null;
    }
    render() {
        const {table, shouldAllowPickingNone} = this.props;
        const field = this._getSelectedField();
        const restOfProps = _.omit(this.props, Object.keys(FieldPickerSynced.propTypes));
        return (
            <FieldPicker
                ref={el => this._fieldPicker = el}
                table={table}
                field={field}
                shouldAllowPickingNone={shouldAllowPickingNone}
                onChange={this._onChange}
                allowedTypes={this.props.allowedTypes}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || getSdk().base.permissionLevel === permissions.API_LEVELS.READ}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(FieldPickerSynced, (props: FieldPickerSyncedProps) => {
    return [
        {watch: props.table, key: 'fields'},
        {watch: getSdk().base, key: 'tables'},
        ...globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey),
    ];
}, [
    'focus',
    'blur',
    'click',
]);
