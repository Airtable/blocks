// @flow
const {h, _} = require('client_server_shared/h_');
const React = require('client/blocks/sdk/ui/react');
const Toggle = require('client/blocks/sdk/ui/toggle');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

const {PropTypes} = React;

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type ToggleSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    label?: React.Element<*>,
    theme?: string,
    onChange?: boolean => void,
    disabled?: boolean,
    className?: string,
    style?: Object,
    tabIndex?: number,
};

class ToggleSynced extends React.Component {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        label: PropTypes.node,
        theme: PropTypes.oneOf(_.values(Toggle.themes)),
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.number,
    };
    _onChange: boolean => void;
    constructor(props: ToggleSyncedProps) {
        super(props);

        this._onChange = this._onChange.bind(this);
    }
    _onChange(value: boolean) {
        getSdk().globalConfig.set(this.props.globalConfigKey, value);

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    render() {
        const {base, globalConfig} = getSdk();

        const {
            globalConfigKey,
            disabled,
            onChange, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;

        const value = globalConfig.get(globalConfigKey) || false;
        return (
            <Toggle
                value={value}
                disabled={disabled || base.permissionLevel === permissions.API_LEVELS.READ}
                onChange={this._onChange}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(ToggleSynced, (props: ToggleSyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});
