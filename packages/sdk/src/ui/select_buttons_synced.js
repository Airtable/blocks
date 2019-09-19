// @flow
import * as React from 'react';
import {spawnError} from '../error_utils';
import {type GlobalConfigKey} from '../global_config';
import SelectButtons, {
    sharedSelectButtonsPropTypes,
    type SharedSelectButtonsProps,
} from './select_buttons';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';

/**
 * @typedef {object} SelectButtonsSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected option will always reflect the value stored in `globalConfig` for this key. Selecting a new option will update `globalConfig`.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {function} [onChange] A function to be called when the selected option changes.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type SelectButtonsSyncedProps = {|
    globalConfigKey: GlobalConfigKey,
    ...SharedSelectButtonsProps,
|};

/** */
class SelectButtonsSynced extends React.Component<SelectButtonsSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedSelectButtonsPropTypes,
    };
    props: SelectButtonsSyncedProps;
    render() {
        const {globalConfigKey, onChange, disabled, ...restOfProps} = this.props;

        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    let selectValue;
                    if (value === null || value === undefined) {
                        selectValue = null;
                    } else if (
                        typeof value === 'string' ||
                        typeof value === 'number' ||
                        typeof value === 'boolean'
                    ) {
                        selectValue = value;
                    } else {
                        throw spawnError(
                            'SelectButtonsSynced only works with a global config value that is a string, number, boolean, null or undefined.',
                        );
                    }

                    return (
                        <SelectButtons
                            {...restOfProps}
                            value={selectValue}
                            onChange={newValue => {
                                setValue(newValue);
                                if (onChange) {
                                    onChange(newValue);
                                }
                            }}
                            disabled={disabled || !canSetValue}
                        />
                    );
                }}
            />
        );
    }
}

export default SelectButtonsSynced;
