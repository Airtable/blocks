// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const invariant = require('invariant');
const Select = require('client/blocks/sdk/ui/select');
const {SelectAndSelectButtonsSyncedPropTypes} = require('client/blocks/sdk/ui/select_and_select_buttons_prop_type_helpers');
const Synced = require('client/blocks/sdk/ui/synced');

import type {SelectAndSelectButtonsSyncedProps as SelectSyncedProps} from 'client/blocks/sdk/ui/select_and_select_buttons_prop_type_helpers';

/** */
class SelectSynced extends React.Component {
    static propTypes = SelectAndSelectButtonsSyncedPropTypes;
    props: SelectSyncedProps;
    _select: Select | null;
    constructor(props: SelectSyncedProps) {
        super(props);

        this._select = null;
    }
    focus() {
        invariant(this._select, 'No select to focus');
        this._select.focus();
    }
    blur() {
        invariant(this._select, 'No select to blur');
        this._select.blur();
    }
    click() {
        invariant(this._select, 'No select to click');
        this._select.click();
    }
    render() {
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <Select
                        ref={el => this._select = el}
                        disabled={this.props.disabled || !canSetValue}
                        value={value}
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

module.exports = SelectSynced;
