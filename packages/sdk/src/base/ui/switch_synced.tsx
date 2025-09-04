/** @module @airtable/blocks/ui: Switch */ /** */
import * as React from 'react';
import {GlobalConfigKey} from '../../shared/types/global_config';
import useSynced from '../../shared/ui/use_synced';
import Switch, {SharedSwitchProps} from './switch';

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
 * [[ Story id="switch--example-synced" title="Synced switch example" ]]
 *
 * @docsPath UI/components/SwitchSynced
 * @groupPath UI/components/Switch
 * @component
 */
const SwitchSynced = (props: SwitchSyncedProps, ref: React.Ref<HTMLDivElement>) => {
    const {disabled, globalConfigKey, onChange, ...restOfProps} = props;
    const [value, setValue, canSetValue] = useSynced(globalConfigKey);

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

ForwardedRefSwitchSynced.displayName = 'SwitchSynced';

export default ForwardedRefSwitchSynced;
