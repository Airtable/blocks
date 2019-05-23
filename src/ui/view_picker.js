// @flow
import PropTypes from 'prop-types';
import invariant from 'invariant';
import * as React from 'react';
import {values} from '../private_utils';
import getSdk from '../get_sdk';
import ViewModel from '../models/view';
import TableModel from '../models/table';
import {ViewTypes, type ViewType} from '../types/view';
import ModelPickerSelect from './model_picker_select';
import createDataContainer from './create_data_container';

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

type ViewPickerProps = {
    table?: TableModel,
    view?: ViewModel,
    shouldAllowPickingNone?: boolean,
    onChange?: (viewModel: ViewModel | null) => void,
    allowedTypes?: Array<ViewType>,
    placeholder?: string,
    style?: Object,
    className?: string,
    disabled?: boolean,
};

/** */
class ViewPicker extends React.Component<ViewPickerProps> {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel),
        view: PropTypes.instanceOf(ViewModel),
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        allowedTypes: PropTypes.arrayOf(PropTypes.oneOf(values(ViewTypes))),
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: ViewPickerProps;
    _onChange: (string | null) => void;
    _select: ModelPickerSelect<ViewModel> | null;
    constructor(props: ViewPickerProps) {
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
            const view =
                table && !table.isDeleted && viewId ? table.getViewByIdIfExists(viewId) : null;
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
                ref={el => (this._select = el)}
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

export default createDataContainer(
    ViewPicker,
    (props: ViewPickerProps) => {
        return [{watch: props.table, key: 'views'}, {watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
