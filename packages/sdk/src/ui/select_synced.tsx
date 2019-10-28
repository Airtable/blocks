/** @module @airtable/blocks/ui: Select */ /** */
import * as React from 'react';
import {spawnInvariantViolationError, spawnError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import {ReactRefType} from '../private_utils';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Select, {
    sharedSelectPropTypes,
    selectStylePropTypes,
    SharedSelectProps,
    SelectStyleProps,
} from './select';
import Synced from './synced';

/**
 * @typedef {object} SelectSyncedProps
 */
interface SelectSyncedProps extends SharedSelectProps, SelectStyleProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected option will always reflect the value stored in `globalConfig` for this key. Selecting a new option will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * Dropdown menu component synced with {@link GlobalConfig}. A wrapper around `<select>` that fits in with Airtable's user interface.
 *
 * @example
 * ```js
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
 * ```
 */
class SelectSynced extends React.Component<SelectSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedSelectPropTypes,
        ...selectStylePropTypes,
    };
    /** @internal */
    _select: ReactRefType<typeof Select> | null;
    /** @hidden */
    constructor(props: SelectSyncedProps) {
        super(props);
        // TOReactRefType: use React.forwardRef
        this._select = null;
    }
    /** */
    focus() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to focus');
        }
        this._select.focus();
    }
    /** */
    blur() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to blur');
        }
        this._select.blur();
    }
    /** */
    click() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to click');
        }
        this._select.click();
    }
    /** @hidden */
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
