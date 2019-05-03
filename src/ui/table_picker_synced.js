// @flow
const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
import React from './react';
import PropTypes from 'prop-types';
import createDataContainer from './create_data_container';
import getSdk from '../get_sdk';
import TablePicker from './table_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import invariant from 'invariant';
import Synced from './synced';

import type TableModel from '../models/table';
import type {GlobalConfigKey} from '../global_config';

type TablePickerSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    onChange?: (tableModel: TableModel | null) => void,
    disabled?: boolean,

    // Passed through to TablePicker.
    shouldAllowPickingNone?: boolean,
    placeholder?: string,
    style?: Object,
    className?: string,
};

/** */
class TablePickerSynced extends React.Component<TablePickerSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,

        // Passed through to TablePicker.
        shouldAllowPickingNone: PropTypes.bool,
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
    };
    props: TablePickerSyncedProps;
    _tablePicker: TablePicker | null;
    constructor(props: TablePickerSyncedProps) {
        super(props);

        this._tablePicker = null;
    }
    focus() {
        invariant(this._tablePicker, 'No table picker to focus');
        this._tablePicker.focus();
    }
    blur() {
        invariant(this._tablePicker, 'No table picker to blur');
        this._tablePicker.blur();
    }
    click() {
        invariant(this._tablePicker, 'No table picker to click');
        this._tablePicker.click();
    }
    _getTableFromGlobalConfigValue(tableId: mixed): TableModel | null {
        return typeof tableId === 'string' ? getSdk().base.getTableById(tableId) : null;
    }
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <TablePicker
                        ref={el => (this._tablePicker = el)}
                        table={this._getTableFromGlobalConfigValue(value)}
                        disabled={this.props.disabled || !canSetValue}
                        onChange={table => {
                            setValue(table ? table.id : null);
                            if (this.props.onChange) {
                                this.props.onChange(table);
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
    TablePickerSynced,
    (props: TablePickerSyncedProps) => {
        return [{watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
