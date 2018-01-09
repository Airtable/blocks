// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const TablePicker = require('client/blocks/sdk/ui/table_picker');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');
const invariant = require('invariant');
const Synced = require('client/blocks/sdk/ui/synced');

import type TableModel from 'client/blocks/sdk/models/table';
import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type TablePickerSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    onChange?: (tableModel: TableModel | null) => void,
    disabled: ?boolean,

    // Passed through to TablePicker.
    shouldAllowPickingNone?: boolean,
    placeholder?: string,
    style: ?Object,
    className: ?string,
};

class TablePickerSynced extends React.Component {
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
    _onChange(table: TableModel | null) {
        const tableId = table ? table.id : null;
        getSdk().globalConfig.set(this.props.globalConfigKey, tableId);

        if (this.props.onChange) {
            this.props.onChange(table);
        }
    }
    _getTableFromGlobalConfigValue(tableId: mixed): TableModel | null {
        return (typeof tableId === 'string') ? getSdk().base.getTableById(tableId) : null;
    }
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <TablePicker
                        ref={el => this._tablePicker = el}
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

module.exports = createDataContainer(TablePickerSynced, (props: TablePickerSyncedProps) => {
    return [
        {watch: getSdk().base, key: 'tables'},
    ];
}, [
    'focus',
    'blur',
    'click',
]);
