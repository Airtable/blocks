// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const permissions = require('client_server_shared/permissions');

type InputSyncedProps = {
    type: ?string,
    globalConfigKey: string,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

const validTypesSet = {
    checkbox: true,
    color: true,
    date: true,
    datetime: true,
    'datetime-local': true,
    email: true,
    hidden: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
};

class InputSynced extends React.Component {
    static propTypes = {
        type: React.PropTypes.oneOf(Object.keys(validTypesSet)),
        globalConfigKey: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: InputSyncedProps;
    _isCheckbox() {
        return this.props.type === 'checkbox';
    }
    _onChange(e) {
        const value = this._isCheckbox() ?
            e.target.checked :
            e.target.value;

        getSdk().globalConfig.set(this.props.globalConfigKey, value);
    }
    render() {
        const {base, globalConfig} = getSdk();

        let value = globalConfig.get(this.props.globalConfigKey);
        if (value === undefined) {
            value = this._isCheckbox() ? false : '';
        }

        const valueObj = this._isCheckbox() ? {checked: value} : {value};

        let {type} = this.props;
        if (type === undefined || type === null || !validTypesSet[type]) {
            type = 'text';
        }

        return (
            <input
                type={type}
                placeholder={this.props.placeholder}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled || base.permissionLevel === permissions.API_LEVELS.READ}
                onChange={this._onChange.bind(this)}
                {...valueObj}
            />
        );
    }
}

module.exports = createDataContainer(InputSynced, (props: InputSyncedProps) => {
    return [
        {watch: getSdk().globalConfig, key: props.globalConfigKey},
        {watch: getSdk().base, key: 'permissionLevel'},
    ];
});
