// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('block_sdk/frontend/ui/react');
const invariant = require('invariant');
const Select = require('block_sdk/frontend/ui/select');
const {SelectAndSelectButtonsSyncedPropTypes} = require('block_sdk/frontend/ui/select_and_select_buttons_helpers');
const Synced = require('block_sdk/frontend/ui/synced');

import type {SelectAndSelectButtonsSyncedProps as SelectSyncedProps} from 'block_sdk/frontend/ui/select_and_select_buttons_helpers';

/** */
class SelectSynced extends React.Component<SelectSyncedProps> {
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
