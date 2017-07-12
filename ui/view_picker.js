// @flow
const _ = require('client_server_shared/lodash.custom');
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const ViewModel = require('client/blocks/sdk/models/view');
const TableModel = require('client/blocks/sdk/models/table');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');
const ModelPickerSelect = require('client/blocks/sdk/ui/model_picker_select');

import type {ApiViewType} from 'client_server_shared/view_types/api_view_types';

type ViewPickerProps = {
    table: ?TableModel,
    view: ?ViewModel,
    shouldAllowPickingNone?: boolean,
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
        shouldAllowPickingNone: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        allowedTypes: React.PropTypes.arrayOf(React.PropTypes.oneOf(_.values(ApiViewTypes))),
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: ViewPickerProps;
    _onChange: (string | null) => void;
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }
    _onChange(viewId: string | null) {
        const {onChange, table} = this.props;
        if (onChange) {
            const view = table && !table.isDeleted && viewId ? table.getViewById(viewId) : null;
            onChange(view);
        }
    }
    render() {
        const {
            view: selectedView,
            table,
            shouldAllowPickingNone,
            style,
            className,
            disabled,
        } = this.props;
        if (!table || table.isDeleted) {
            return null;
        }

        let placeholder;
        if (this.props.placeholder === undefined) {
            // Let's set a good default value for the placeholder, depending
            // on the shouldAllowPickingNone flag.
            placeholder = shouldAllowPickingNone ? 'None' : 'Pick a view...';
        } else {
            placeholder = this.props.placeholder;
        }

        let allowedTypes = null;
        if (this.props.allowedTypes) {
            allowedTypes = {};
            for (const allowedType of this.props.allowedTypes) {
                allowedTypes[allowedType] = true;
            }
        }
        const shouldAllowPickingViewFn = view => {
            return !allowedTypes || allowedTypes[view.type];
        };

        return (
            <ModelPickerSelect
                models={table.views}
                selectedModelId={selectedView && !selectedView.isDeleted ? selectedView.id : null}
                shouldAllowPickingModelFn={shouldAllowPickingViewFn}
                onChange={this._onChange}
                style={style}
                className={className}
                disabled={disabled}
                placeholder={placeholder}
                shouldAllowPickingNone={shouldAllowPickingNone}
                modelKeysToWatch={['name']}
            />
        );
    }
}

module.exports = createDataContainer(ViewPicker, (props: ViewPickerProps) => {
    return [
        {watch: props.table, key: 'views'},
        {watch: getSdk().base, key: 'tables'},
    ];
});
