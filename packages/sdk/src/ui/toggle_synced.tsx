/** @module @airtable/blocks/ui: Toggle */ /** */
import * as React from 'react';
import {spawnInvariantViolationError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import {ReactRefType} from '../private_utils';
import Toggle, {
    sharedTogglePropTypes,
    toggleStylePropTypes,
    SharedToggleProps,
    ToggleStyleProps,
} from './toggle';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/** */
interface ToggleSyncedProps extends SharedToggleProps, ToggleStyleProps {
    /** A string key or array key path in {@link GlobalConfig}. The switch option will always reflect the boolean value stored in `globalConfig` for this key. Toggling the switch will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A toggleable switch for controlling boolean values, synced with {@link GlobalConfig}. Functionally analogous to a checkbox.
 *
 * @example
 * ```js
 * import {ToggleSynced, useWatchable} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React from 'react';
 *
 * function Block() {
 *     useWatchable(globalConfig, ['isEnabled']);
 *     return (
 *         <Toggle
 *             globalConfigKey="isEnabled"
 *             label={globalConfig.get('isEnabled') ? 'On' : 'Off'}
 *         />
 *     );
 * }
 * ```
 */
class ToggleSynced extends React.Component<ToggleSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedTogglePropTypes,
        ...toggleStylePropTypes,
    };
    /** @internal */
    _toggle: ReactRefType<typeof Toggle> | null;
    /** @hidden */
    constructor(props: ToggleSyncedProps) {
        super(props);
        // TODO (stephen): use React.forwardRef
        this._toggle = null;
    }
    /** */
    focus() {
        if (!this._toggle) {
            throw spawnInvariantViolationError('No toggle to focus');
        }
        this._toggle.focus();
    }
    /** */
    blur() {
        if (!this._toggle) {
            throw spawnInvariantViolationError('No toggle to blur');
        }
        this._toggle.blur();
    }
    /** */
    click() {
        if (!this._toggle) {
            throw spawnInvariantViolationError('No toggle to click');
        }
        this._toggle.click();
    }
    /** @hidden */
    render() {
        const {disabled, globalConfigKey, onChange, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <Toggle
                        {...restOfProps}
                        ref={el => (this._toggle = el)}
                        value={!!value}
                        onChange={newValue => {
                            setValue(newValue);
                            if (onChange) {
                                onChange(newValue);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                    />
                )}
            />
        );
    }
}

export default ToggleSynced;
