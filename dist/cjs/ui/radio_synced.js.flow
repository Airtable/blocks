// @flow
import PropTypes from 'prop-types';
import invariant from 'invariant';
import * as React from 'react';
import getSdk from '../get_sdk';
import {type GlobalConfigKey} from '../global_config';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';

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

export default RadioSynced;
