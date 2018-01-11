// @flow
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const globalConfigSyncedComponentHelpers = require('client/blocks/sdk/ui/global_config_synced_component_helpers');
const TableModel = require('client/blocks/sdk/models/table');
const FieldTokenizedTextArea = require('client/blocks/sdk/ui/field_tokenized_text_area');
const Synced = require('client/blocks/sdk/ui/synced');

import type {GlobalConfigKey} from 'client/blocks/sdk/global_config';

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
    render() {
        return (
            <Synced
                globalConfigKey={this.props.globalConfigKey}
                render={({value, canSetValue, setValue}) => (
                    <FieldTokenizedTextArea
                        table={this.props.table}
                        value={value}
                        onChange={ops => {
                            setValue(ops);
                            if (this.props.onChange) {
                                this.props.onChange(ops);
                            }
                        }}
                        disabled={this.props.disabled || !canSetValue}
                        className={this.props.className}
                        style={this.props.style}
                    />
                )}
            />
        );
    }
}

module.exports = FieldTokenizedTextAreaSynced;
