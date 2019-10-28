/** @module @airtable/blocks/ui: Input */ /** */
import * as React from 'react';
import {spawnInvariantViolationError, spawnError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import {ReactRefType} from '../private_utils';
import Input, {
    inputStylePropTypes,
    InputStyleProps,
    sharedInputPropTypes,
    SharedInputProps,
} from './input';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * @typedef {object} InputSyncedProps
 */
interface InputSyncedProps extends SharedInputProps, InputStyleProps {
    /** The key, or path to a key, in global config. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the `UI.Input` component that syncs with global config.
 *
 * @example
 * ```js
 * import {UI} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React from 'react';
 *
 * function ApiKeyInput() {
 *     return (
 *         <UI.InputSynced
 *             globalConfigKey="apiKey"
 *             disabled={!canEditApiKey}
 *         />
 *     );
 * }
 * ```
 */
class InputSynced extends React.Component<InputSyncedProps> {
    /** @hidden */
    static defaultProps = {
        type: 'text',
        spellCheck: true,
    };

    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedInputPropTypes,
        ...inputStylePropTypes,
    };
    /** @internal */
    _input: ReactRefType<typeof Input> | null;
    /** @hidden */
    constructor(props: InputSyncedProps) {
        super(props);
        this._input = null;
    }
    /** */
    focus() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to focus');
        }
        this._input.focus();
    }
    /** */
    blur() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to blur');
        }
        this._input.blur();
    }
    /** */
    click() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to click');
        }
        this._input.click();
    }
    /** */
    select() {
        if (!this._input) {
            throw spawnInvariantViolationError('No input to select');
        }
        this._input.select();
    }
    /** @hidden */
    render() {
        const {globalConfigKey, disabled, onChange, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    let inputValue;
                    if (value === null || value === undefined) {
                        // If an input gets null or undefined for value, React treats it as uncontrolled
                        // and will throw warnings when it becomes controlled.
                        inputValue = '';
                    } else if (typeof value === 'string') {
                        inputValue = value;
                    } else {
                        throw spawnError(
                            'InputSynced only works with a global config value that is a string, null or undefined.',
                        );
                    }

                    return (
                        <Input
                            ref={el => (this._input = el)}
                            disabled={disabled || !canSetValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setValue(e.target.value);
                                if (onChange) {
                                    onChange(e);
                                }
                            }}
                            value={inputValue}
                            {...restOfProps}
                        />
                    );
                }}
            />
        );
    }
}

export default InputSynced;
