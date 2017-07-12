// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');
const SelectButtons = require('client/blocks/sdk/ui/select_buttons');
const {SelectAndSelectButtonsSyncedPropTypes} = require('client/blocks/sdk/ui/select_and_select_buttons_prop_type_helpers');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

import type {SelectOptionValue, SelectAndSelectButtonsSyncedProps as SelectButtonsSyncedProps} from 'client/blocks/sdk/ui/select_and_select_buttons_prop_type_helpers';

class SelectButtonsSynced extends React.Component {
    static propTypes = SelectAndSelectButtonsSyncedPropTypes;
    props: SelectButtonsSyncedProps;
    constructor(props: SelectButtonsSyncedProps) {
        super(props);

        this._onChange = this._onChange.bind(this);
    }
    _onChange: (value: SelectOptionValue) => void;
    _onChange(value: SelectOptionValue) {
        getSdk().globalConfig.set(this.props.globalConfigKey, value);

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    render() {
        const {
            className,
            style,
            options = [],
            globalConfigKey,
            disabled,
            // Filter these out so they're not
            // included in restOfProps:
            onChange, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;

        const {base, globalConfig} = getSdk();
        const value = globalConfig.get(globalConfigKey);

        return (
            <SelectButtons
                onChange={this._onChange}
                value={value}
                options={options}
                disabled={disabled || base.permissionLevel === permissions.API_LEVELS.READ}
                className={className}
                style={style}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(SelectButtonsSynced, (props: SelectButtonsSyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});
