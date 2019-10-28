/** @module @airtable/blocks/ui: Select */ /** */
import * as React from 'react';
import {spawnError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import SelectButtons, {
    sharedSelectButtonsPropTypes,
    SharedSelectButtonsProps,
    selectButtonsStylePropTypes,
    SelectButtonsStyleProps,
} from './select_buttons';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import Synced from './synced';

/**
 * @typedef {object} SelectButtonsSyncedProps
 */
interface SelectButtonsSyncedProps extends SharedSelectButtonsProps, SelectButtonsStyleProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected option will always reflect the value stored in `globalConfig` for this key. Selecting a new option will update `globalConfig`. */
    globalConfigKey: GlobalConfigKey;
}

/** */
class SelectButtonsSynced extends React.Component<SelectButtonsSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...sharedSelectButtonsPropTypes,
        ...selectButtonsStylePropTypes,
    };
    /** @hidden */
    render() {
        const {globalConfigKey, onChange, disabled, ...restOfProps} = this.props;

        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    let selectValue;
                    if (value === null || value === undefined) {
                        selectValue = null;
                    } else if (
                        typeof value === 'string' ||
                        typeof value === 'number' ||
                        typeof value === 'boolean'
                    ) {
                        selectValue = value;
                    } else {
                        throw spawnError(
                            'SelectButtonsSynced only works with a global config value that is a string, number, boolean, null or undefined.',
                        );
                    }

                    return (
                        <SelectButtons
                            {...restOfProps}
                            value={selectValue}
                            onChange={newValue => {
                                setValue(newValue);
                                if (onChange) {
                                    onChange(newValue);
                                }
                            }}
                            disabled={disabled || !canSetValue}
                        />
                    );
                }}
            />
        );
    }
}

export default SelectButtonsSynced;
