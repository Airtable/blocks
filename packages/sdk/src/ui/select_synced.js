// @flow
import * as React from 'react';
import {invariant, spawnError} from '../error_utils';
import {type GlobalConfigKey} from '../global_config';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Select, {
    sharedSelectPropTypes,
    stylePropTypes,
    type SharedSelectProps,
    type StyleProps,
} from './select';
import Synced from './synced';

/**
 * @typedef {object} SelectSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected option will always reflect the value stored in `globalConfig` for this key. Selecting a new option will update `globalConfig`.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {function} [onChange] A function to be called when the selected option changes. This should only be used for side effects.
 * @property {string} [autoFocus] The `autoFocus` attribute.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {string} [id] The `id` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type SelectSyncedProps = {|
    globalConfigKey: GlobalConfigKey,
    ...SharedSelectProps,
    ...StyleProps,
|};

/**
 * Dropdown menu component synced with {@link GlobalConfig}. A wrapper around `<select>` that fits in with Airtable's user interface.
 *
 * @example
 * import {SelectSynced} from '@airtable/blocks/ui';
 * import React from 'react';
 *
 * function ColorPickerSynced() {
 *     return (
 *         <label>
 *             <div style={{marginBottom: 8, fontWeight: 500}}>Color</div>
 *             <SelectSynced
 *                 globalConfigKey='color'
 *                 options={[
 *                     {value: null, label: 'Pick a color...', disabled: true},
 *                     {value: 'red', label: 'red'},
 *                     {value: 'green', label: 'green'},
 *                     {value: 'blue', label: 'blue'},
 *                 ]}
 *             />
 *         </label>
 *     );
 * }
 */
class SelectSynced extends React.Component<SelectSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedSelectPropTypes,
        ...stylePropTypes,
    };
    props: SelectSyncedProps;
    _select: React.ElementRef<typeof Select> | null;
    constructor(props: SelectSyncedProps) {
        super(props);
        this._select = null;
    }
    focus() {
        invariant(this._select, 'No select to focus');
        this._select.focus();
    }
    blur() {
        invariant(this._select, 'No select to blur');
        this._select.blur();
    }
    click() {
        invariant(this._select, 'No select to click');
        this._select.click();
    }
    render() {
        const {globalConfigKey, disabled, onChange, ...restOfProps} = this.props;

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
                            'SelectSynced only works with a global config value that is a string, number, boolean, null or undefined.',
                        );
                    }

                    return (
                        <Select
                            {...restOfProps}
                            ref={el => (this._select = el)}
                            value={selectValue}
                            onChange={newValue => {
                                if (newValue === undefined) {
                                    newValue = null;
                                }
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

export default SelectSynced;
