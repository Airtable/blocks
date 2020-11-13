import PropTypes from 'prop-types';
import {GlobalConfigKey} from '../types/global_config';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/** @hidden */
const globalConfigSyncedComponentHelpers = {
    globalConfigKeyPropType: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    ]).isRequired,
    useDefaultWatchesForSyncedComponent(globalConfigKey: GlobalConfigKey): void {
        const sdk = useSdk();
        const {globalConfig, session} = sdk;
        useWatchable(globalConfig, [globalConfig.__getTopLevelKey(globalConfigKey)]);
        useWatchable(session, ['permissionLevel']);
    },
};

export default globalConfigSyncedComponentHelpers;
