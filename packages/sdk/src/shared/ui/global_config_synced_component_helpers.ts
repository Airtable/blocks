import {BlockRunContextType} from '../../base/types/airtable_interface';
import {type GlobalConfigKey} from '../types/global_config';
import {type BaseSdkMode} from '../../sdk_mode';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/** @hidden */
const globalConfigSyncedComponentHelpers = {
    useDefaultWatchesForSyncedComponent(globalConfigKey: GlobalConfigKey): void {
        const sdk = useSdk();
        const {globalConfig, session} = sdk;
        const runContext = sdk.getBlockRunContext();
        useWatchable(globalConfig, [globalConfig.__getTopLevelKey(globalConfigKey)]);
        useWatchable(session, ['permissionLevel']);

        const viewIfInViewContext =
            runContext.type === BlockRunContextType.VIEW
                ? (sdk as BaseSdkMode['SdkT']).base
                      .getTableById(runContext.tableId)
                      .getViewById(runContext.viewId)
                : null;
        useWatchable(viewIfInViewContext, ['isLockedView']);
    },
};

export default globalConfigSyncedComponentHelpers;
