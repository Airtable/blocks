// @flow
const React = require('client/blocks/sdk/ui/react');
const getSdk = require('client/blocks/sdk/get_sdk');

const {PropTypes} = React;

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';
import type {WatchDependency} from 'client/blocks/sdk/ui/create_data_container';

const globalConfigSyncedComponentHelpers = {
    globalConfigKeyPropType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    getDefaultWatchesForSyncedComponent(globalConfigKey: GlobalConfigKey): Array<?WatchDependency> {
        const {globalConfig, base} = getSdk();
        return [
            {watch: globalConfig, key: globalConfig.__getTopLevelKey(globalConfigKey)},
            {watch: base, key: 'permissionLevel'},
        ];
    },
};

module.exports = globalConfigSyncedComponentHelpers;
