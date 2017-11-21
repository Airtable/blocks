// @flow
const u = require('client_server_shared/u');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const FieldPicker = require('client/blocks/sdk/ui/field_picker');
const TableModel = require('client/blocks/sdk/models/table');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const Synced = require('client/blocks/sdk/ui/synced');

import type FieldModel from 'client/blocks/sdk/models/field';
import type {ApiFieldType} from 'client_server_shared/column_types/api_field_types';
import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type FieldPickerSyncedProps = {
    table: ?TableModel,
    globalConfigKey: GlobalConfigKey,
    onChange?: (fieldModel: FieldModel | null) => void,
    disabled: ?boolean,

    // Passed through to FieldPicker:
    shouldAllowPickingNone?: boolean,
    allowedTypes?: Array<ApiFieldType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
};

class FieldPickerSynced extends React.Component {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        // Passed through to FieldPicker:
        shouldAllowPickingNone: PropTypes.bool,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(u.values(ApiFieldTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
    };
    props: FieldPickerSyncedProps;
    _fieldPicker: FieldPicker | null;
    constructor(props: FieldPickerSyncedProps) {
        super(props);

        this._fieldPicker = null;
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
    _getFieldFromGlobalConfigValue(fieldId: mixed): FieldModel | null {
        const {table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }
        return (typeof fieldId === 'string') && table ? table.getFieldById(fieldId) : null;
    }
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <FieldPicker
                        ref={el => this._fieldPicker = el}
                        disabled={this.props.disabled || !canSetValue}
                        field={this._getFieldFromGlobalConfigValue(value)}
                        onChange={field => {
                            setValue(field ? field.id : null);
                            if (this.props.onChange) {
                                this.props.onChange(field);
                            }
                        }}
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

module.exports = createDataContainer(FieldPickerSynced, (props: FieldPickerSyncedProps) => {
    return [
        {watch: props.table, key: 'fields'},
        {watch: getSdk().base, key: 'tables'},
    ];
}, [
    'focus',
    'blur',
    'click',
]);
