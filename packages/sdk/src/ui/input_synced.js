// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {invariant} from '../error_utils';
import {type GlobalConfigKey} from '../global_config';
import Input from './input';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

/** @type {object}
 * @property {string} [type='text'] The `type` for the input. Defaults to `text`.
 * @property {string|Array<string>} globalConfigKey The key, or path to a key, in global config.
 * @property {string} [placeholder=''] The placeholder for the input.
 * @property {function} [onChange] A function to be called when the input changes. Note that this component will sync to global config, so you won't always need to set this.
 * @property {object} [style={}] Additional styles to apply to the input.
 * @property {string} [className=''] Additional class names to apply to the input, separated by spaces.
 * @property {boolean} [disabled=false] If set to `true`, the input will be disabled.
 * @property {boolean} [spellCheck=false] If set to `true`, the `spellcheck` property will be set on the input.
 */
type InputSyncedProps = {
    type?: string,
    globalConfigKey: GlobalConfigKey,
    placeholder?: string,
    onChange?: (SyntheticInputEvent<>) => void,
    style?: Object,
    className?: string,
    disabled?: boolean,
    spellCheck?: boolean,
};

/**
 * A wrapper around the `UI.Input` component that syncs with global config.
 *
 * @example
 * import {UI} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React from 'react';
 *
 * function ApiKeyInput() {
 *     const canEditApiKey = globalConfig.canSet('apiKey');
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
        type: PropTypes.oneOf(Object.keys(Input.validTypesSet)),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        spellCheck: PropTypes.bool,
    };
    props: InputSyncedProps;
    _input: Input | null;
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
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    const isCheckbox = this.props.type === 'checkbox';

                    const isNullOrUndefined = value === null || value === undefined;

                    const valueObj = isCheckbox
                        ? {checked: isNullOrUndefined ? false : value}
                        : {value: isNullOrUndefined ? '' : value};

                    return (
                        <Input
                            ref={el => (this._input = el)}
                            disabled={this.props.disabled || !canSetValue}
                            onChange={(e: SyntheticInputEvent<>) => {
                                setValue(isCheckbox ? e.target.checked : e.target.value);
                                if (this.props.onChange) {
                                    this.props.onChange(e);
                                }
                            }}
                            spellCheck={this.props.spellCheck}
                            {...valueObj}
                            {...restOfProps}
                        />
                    );
                }}
            />
        );
    }
}

export default InputSynced;
