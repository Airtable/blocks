/** @hidden */ /** */
import * as React from 'react';
import {type GlobalConfigKey, type GlobalConfigValue} from '../../shared/types/global_config';
import {type SdkMode} from '../../sdk_mode';
import withHooks from '../../shared/ui/with_hooks';
import {useSdk} from '../../shared/ui/sdk_context';
import globalConfigSyncedComponentHelpers from '../../shared/ui/global_config_synced_component_helpers';

/** @hidden */
interface SyncedProps<SdkModeT extends SdkMode> {
    globalConfigKey: GlobalConfigKey;
    render: (arg1: {
        value: unknown;
        canSetValue: boolean;
        setValue: (newValue: GlobalConfigValue | undefined) => void;
    }) => React.ReactElement;
    /** @internal injected by withHooks */
    sdk: SdkModeT['SdkT'];
}

/** @hidden */
export class Synced<SdkModeT extends SdkMode> extends React.Component<SyncedProps<SdkModeT>> {
    /** @hidden */
    constructor(props: SyncedProps<SdkModeT>) {
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

export default withHooks<{sdk: SdkMode['SdkT']}, SyncedProps<SdkMode>, Synced<SdkMode>>(
    Synced,
    (props) => {
        globalConfigSyncedComponentHelpers.useDefaultWatchesForSyncedComponent(
            props.globalConfigKey,
        );
        return {
            sdk: useSdk(),
        };
    },
);
