// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const ViewPicker = require('client/blocks/sdk/ui/view_picker');
const TableModel = require('client/blocks/sdk/models/table');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');
const permissions = require('client_server_shared/permissions');

import type ViewModel from 'client/blocks/sdk/models/view';
import type {ApiViewType} from 'client_server_shared/view_types/api_view_types';

type ViewPickerSyncedProps = {
    table: ?TableModel,
    globalConfigKey: string,
    onChange?: (viewModel: ViewModel | null) => void,
    allowedTypes?: Array<ApiViewType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class ViewPickerSynced extends React.Component {
    static propTypes = {
        table: React.PropTypes.instanceOf(TableModel),
        globalConfigKey: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
        allowedTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(_.values(ApiViewTypes))),
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: ViewPickerSyncedProps;
    componentDidMount() {
        // It is possible that since this component was last shown, the view was deleted,
        // so let's check for that before the initial render so we don't try to use a view
        // that no longer exists.
        const viewId = getSdk().globalConfig.get(this.props.globalConfigKey);
        const view = this._getSelectedView();
        if (viewId && !view) {
            // We have a viewId, but the view no longer exists, so let's just
            // clear out the value in the globalConfig.
            this._onChange(null);
        }
    }
    componentWillReceiveProps(nextProps: ViewPickerSyncedProps) {
        const {table: newTable} = nextProps;
        const {table: currTable} = this.props;
        const newTableId = newTable ? newTable.id : null;
        const currTableId = currTable ? currTable.id : null;
        const viewId = getSdk().globalConfig.get(this.props.globalConfigKey);
        if (viewId && newTableId !== currTableId) {
            // The table that this picker is referring to changed, so we should
            // clear out the viewId value in globalConfig. This way, if the user
            // switches back to the old table, the view picker won't automatically
            // re-select the old view.
            getSdk().globalConfig.set(this.props.globalConfigKey, null);
        }
    }
    _onChange(view: ViewModel | null) {
        const viewId = view ? view.id : null;
        getSdk().globalConfig.set(this.props.globalConfigKey, viewId);

        if (this.props.onChange) {
            this.props.onChange(view);
        }
    }
    _getSelectedView(): ViewModel | null {
        const {table} = this.props;
        const viewId = getSdk().globalConfig.get(this.props.globalConfigKey);
        return (typeof viewId === 'string') && table ? table.getViewById(viewId) : null;
    }
    render() {
        const {table} = this.props;
        const view = this._getSelectedView();
        return (
            <ViewPicker
                table={table}
                view={view}
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

module.exports = createDataContainer(ViewPickerSynced, (props: ViewPickerSyncedProps) => {
    return [
        {watch: getSdk().globalConfig, key: props.globalConfigKey},
        {watch: getSdk().base, key: 'permissionLevel'},
    ];
});
