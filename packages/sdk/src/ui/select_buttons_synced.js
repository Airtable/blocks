// @flow
import * as React from 'react';
import omit from 'lodash.omit';
import SelectButtons from './select_buttons';
import {
    SelectAndSelectButtonsSyncedPropTypes,
    type SelectAndSelectButtonsSyncedProps,
} from './select_and_select_buttons_helpers';
import Synced from './synced';

/** @typedef */
type SelectButtonsSyncedProps = SelectAndSelectButtonsSyncedProps;

/** */
class SelectButtonsSynced extends React.Component<SelectButtonsSyncedProps> {
    static propTypes = SelectAndSelectButtonsSyncedPropTypes;
    props: SelectButtonsSyncedProps;
    render() {
        // TODO (stephen): remove restOfProps
        const restOfProps = omit(this.props, ['globalConfigKey', 'onChange', 'disabled']);
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

export default SelectButtonsSynced;
