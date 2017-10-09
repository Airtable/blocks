// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const ViewPicker = require('client/blocks/sdk/ui/view_picker');
const TableModel = require('client/blocks/sdk/models/table');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');
const permissions = require('client_server_shared/permissions');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

import type ViewModel from 'client/blocks/sdk/models/view';
import type {ApiViewType} from 'client_server_shared/view_types/api_view_types';
import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type ViewPickerSyncedProps = {
    table: ?TableModel,
    globalConfigKey: GlobalConfigKey,
    shouldAllowPickingNone?: boolean,
    onChange?: (viewModel: ViewModel | null) => void,
    allowedTypes?: Array<ApiViewType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class ViewPickerSynced extends React.Component {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(_.values(ApiViewTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: ViewPickerSyncedProps;
    _onChange: (view: ViewModel | null) => void;
    _viewPicker: ViewPicker | null;
    constructor(props: ViewPickerSyncedProps) {
        super(props);

        this._viewPicker = null;
        this._onChange = this._onChange.bind(this);
    }
    focus() {
        invariant(this._viewPicker, 'No view picker to focus');
        this._viewPicker.focus();
    }
    blur() {
        invariant(this._viewPicker, 'No view picker to blur');
        this._viewPicker.blur();
    }
    click() {
        invariant(this._viewPicker, 'No view picker to click');
        this._viewPicker.click();
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
        if (!table || table.isDeleted) {
            return null;
        }
        const viewId = getSdk().globalConfig.get(this.props.globalConfigKey);
        return (typeof viewId === 'string') && table ? table.getViewById(viewId) : null;
    }
    render() {
        const {table, shouldAllowPickingNone} = this.props;
        const view = this._getSelectedView();
        const restOfProps = _.omit(this.props, Object.keys(ViewPickerSynced.propTypes));
        return (
            <ViewPicker
                ref={el => this._viewPicker = el}
                table={table}
                view={view}
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

module.exports = createDataContainer(ViewPickerSynced, (props: ViewPickerSyncedProps) => {
    return [
        {watch: props.table, key: 'views'},
        {watch: getSdk().base, key: 'tables'},
        ...globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey),
    ];
}, [
    'focus',
    'blur',
    'click',
]);
