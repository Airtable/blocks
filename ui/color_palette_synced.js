// @flow
const {h, _} = require('client_server_shared/h_');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');
const ColorPalette = require('client/blocks/sdk/ui/color_palette');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');

class ColorPaletteSynced extends React.Component {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        allowedColors: PropTypes.arrayOf(PropTypes.string).isRequired,
        onChange: PropTypes.func,
        squareSize: PropTypes.number,
        squareMargin: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.object,
        disabled: PropTypes.bool,
    };
    _onChange(color: string) {
        getSdk().globalConfig.set(this.props.globalConfigKey, color);

        if (this.props.onChange) {
            this.props.onChange(color);
        }
    }
    render() {
        const {globalConfigKey, disabled} = this.props;
        const restOfProps = _.omit(this.props, ['globalConfigKey', 'disabled', 'onChange']);
        const color = getSdk().globalConfig.get(globalConfigKey);
        return (
            <ColorPalette
                color={color}
                onChange={this._onChange.bind(this)}
                disabled={disabled || getSdk().base.permissionLevel === permissions.API_LEVELS.READ}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(ColorPaletteSynced, props => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});
