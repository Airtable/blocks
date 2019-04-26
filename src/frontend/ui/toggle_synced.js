// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const PropTypes = require('prop-types');
const Toggle = require('./toggle');
const Synced = require('./synced');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('./global_config_synced_component_helpers');

import type {GlobalConfigKey} from '../../shared/global_config';

type ToggleSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    label?: React.Node,
    theme?: string,
    onChange?: boolean => void,
    disabled?: boolean,
    className?: string,
    style?: Object,
    tabIndex?: number,
};

/** */
class ToggleSynced extends React.Component<ToggleSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        label: PropTypes.node,
        theme: PropTypes.oneOf(u.values(Toggle.themes)),
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.number,
    };
    _toggle: Toggle | null;
    constructor(props: ToggleSyncedProps) {
        super(props);

        this._toggle = null;
    }
    focus() {
        invariant(this._toggle, 'No toggle to focus');
        this._toggle.focus();
    }
    blur() {
        invariant(this._toggle, 'No toggle to blur');
        this._toggle.blur();
    }
    click() {
        invariant(this._toggle, 'No toggle to click');
        this._toggle.click();
    }
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <Toggle
                        ref={el => (this._toggle = el)}
                        value={value || false}
                        disabled={this.props.disabled || !canSetValue}
                        onChange={newValue => {
                            setValue(newValue);
                            if (this.props.onChange) {
                                this.props.onChange(newValue);
                            }
                        }}
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

module.exports = ToggleSynced;
