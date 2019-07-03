// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {invariant} from '../error_utils';
import {type GlobalConfigKey} from '../global_config';
import Toggle, {type ToggleTheme} from './toggle';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * @typedef {object} ToggleSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The switch option will always reflect the boolean value stored in `globalConfig` for this key. Toggling the switch will update `globalConfig`.
 * @property {function} [onChange] A function to be called when the switch is toggled. This should only be used for side effects.
 * @property {React.Node} [label] The label node for the switch.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the switch.
 * @property {Toggle.themes.GREEN | Toggle.themes.BLUE | Toggle.themes.RED | Toggle.themes.YELLOW | Toggle.themes.GRAY} [theme=Toggle.themes.GREEN] The color theme for the switch.
 * @property {string} [id] The ID of the switch element.
 * @property {string} [className] Additional class names to apply to the switch.
 * @property {object} [style] Additional styles to apply to the switch.
 * @property {number | string} [tabIndex] Indicates if the switch can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-label] The label for the switch. Use this if the switch lacks a visible text label.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type ToggleSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    onChange?: boolean => void,
    label?: React.Node,
    disabled?: boolean,
    theme?: ToggleTheme,
    id?: string,
    className?: string,
    style?: Object,
    tabIndex?: number | string,
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
};

/**
 * A toggleable switch for controlling boolean values, synced with {@link GlobalConfig}. Functionally analogous to a checkbox.
 *
 * @example
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
 */
class ToggleSynced extends React.Component<ToggleSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        label: PropTypes.node,
        theme: PropTypes.oneOf(Object.keys(Toggle.themes)),
        id: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        'aria-label': PropTypes.string,
        'aria-labelledby': PropTypes.string,
        'aria-describedby': PropTypes.string,
    };
    _toggle: Toggle | null;
    constructor(props: ToggleSyncedProps) {
        super(props);
        this._toggle = null;
    }
    focus() {
        invariant(this._toggle, 'No toggle to focus');
        this._toggle.focus();
    }
    blur() {
        invariant(this._toggle, 'No toggle to blur');
        this._toggle.blur();
    }
    click() {
        invariant(this._toggle, 'No toggle to click');
        this._toggle.click();
    }
    render() {
        const {
            globalConfigKey,
            onChange,
            disabled,
            label,
            theme,
            id,
            className,
            style,
            tabIndex,
        } = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <Toggle
                        ref={el => (this._toggle = el)}
                        value={!!value}
                        onChange={newValue => {
                            setValue(newValue);
                            if (onChange) {
                                onChange(newValue);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                        label={label}
                        theme={theme}
                        id={id}
                        className={className}
                        style={style}
                        tabIndex={tabIndex}
                        aria-label={this.props['aria-label']}
                        aria-labelledby={this.props['aria-labelledby']}
                        aria-describedby={this.props['aria-describedby']}
                    />
                )}
            />
        );
    }
}

export default ToggleSynced;
