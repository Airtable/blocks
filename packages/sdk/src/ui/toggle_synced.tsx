/** @module @airtable/blocks/ui: Toggle */ /** */
import * as React from 'react';
import {spawnInvariantViolationError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import {ReactRefType} from '../private_utils';
import Toggle, {
    sharedTogglePropTypes,
    stylePropTypes,
    SharedToggleProps,
    StyleProps,
} from './toggle';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * @typedef {object} ToggleSyncedProps
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the switch.
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The switch option will always reflect the boolean value stored in `globalConfig` for this key. Toggling the switch will update `globalConfig`.
 * @property {string} [id] The ID of the switch element.
 * @property {React.Node} [label] The label node for the switch.
 * @property {Function} [onChange] A function to be called when the switch is toggled. This should only be used for side effects.
 * @property {number} [tabIndex] Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation.
 * @property {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW | Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.
 * @property {string} [className] Additional class names to apply to the switch.
 * @property {object} [style] Additional styles to apply to the switch.
 * @property {string} [aria-label] The label for the switch. Use this if the switch lacks a visible text label.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type ToggleSyncedProps = {globalConfigKey: GlobalConfigKey} & (SharedToggleProps) & (StyleProps);

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
        ...stylePropTypes,
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
