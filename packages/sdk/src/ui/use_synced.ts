/** @hidden */ /** */
import {GlobalConfigKey, GlobalConfigValue} from '../global_config';
import getSdk from '../get_sdk';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/** @hidden */
export default function useSynced(
    globalConfigKey: GlobalConfigKey,
): {
    value: unknown;
    canSetValue: boolean;
    setValue: (newValue: GlobalConfigValue | undefined) => void;
} {
    globalConfigSyncedComponentHelpers.useDefaultWatchesForSyncedComponent(globalConfigKey);
    const {globalConfig} = getSdk();
    const value = globalConfig.get(globalConfigKey);
    const canSetValue = globalConfig.hasPermissionToSet(globalConfigKey);

    function setValue(newValue?: GlobalConfigValue | undefined) {
        getSdk().globalConfig.setAsync(globalConfigKey, newValue);
    }

    return {
        value,
        canSetValue,
        setValue,
    };
}
