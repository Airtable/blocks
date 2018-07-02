// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const ColorPalette = require('client/blocks/sdk/ui/color_palette');
const Synced = require('client/blocks/sdk/ui/synced');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

/** */
class ColorPaletteSynced extends React.Component {
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
