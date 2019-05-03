// @flow
import PropTypes from 'prop-types';
import invariant from 'invariant';
import * as React from 'react';
import TableModel from '../models/table';
import getSdk from '../get_sdk';
import FieldTypes, {type FieldType} from '../types/field_types';
import type FieldModel from '../models/field';
import {type GlobalConfigKey} from '../global_config';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import FieldPicker from './field_picker';
import Synced from './synced';
import createDataContainer from './create_data_container';

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

type FieldPickerSyncedProps = {
    table?: TableModel,
    globalConfigKey: GlobalConfigKey,
    onChange?: (fieldModel: FieldModel | null) => void,
    disabled?: boolean,

    // Passed through to FieldPicker:
    shouldAllowPickingNone?: boolean,
    allowedTypes?: Array<FieldType>,
    placeholder?: string,
    style?: Object,
    className?: string,
};

/** */
class FieldPickerSynced extends React.Component<FieldPickerSyncedProps> {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        // Passed through to FieldPicker:
        shouldAllowPickingNone: PropTypes.bool,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(u.values(FieldTypes))),
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
        return typeof fieldId === 'string' && table ? table.getFieldById(fieldId) : null;
    }
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <FieldPicker
                        ref={el => (this._fieldPicker = el)}
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

export default createDataContainer(
    FieldPickerSynced,
    (props: FieldPickerSyncedProps) => {
        return [{watch: props.table, key: 'fields'}, {watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
