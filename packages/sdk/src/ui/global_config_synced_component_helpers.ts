import PropTypes from 'prop-types';
import {BlockRunContextType} from '../types/airtable_interface';
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
        const runContext = sdk.getBlockRunContext();
        useWatchable(globalConfig, [globalConfig.__getTopLevelKey(globalConfigKey)]);
        useWatchable(session, ['permissionLevel']);

        const viewIfInViewContext =
            runContext.type === BlockRunContextType.VIEW
                ? sdk.base.getTableById(runContext.tableId).getViewById(runContext.viewId)
                : null;
        useWatchable(viewIfInViewContext, ['isLockedView']);
    },
};

export default globalConfigSyncedComponentHelpers;
