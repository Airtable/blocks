// @flow
const {h, _} = require('client_server_shared/h_');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const TablePicker = require('client/blocks/sdk/ui/table_picker');
const permissions = require('client_server_shared/permissions');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

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
    _tablePicker: TablePicker | null;
    _onChange: (table: TableModel | null) => void;
    constructor(props: TablePickerSyncedProps) {
        super(props);

        this._tablePicker = null;
        this._onChange = this._onChange.bind(this);
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
    _getSelectedTable(): TableModel | null {
        const tableId = getSdk().globalConfig.get(this.props.globalConfigKey);
        return (typeof tableId === 'string') ? getSdk().base.getTableById(tableId) : null;
    }
    render() {
        const table = this._getSelectedTable();
        const restOfProps = _.omit(this.props, Object.keys(TablePickerSynced.propTypes));
        return (
            <TablePicker
                ref={el => this._tablePicker = el}
                table={table}
                shouldAllowPickingNone={this.props.shouldAllowPickingNone}
                onChange={this._onChange}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || getSdk().base.permissionLevel === permissions.API_LEVELS.READ}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(TablePickerSynced, (props: TablePickerSyncedProps) => {
    return [
        {watch: getSdk().base, key: 'tables'},
        ...globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey),
    ];
}, [
    'focus',
    'blur',
    'click',
]);
