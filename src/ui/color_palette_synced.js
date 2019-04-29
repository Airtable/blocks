// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const PropTypes = require('prop-types');
const ColorPalette = require('./color_palette');
const Synced = require('./synced');
const globalConfigSyncedComponentHelpers = require('./global_config_synced_component_helpers');

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

module.exports = ColorPaletteSynced;
