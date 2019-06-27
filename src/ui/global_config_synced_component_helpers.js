// @flow
import PropTypes from 'prop-types';
import getSdk from '../get_sdk';
import {type GlobalConfigKey} from '../global_config';
import useWatchable from './use_watchable';

const globalConfigSyncedComponentHelpers = {
    globalConfigKeyPropType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    useDefaultWatchesForSyncedComponent(globalConfigKey: GlobalConfigKey): void {
        const {globalConfig, session} = getSdk();
        useWatchable(globalConfig, [globalConfig.__getTopLevelKey(globalConfigKey)]);
        useWatchable(session, ['permissionLevel']);
    },
};

export default globalConfigSyncedComponentHelpers;
