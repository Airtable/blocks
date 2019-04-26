// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const PropTypes = require('prop-types');
const createDataContainer = require('./create_data_container');
const getSdk = require('../../shared/get_sdk');
const globalConfigSyncedComponentHelpers = require('./global_config_synced_component_helpers');

import type {GlobalConfigKey} from '../../shared/global_config';
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

module.exports = createDataContainer(Synced, (props: SyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(
        props.globalConfigKey,
    );
});
