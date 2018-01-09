// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';
import type {BlockKvValue} from 'client_server_shared/blocks/block_kv_helpers';

type SyncedProps = {
    globalConfigKey: GlobalConfigKey,
    render: ({
        value: mixed,
        canSetValue: boolean,
        setValue: (BlockKvValue) => void,
    }) => mixed,
};

class Synced extends React.Component {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        render: PropTypes.func.isRequired,
    };
    props: SyncedProps;
    _setValue: (BlockKvValue) => void;
    constructor(props: SyncedProps) {
        super(props);

        this._input = null;
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

module.exports = createDataContainer(Synced, (props: SyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});
