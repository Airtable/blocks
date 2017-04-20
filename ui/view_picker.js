// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const ViewModel = require('client/blocks/sdk/models/view');
const TableModel = require('client/blocks/sdk/models/table');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');

import type {ApiViewType} from 'client_server_shared/view_types/api_view_types';

type ViewPickerOptionProps = {
    view: ViewModel,
    isDisabled: boolean,
};
const _ViewPickerOption = (props: ViewPickerOptionProps) => {
    const {view} = props;
    return <option value={view.id} disabled={props.isDisabled}>{view.name}</option>;
};
const ViewPickerOption = createDataContainer(_ViewPickerOption, (props: ViewPickerOptionProps) => {
    return [
        {watch: props.view, key: 'name'},
    ];
});

type ViewPickerProps = {
    table: ?TableModel,
    view: ?ViewModel,
    onChange?: (viewModel: ViewModel | null) => void,
    allowedTypes?: Array<ApiViewType>,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class ViewPicker extends React.Component {
    static propTypes = {
        table: React.PropTypes.instanceOf(TableModel),
        view: React.PropTypes.instanceOf(ViewModel),
        onChange: React.PropTypes.func,
        allowedTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(_.values(ApiViewTypes))),
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    static defaultProps = {
        placeholder: 'Pick a view...',
    };
    props: ViewPickerProps;
    _onChange(e) {
        const {onChange, table} = this.props;
        if (onChange) {
            const view = table && !table.isDeleted ? table.getViewById(e.target.value) : null;
            onChange(view);
        }
    }
    _onViewsChanged() {
        const {view} = this.props;
        if (view && view.isDeleted && this.props.onChange) {
            this.props.onChange(null);
        }
        this.forceUpdate();
    }
    _onTablesChanged() {
        const {table} = this.props;
        if (table && table.isDeleted && this.props.onChange) {
            this.props.onChange(null);
        }
        this.forceUpdate();
    }
    render() {
        const {view: selectedView, table} = this.props;
        if (!table || table.isDeleted) {
            return null;
        }

        let allowedTypes = null;
        if (this.props.allowedTypes) {
            allowedTypes = {};
            for (const allowedType of this.props.allowedTypes) {
                allowedTypes[allowedType] = true;
            }
        }

        return (
            <select
                value={selectedView && !selectedView.isDeleted ? selectedView.id : ''}
                onChange={this._onChange.bind(this)}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled}>
                <option value={''} disabled={true}>{this.props.placeholder}</option>
                {table.views.map(view => {
                    return (
                        <ViewPickerOption
                            key={view.id}
                            view={view}
                            isDisabled={allowedTypes && !allowedTypes[view.type]}
                        />
                    );
                })}
            </select>
        );
    }
}

module.exports = createDataContainer(ViewPicker, (props: ViewPickerProps) => {
    return [
        {watch: props.table, key: 'views', callback: ViewPicker.prototype._onViewsChanged},
        {watch: getSdk().base, key: 'tables', callback: ViewPicker.prototype._onTablesChanged},
    ];
});
