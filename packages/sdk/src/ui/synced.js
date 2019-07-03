// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {type GlobalConfigKey, type GlobalConfigValue} from '../global_config';
import getSdk from '../get_sdk';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import withHooks from './with_hooks';

type SyncedProps = {
    globalConfigKey: GlobalConfigKey,
    render: ({
        value: mixed,
        canSetValue: boolean,
        setValue: GlobalConfigValue => void,
    }) => React.Element<*>,
};

/** @private */
class Synced extends React.Component<SyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        render: PropTypes.func.isRequired,
    };
    props: SyncedProps;
    _setValue: GlobalConfigValue => void;
    constructor(props: SyncedProps) {
        super(props);

        this._setValue = this._setValue.bind(this);
    }
    _setValue(newValue: GlobalConfigValue) {
        getSdk().globalConfig.set(this.props.globalConfigKey, newValue);
    }
    render() {
        const {globalConfig} = getSdk();
        const value = globalConfig.get(this.props.globalConfigKey);
        const canSetValue = globalConfig.canSet(this.props.globalConfigKey);
        return this.props.render({
            value,
            canSetValue,
            setValue: this._setValue,
        });
    }
}

export default withHooks<SyncedProps, {}, Synced>(Synced, props => {
    globalConfigSyncedComponentHelpers.useDefaultWatchesForSyncedComponent(props.globalConfigKey);
    return {};
});
