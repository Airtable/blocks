// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const TablePicker = require('client/blocks/sdk/ui/table_picker');
const permissions = require('client_server_shared/permissions');

import type TableModel from 'client/blocks/sdk/models/table';

type TablePickerSyncedProps = {
    globalConfigKey: string,
    onChange?: (tableModel: TableModel | null) => void,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class TablePickerSynced extends React.Component {
    static propTypes = {
        globalConfigKey: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: TablePickerSyncedProps;
    componentDidMount() {
        // It is possible that since this component was last shown, the table was deleted,
        // so let's check for that before the initial render so we don't try to use a table
        // that no longer exists.
        const tableId = getSdk().globalConfig.get(this.props.globalConfigKey);
        const table = this._getSelectedTable();
        if (tableId && !table) {
            // We have a tableId, but the table no longer exists, so let's just
            // clear out the value in the globalConfig.
            this._onChange(null);
        }
    }
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
        {watch: getSdk().globalConfig, key: props.globalConfigKey},
        {watch: getSdk().base, key: 'permissionLevel'},
    ];
});
