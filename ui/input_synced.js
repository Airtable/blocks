// @flow
const React = require('client/blocks/sdk/ui/react');
const Input = require('client/blocks/sdk/ui/input');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

const {PropTypes} = React;

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';
import type {InputValue} from 'client/blocks/sdk/ui/input';

type InputSyncedProps = {
    type: ?string,
    globalConfigKey: GlobalConfigKey,
    placeholder?: string,
    onChange?: InputValue => void,
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
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        spellCheck: PropTypes.bool,
    };
    props: InputSyncedProps;
    _onChange: InputValue => void;
    constructor(props: InputSyncedProps) {
        super(props);

        this._onChange = this._onChange.bind(this);
    }
    _onChange(value: InputValue) {
        getSdk().globalConfig.set(this.props.globalConfigKey, value);

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    render() {
        const {base, globalConfig} = getSdk();

        const value = globalConfig.get(this.props.globalConfigKey);

        return (
            <Input
                type={this.props.type}
                value={value}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || base.permissionLevel === permissions.API_LEVELS.READ}
                onChange={this._onChange}
                spellCheck={this.props.spellCheck}
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
});
