// @flow
import invariant from 'invariant';
import * as React from 'react';
import Table from '../models/table';
import View from '../models/view';
import Field from '../models/field';
import createDataContainer from './create_data_container';
import Select from './select';
import {type SelectOptionValue} from './select_and_select_buttons_helpers';

type AnyModel = Table | View | Field;

// Private component used by TablePicker, ViewPicker, FieldPicker.
type ModelPickerSelectProps<Model: AnyModel> = {
    models: Array<Model>,
    selectedModelId: string | null,
    modelKeysToWatch: Array<string>,
    shouldAllowPickingNone?: boolean,
    shouldAllowPickingModelFn?: Model => boolean,
    onChange: (string | null) => void,
    id?: string,
    className?: string,
    style?: Object,
    disabled?: boolean,
    tabIndex?: number | string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
    placeholder: string,
};

class ModelPickerSelect<Model: AnyModel> extends React.Component<ModelPickerSelectProps<Model>> {
    _select: Select | null;
    _onChange: SelectOptionValue => void;
    constructor(props: ModelPickerSelectProps<Model>) {
        super(props);
        // TODO (stephen): Use React.forwardRef
        this._onChange = this._onChange.bind(this);
        this._select = null;
    }
    _onChange(value: SelectOptionValue) {
        invariant(value === null || typeof value === 'string', 'value must be null or model id');
        this.props.onChange(value);
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
    render() {
        const {
            models,
            selectedModelId,
            shouldAllowPickingNone,
            shouldAllowPickingModelFn,
            id,
            className,
            style,
            disabled,
            tabIndex,
            placeholder,
        } = this.props;
        return (
            <Select
                ref={el => (this._select = el)}
                value={selectedModelId}
                onChange={this._onChange}
                id={id}
                className={className}
                style={style}
                disabled={disabled}
                tabIndex={tabIndex}
                aria-labelledby={this.props['aria-labelledby']}
                aria-describedby={this.props['aria-describedby']}
                options={[
                    {value: null, label: placeholder, disabled: !shouldAllowPickingNone},
                    ...models.map(model => {
                        return {
                            value: model.id,
                            label: model.name,
                            disabled:
                                shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model),
                        };
                    }),
                ]}
            />
        );
    }
}

export default createDataContainer(
    ModelPickerSelect,
    props => {
        return props.models.map(model => {
            return {watch: model, key: props.modelKeysToWatch};
        });
    },
    ['focus', 'blur', 'click'],
);
