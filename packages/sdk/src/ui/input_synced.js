// @flow
import * as React from 'react';
import {invariant, spawnError} from '../error_utils';
import {type GlobalConfigKey} from '../global_config';
import Input, {
    stylePropTypes,
    type StyleProps,
    sharedInputPropTypes,
    type SharedInputProps,
} from './input';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * @typedef {object} InputSyncedProps
 * @property {string|Array<string>} globalConfigKey The key, or path to a key, in global config.
 * @property {function} onChange A function to be called when the input changes.
 * @property {string} [type='text'] The `type` for the input. Defaults to `text`.
 * @property {string} [placeholder] The placeholder for the input.
 * @property {object} [style] Additional styles to apply to the input.
 * @property {string} [className] Additional class names to apply to the input, separated by spaces.
 * @property {boolean} [disabled] The `disabled` attribute.
 * @property {boolean} [required] The `required` attribute.
 * @property {boolean} [spellCheck] The `spellcheck` attribute.
 * @property {string} [name] The `name` attribute.
 * @property {string} [id] The `id` attribute.
 * @property {boolean} [autoFocus] The `autoFocus` attribute.
 * @property {number | string} [max] The `max` attribute.
 * @property {number} [maxLength] The `maxLength` attribute.
 * @property {number | string} [min] The `min` attribute.
 * @property {number} [minLength] The `minLength` attribute.
 * @property {number | string} [step] The `step` attribute.
 * @property {string} [pattern] The `pattern` attribute.
 * @property {boolean} [readOnly] The `readOnly` attribute.
 * @property {string} [autoComplete] The `autoComplete` attribute.
 * @property {number | string} [tabIndex] The `tabindex` attribute.
 * @property {string} [aria-labelledby] A space separated list of label element IDs.
 * @property {string} [aria-describedby] A space separated list of description element IDs.
 */
type InputSyncedProps = {|
    globalConfigKey: GlobalConfigKey,
    ...SharedInputProps,
    ...StyleProps,
|};

/**
 * A wrapper around the `UI.Input` component that syncs with global config.
 *
 * @example
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
 */
class InputSynced extends React.Component<InputSyncedProps> {
    static defaultProps = {
        type: 'text',
        spellCheck: true,
    };

    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedInputPropTypes,
        ...stylePropTypes,
    };
    props: InputSyncedProps;
    _input: React.ElementRef<typeof Input> | null;
    constructor(props: InputSyncedProps) {
        super(props);
        this._input = null;
    }
    focus() {
        invariant(this._input, 'No input to focus');
        this._input.focus();
    }
    blur() {
        invariant(this._input, 'No input to blur');
        this._input.blur();
    }
    click() {
        invariant(this._input, 'No input to click');
        this._input.click();
    }
    select() {
        invariant(this._input, 'No input to select');
        this._input.select();
    }
    render() {
        const {globalConfigKey, disabled, onChange, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    let inputValue;
                    if (value === null || value === undefined) {
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
                            onChange={(e: SyntheticInputEvent<HTMLInputElement>) => {
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
