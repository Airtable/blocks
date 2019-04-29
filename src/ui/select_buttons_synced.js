// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const SelectButtons = require('./select_buttons');
const {SelectAndSelectButtonsSyncedPropTypes} = require('./select_and_select_buttons_helpers');
const Synced = require('./synced');

import type {SelectAndSelectButtonsSyncedProps as SelectButtonsSyncedProps} from './select_and_select_buttons_helpers';

/** */
class SelectButtonsSynced extends React.Component<SelectButtonsSyncedProps> {
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
