// @flow
import * as React from 'react';
import {invariant} from '../error_utils';
import Select from './select';
import {
    SelectAndSelectButtonsSyncedPropTypes,
    type SelectAndSelectButtonsSyncedProps,
} from './select_and_select_buttons_helpers';
import Synced from './synced';

/**
 * @typedef {object} SelectSyncedProps
 * @property {GlobalConfigKey} globalConfigKey A string key or array key path in {@link GlobalConfig}. The selected option will always reflect the value stored in `globalConfig` for this key. Selecting a new option will update `globalConfig`.
 * @property {function} [onChange] A function to be called when the selected option changes. This should only be used for side effects.
 * @property {Array.<SelectOption>} options The list of select options.
 * @property {boolean} [disabled] If set to `true`, the user cannot interact with the select.
 * @property {string} [id] The ID of the select element.
 * @property {string} [className] Additional class names to apply to the select.
 * @property {object} [style] Additional styles to apply to the select.
 * @property {number | string} [tabIndex] Indicates if the select can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type SelectSyncedProps = SelectAndSelectButtonsSyncedProps;

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
    static propTypes = SelectAndSelectButtonsSyncedPropTypes;
    props: SelectSyncedProps;
    _select: Select | null;
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
        const {
            globalConfigKey,
            onChange,
            options,
            disabled,
            id,
            className,
            style,
            tabIndex,
        } = this.props;

        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    if (value === undefined) {
                        value = null;
                    }
                    invariant(
                        typeof value === 'string' ||
                            typeof value === 'number' ||
                            typeof value === 'boolean' ||
                            value === null,
                        'value should be a primitive type',
                    );
                    return (
                        <Select
                            ref={el => (this._select = el)}
                            disabled={disabled || !canSetValue}
                            value={value}
                            options={options}
                            onChange={newValue => {
                                if (newValue === undefined) {
                                    newValue = null;
                                }
                                setValue(newValue);
                                if (onChange) {
                                    onChange(newValue);
                                }
                            }}
                            id={id}
                            className={className}
                            style={style}
                            tabIndex={tabIndex}
                            aria-labelledby={this.props['aria-labelledby']}
                            aria-describedby={this.props['aria-describedby']}
                        />
                    );
                }}
            />
        );
    }
}

export default SelectSynced;
