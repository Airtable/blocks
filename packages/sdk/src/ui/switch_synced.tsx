/** @module @airtable/blocks/ui: Switch */ /** */
import * as React from 'react';
import {GlobalConfigKey} from '../global_config';
import Switch, {sharedSwitchPropTypes, SharedSwitchProps} from './switch';
import useSynced from './use_synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * Props for the {@link SwitchSynced} component. Also accepts:
 * * {@link SwitchStyleProps}
 *
 * @docsPath UI/components/SwitchSynced
 * @groupPath UI/components/Switch
 */
interface SwitchSyncedProps extends SharedSwitchProps {
    /** A string key or array key path in {@link GlobalConfig}. The switch option will always reflect the boolean value stored in `globalConfig` for this key. Toggling the switch will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A toggleable switch for controlling boolean values, synced with {@link GlobalConfig}. Similar to a checkbox.
 *
 * @example
 * ```js
 * import React from 'react';
 * import {SwitchSynced, useGlobalConfig} from '@airtable/blocks/ui';
 *
 * function Block() {
 *     const globalConfig = useGlobalConfig();
 *     return (
 *         <div>
 *             <SwitchSynced globalConfigKey="isShowingImage" label="Show image" />
 *             {globalConfig.get("isShowingImage") && (
 *                 <img src="cat.png" />
 *             )}
 *         </div>
 *     );
 * }
 * ```
 * @docsPath UI/components/SwitchSynced
 * @groupPath UI/components/Switch
 * @component
 */
const SwitchSynced = (props: SwitchSyncedProps, ref: React.Ref<HTMLDivElement>) => {
    const {disabled, globalConfigKey, onChange, ...restOfProps} = props;
    const {value, setValue, canSetValue} = useSynced(globalConfigKey);

    return (
        <Switch
            {...restOfProps}
            ref={ref}
            value={!!value}
            onChange={(newValue: boolean) => {
                setValue(newValue);
                if (onChange) {
                    onChange(newValue);
                }
            }}
            disabled={disabled || !canSetValue}
        />
    );
};

const ForwardedRefSwitchSynced = React.forwardRef(SwitchSynced);

ForwardedRefSwitchSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedSwitchPropTypes,
};

ForwardedRefSwitchSynced.displayName = 'SwitchSynced';

export default ForwardedRefSwitchSynced;
