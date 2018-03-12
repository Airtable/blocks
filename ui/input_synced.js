// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const Input = require('client/blocks/sdk/ui/input');
const Synced = require('client/blocks/sdk/ui/synced');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

type InputSyncedProps = {
    type: ?string,
    globalConfigKey: GlobalConfigKey,
    placeholder?: string,
    onChange?: (SyntheticInputEvent) => void,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
    spellCheck: ?boolean,
};

/** */
class InputSynced extends React.Component {
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
                render={({value, canSetValue, setValue}) => (
                    <Input
                        ref={el => this._input = el}
                        // If an input gets "null" for value, React treats it as uncontrolled
                        // and will throw warnings when it becomes controlled.
                        value={value === null ? '' : value}
                        disabled={this.props.disabled || !canSetValue}
                        onChange={(e: SyntheticInputEvent) => {
                            setValue(e.target.value);
                            if (this.props.onChange) {
                                this.props.onChange(e);
                            }
                        }}
                        spellCheck={this.props.spellCheck}
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

InputSynced.defaultProps = {
    type: 'text',
    spellCheck: true,
};

module.exports = InputSynced;
