// @flow
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');
const permissions = require('client_server_shared/permissions');
const TableModel = require('client/blocks/sdk/models/table');
const FieldTokenizedTextArea = require('client/blocks/sdk/ui/field_tokenized_text_area');
const getSdk = require('client/blocks/sdk/get_sdk');

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';
import type {BlockKvValue} from 'client_server_shared/blocks/block_kv_helpers';

type FieldTokenizedTextAreaSyncedProps = {
    table: TableModel,
    globalConfigKey: GlobalConfigKey,
    onChange?: ?Array<Object> => void,
    disabled?: boolean,
    className?: string,
    style?: Object,
};

class FieldTokenizedTextAreaSynced extends React.Component {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel).isRequired,
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    props: FieldTokenizedTextAreaSyncedProps;
    _onChange: Array<Object> => void;
    constructor(props: FieldTokenizedTextAreaSyncedProps) {
        super(props);

        this._onChange = this._onChange.bind(this);
    }
    _onChange(ops: Array<Object>) {
        const globalConfigValue = ((ops: any): BlockKvValue); // eslint-disable-line flowtype/no-weak-types
        getSdk().globalConfig.set(this.props.globalConfigKey, globalConfigValue);

        if (this.props.onChange) {
            this.props.onChange(ops);
        }
    }
    render() {
        const {table, globalConfigKey, disabled, className, style} = this.props;
        const value = getSdk().globalConfig.get(globalConfigKey);
        return (
            <FieldTokenizedTextArea
                table={table}
                value={value}
                onChange={this._onChange}
                disabled={disabled || getSdk().base.permissionLevel === permissions.API_LEVELS.READ}
                className={className}
                style={style}
            />
        );
    }
}

module.exports = createDataContainer(FieldTokenizedTextAreaSynced, (props: FieldTokenizedTextAreaSyncedProps) => {
    return globalConfigSyncedComponentHelpers.getDefaultWatchesForSyncedComponent(props.globalConfigKey);
});
