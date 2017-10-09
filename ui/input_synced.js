// @flow
const {h, _} = require('client_server_shared/h_');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const Input = require('client/blocks/sdk/ui/input');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';
import type {InputValue} from 'client/blocks/sdk/ui/input';

type InputSyncedProps = {
    type: ?string,
    globalConfigKey: GlobalConfigKey,
    placeholder?: string,
    // TODO(jb): update this when we remove the old input behavior.
    onChange?: (InputValue | SyntheticInputEvent) => void,
    shouldPassEventToOnChange?: boolean,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
    spellCheck: ?boolean,
};

class InputSynced extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(Object.keys(Input.validTypesSet)),
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        shouldPassEventToOnChange: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        spellCheck: PropTypes.bool,
    };
    props: InputSyncedProps;
    _onChange: (InputValue | SyntheticInputEvent) => void;
    _input: Input | null;
    constructor(props: InputSyncedProps) {
        super(props);

        this._input = null;
        this._onChange = this._onChange.bind(this);
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
    _onChange(e: (InputValue | SyntheticInputEvent)) {
        let value;
        if (this.props.shouldPassEventToOnChange) {
            e = ((e: any): SyntheticInputEvent); // eslint-disable-line flowtype/no-weak-types
            value = e.target.value;
        } else {
            value = e;
        }
        getSdk().globalConfig.set(this.props.globalConfigKey, value);

        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }
    render() {
        const {base, globalConfig} = getSdk();

        let value = globalConfig.get(this.props.globalConfigKey);
        if (value === null) {
            // If an input gets "null" for value, React treats it as uncontrolled
            // and will throw warnings when it becomes controlled.
            value = '';
        }

        const restOfProps = _.omit(this.props, Object.keys(InputSynced.propTypes));

        return (
            <Input
                ref={el => this._input = el}
                type={this.props.type}
                value={value}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || base.permissionLevel === permissions.API_LEVELS.READ}
                onChange={this._onChange}
                shouldPassEventToOnChange={this.props.shouldPassEventToOnChange}
                spellCheck={this.props.spellCheck}
                {...restOfProps}
            />
        );
    }
}

InputSynced.defaultProps = {
    type: 'text',
    spellCheck: true,
};

module.exports = createDataContainer(InputSynced, (props: InputSyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
}, [
    'focus',
    'blur',
    'click',
]);
