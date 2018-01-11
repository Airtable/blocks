// @flow
const u = require('client_server_shared/u');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const ViewModel = require('client/blocks/sdk/models/view');
const TableModel = require('client/blocks/sdk/models/table');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');
const ModelPickerSelect = require('client/blocks/sdk/ui/model_picker_select');
const invariant = require('invariant');

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
        table: PropTypes.instanceOf(TableModel),
        view: PropTypes.instanceOf(ViewModel),
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(u.values(ApiViewTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: ViewPickerProps;
    _onChange: (string | null) => void;
    _select: ModelPickerSelect | null;
    constructor(props) {
        super(props);
        this._select = null;
        this._onChange = this._onChange.bind(this);
    }
    focus() {
        invariant(this._select, 'No select to focus');
        this._select.focus();
    }
    blur() {
        invariant(this._select, 'No select to blur');
        this._select.blur();
    }
    click() {
        invariant(this._select, 'No select to click');
        this._select.click();
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

        const restOfProps = u.omit(this.props, Object.keys(ViewPicker.propTypes));

        return (
            <ModelPickerSelect
                ref={el => this._select = el}
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
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(ViewPicker, (props: ViewPickerProps) => {
    return [
        {watch: props.table, key: 'views'},
        {watch: getSdk().base, key: 'tables'},
    ];
}, [
    'focus',
    'blur',
    'click',
]);
