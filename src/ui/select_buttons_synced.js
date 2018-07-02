// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const SelectButtons = require('client/blocks/sdk/ui/select_buttons');
const {SelectAndSelectButtonsSyncedPropTypes} = require('client/blocks/sdk/ui/select_and_select_buttons_helpers');
const Synced = require('client/blocks/sdk/ui/synced');

import type {SelectAndSelectButtonsSyncedProps as SelectButtonsSyncedProps} from 'client/blocks/sdk/ui/select_and_select_buttons_helpers';

/** */
class SelectButtonsSynced extends React.Component {
    static propTypes = SelectAndSelectButtonsSyncedPropTypes;
    props: SelectButtonsSyncedProps;
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <SelectButtons
                        disabled={this.props.disabled || !canSetValue}
                        value={value}
                        onChange={newValue => {
                            setValue(newValue);
                            if (this.props.onChange) {
                                this.props.onChange(newValue);
                            }
                        }}
                        // NOTE: blocks rely on being able to override `value` because
                        // of this implementation detail. It's helpful when you want the
                        // reads to go through some getter instead of using the raw globalConfig
                        // value (e.g. to respect defaults).
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

module.exports = SelectButtonsSynced;
