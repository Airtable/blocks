// @flow
const React = require('block_sdk/frontend/ui/react');
const PropTypes = require('prop-types');
const getSdk = require('block_sdk/shared/get_sdk');
const invariant = require('invariant');
const globalConfigSyncedComponentHelpers = require('block_sdk/frontend/ui/global_config_synced_component_helpers');
const Synced = require('block_sdk/frontend/ui/synced');

import type {GlobalConfigKey} from 'block_sdk/shared/global_config';

type RadioSyncedProps = {
    globalConfigKey: GlobalConfigKey,
    value: string,
    style?: Object,
    className?: string,
    disabled?: boolean,
};

/** */
class RadioSynced extends React.Component<RadioSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        value: PropTypes.string.isRequired,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: RadioSyncedProps;
    _input: HTMLInputElement | null;
    constructor(props: RadioSyncedProps) {
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
    render() {
        const {globalConfig} = getSdk();
        const globalConfigPathAsString = globalConfig
            .__formatKeyAsPath(this.props.globalConfigKey)
            .join('~');
        const name = `RadioSynced::${globalConfigPathAsString}`;
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <input
                        ref={el => (this._input = el)}
                        type="radio"
                        name={name}
                        value={this.props.value}
                        style={this.props.style}
                        className={this.props.className}
                        disabled={this.props.disabled || !canSetValue}
                        onChange={e => {
                            // <input type="radio"> is a bit weird. You put a bunch of them
                            // on the page with the same `name` attribute, then whichever
                            // gets checked will trigger its onChange callback with its `value` attribute.
                            setValue(this.props.value);
                        }}
                        checked={value === this.props.value}
                    />
                )}
            />
        );
    }
}

module.exports = RadioSynced;
