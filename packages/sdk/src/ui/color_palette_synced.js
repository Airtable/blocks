// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import ColorPalette from './color_palette';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

/** @typedef */
type ColorPaletteSyncedProps = {
    globalConfigKey: string,
    disabled?: boolean,
    onChange?: string => mixed,
};

/** */
class ColorPaletteSynced extends React.Component<ColorPaletteSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
    };
    render() {
        const {globalConfigKey, disabled} = this.props;
        const restOfProps = u.omit(this.props, ['globalConfigKey', 'disabled', 'onChange']);
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <ColorPalette
                        color={value}
                        onChange={newValue => {
                            setValue(newValue);

                            if (this.props.onChange) {
                                this.props.onChange(newValue);
                            }
                        }}
                        disabled={disabled || !canSetValue}
                        {...restOfProps}
                    />
                )}
            />
        );
    }
}

export default ColorPaletteSynced;
