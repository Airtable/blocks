// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');

type RadioSyncedProps = {
    globalConfigKey: string,
    value: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class RadioSynced extends React.Component {
    static propTypes = {
        globalConfigKey: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: RadioSyncedProps;
    _onChange(e) {
        // <input type="radio"> is a bit weird. You put a bunch of them
        // on the page with the same `name` attribute, then whichever
        // gets checked will trigger its onChange callback with its `value` attribute.
        getSdk().globalConfig.set(this.props.globalConfigKey, this.props.value);
    }
    render() {
        const {base, globalConfig} = getSdk();
        const checked = globalConfig.get(this.props.globalConfigKey) === this.props.value;

        return (
            <input
                type="radio"
                name={`RadioSynced::${this.props.globalConfigKey}`}
                value={this.props.value}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || base.permissionLevel === permissions.API_LEVELS.READ}
                onChange={this._onChange.bind(this)}
                checked={checked}
            />
        );
    }
}

module.exports = createDataContainer(RadioSynced, (props: RadioSyncedProps) => {
    return [
        {watch: getSdk().globalConfig, key: props.globalConfigKey},
        {watch: getSdk().base, key: 'permissionLevel'},
    ];
});
