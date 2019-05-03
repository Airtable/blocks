// @flow
import getSdk from '../get_sdk';

import PropTypes from 'prop-types';

import type {GlobalConfigKey} from '../global_config';
import type {WatchDependency} from './create_data_container';

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

export default globalConfigSyncedComponentHelpers;
