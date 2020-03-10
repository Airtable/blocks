import {GlobalConfigKey, GlobalConfigValue} from '../types/global_config';
import getSdk from '../get_sdk';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * A hook for syncing a component to {@link GlobalConfig}.
 * Useful if you are dealing with a custom input component and can‘t use one of our `Synced` components.
 *
 * @param globalConfigKey
 * @example
 * ```js
 * import {useBase, useSynced} from '@airtable/blocks/ui';
 *
 * function CustomInputSynced() {
 *    const [value, setValue, canSetValue] = useSynced('myGlobalConfigKey');
 *
 *     return (
 *         <input
 *              type="text"
 *              value={value}
 *              onChange={e => setValue(e.target.value)}
 *              disabled={!canSetValue}
 *          />
 *     );
 * }
 * ```
 * @docsPath UI/hooks/useSynced
 * @hook
 */
export default function useSynced(
    globalConfigKey: GlobalConfigKey,
): [unknown, (newValue: GlobalConfigValue | undefined) => void, boolean] {
    globalConfigSyncedComponentHelpers.useDefaultWatchesForSyncedComponent(globalConfigKey);
    const {globalConfig} = getSdk();
    const value = globalConfig.get(globalConfigKey);
    const canSetValue = globalConfig.hasPermissionToSet(globalConfigKey);

    function setValue(newValue?: GlobalConfigValue | undefined) {
        getSdk().globalConfig.setAsync(globalConfigKey, newValue);
    }

    return [value, setValue, canSetValue];
}
