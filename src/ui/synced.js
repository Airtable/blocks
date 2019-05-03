// @flow
import React from './react';
import PropTypes from 'prop-types';
import createDataContainer from './create_data_container';
import getSdk from '../get_sdk';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

import type {GlobalConfigKey} from '../global_config';
import type {BlockKvValue} from 'client_server_shared/blocks/block_kv_helpers';

type SyncedProps = {
    globalConfigKey: GlobalConfigKey,
    render: ({
        value: mixed,
        canSetValue: boolean,
        setValue: BlockKvValue => void,
    }) => React.Element<*>,
};

/** */
class Synced extends React.Component<SyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        render: PropTypes.func.isRequired,
    };
    props: SyncedProps;
    _setValue: BlockKvValue => void;
    constructor(props: SyncedProps) {
        super(props);

        this._setValue = this._setValue.bind(this);
    }
    _setValue(newValue: BlockKvValue) {
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

export default createDataContainer(Synced, (props: SyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(
        props.globalConfigKey,
    );
});
