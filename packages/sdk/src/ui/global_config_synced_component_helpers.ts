import PropTypes from 'prop-types';
import getSdk from '../get_sdk';
import {GlobalConfigKey} from '../types/global_config';
import useWatchable from './use_watchable';

/** @hidden */
const globalConfigSyncedComponentHelpers = {
    globalConfigKeyPropType: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    ]).isRequired,
    useDefaultWatchesForSyncedComponent(globalConfigKey: GlobalConfigKey): void {
        const {globalConfig, session} = getSdk();
        useWatchable(globalConfig, [globalConfig.__getTopLevelKey(globalConfigKey)]);
        useWatchable(session, ['permissionLevel']);
    },
};

export default globalConfigSyncedComponentHelpers;
