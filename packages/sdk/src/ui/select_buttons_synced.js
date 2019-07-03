// @flow
import * as React from 'react';
import SelectButtons from './select_buttons';
import {
    SelectAndSelectButtonsSyncedPropTypes,
    type SelectAndSelectButtonsSyncedProps,
} from './select_and_select_buttons_helpers';
import Synced from './synced';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

/** @typedef */
type SelectButtonsSyncedProps = SelectAndSelectButtonsSyncedProps;

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
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

export default SelectButtonsSynced;
