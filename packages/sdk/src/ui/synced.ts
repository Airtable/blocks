/** @hidden */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {GlobalConfigKey, GlobalConfigValue} from '../types/global_config';
import Sdk from '../sdk';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import withHooks from './with_hooks';
import {useSdk} from './sdk_context';

/** @hidden */
interface SyncedProps {
    globalConfigKey: GlobalConfigKey;
    render: (arg1: {
        value: unknown;
        canSetValue: boolean;
        setValue: (newValue: GlobalConfigValue | undefined) => void;
    }) => React.ReactElement;
    /** @internal injected by withHooks */
    sdk: Sdk;
}

/** @hidden */
export class Synced extends React.Component<SyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        render: PropTypes.func.isRequired,
    };
    /** @hidden */
    constructor(props: SyncedProps) {
        super(props);

        this._setValue = this._setValue.bind(this);
    }
    /** @internal */
    _setValue(newValue?: GlobalConfigValue | undefined) {
        this.props.sdk.globalConfig.setAsync(this.props.globalConfigKey, newValue);
    }
    /** @hidden */
    render() {
        const {globalConfig} = this.props.sdk;
        const value = globalConfig.get(this.props.globalConfigKey);
        const canSetValue = globalConfig.hasPermissionToSet(this.props.globalConfigKey);
        return this.props.render({
            value,
            canSetValue,
            setValue: this._setValue,
        });
    }
}

export default withHooks<{sdk: Sdk}, SyncedProps, Synced>(Synced, props => {
    globalConfigSyncedComponentHelpers.useDefaultWatchesForSyncedComponent(props.globalConfigKey);
    return {
        sdk: useSdk(),
    };
});
