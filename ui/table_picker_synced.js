// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const TablePicker = require('client/blocks/sdk/ui/table_picker');
const permissions = require('client_server_shared/permissions');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

const {PropTypes} = React;

import type TableModel from 'client/blocks/sdk/models/table';
import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type TablePickerSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    shouldAllowPickingNone?: boolean,
    onChange?: (tableModel: TableModel | null) => void,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class TablePickerSynced extends React.Component {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: TablePickerSyncedProps;
    _onChange(table: TableModel | null) {
        const tableId = table ? table.id : null;
        getSdk().globalConfig.set(this.props.globalConfigKey, tableId);

        if (this.props.onChange) {
            this.props.onChange(table);
        }
    }
    _getSelectedTable(): TableModel | null {
        const tableId = getSdk().globalConfig.get(this.props.globalConfigKey);
        return (typeof tableId === 'string') ? getSdk().base.getTableById(tableId) : null;
    }
    render() {
        const table = this._getSelectedTable();
        return (
            <TablePicker
                table={table}
                shouldAllowPickingNone={this.props.shouldAllowPickingNone}
                onChange={this._onChange.bind(this)}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || getSdk().base.permissionLevel === permissions.API_LEVELS.READ}
            />
        );
    }
}

module.exports = createDataContainer(TablePickerSynced, (props: TablePickerSyncedProps) => {
    return [
        {watch: getSdk().base, key: 'tables'},
        ...globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey),
    ];
});
