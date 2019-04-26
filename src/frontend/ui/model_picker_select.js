// @flow
const React = require('block_sdk/frontend/ui/react');
const createDataContainer = require('block_sdk/frontend/ui/create_data_container');
const TableModel = require('block_sdk/shared/models/table');
const ViewModel = require('block_sdk/shared/models/view');
const FieldModel = require('block_sdk/shared/models/field');
const Select = require('block_sdk/frontend/ui/select');
const invariant = require('invariant');

import type {SelectOptionValue} from 'block_sdk/frontend/ui/select_and_select_buttons_helpers';

type AnyModel = TableModel | ViewModel | FieldModel;

// Private component used by TablePicker, ViewPicker, FieldPicker.
type ModelPickerSelectProps<Model: AnyModel> = {
    models: Array<Model>,
    selectedModelId: string | null,
    onChange: (string | null) => void,
    style?: Object,
    className?: string,
    disabled?: boolean,
    placeholder: string,
    shouldAllowPickingNone?: boolean,
    modelKeysToWatch: Array<string>,
    shouldAllowPickingModelFn?: Model => boolean,
};

class ModelPickerSelect<Model: AnyModel> extends React.Component<ModelPickerSelectProps<Model>> {
    _select: Select | null;
    _onChange: SelectOptionValue => void;
    constructor(props) {
        super(props);

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
            style,
            className,
            disabled,
            placeholder,
            shouldAllowPickingNone,
            shouldAllowPickingModelFn,
            // Filter these out so they're not
            // included in restOfProps:
            modelKeysToWatch, // eslint-disable-line no-unused-vars
            onChange, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;
        return (
            <Select
                ref={el => (this._select = el)}
                value={selectedModelId}
                onChange={this._onChange}
                style={style}
                className={className}
                disabled={disabled}
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
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(
    ModelPickerSelect,
    props => {
        return props.models.map(model => {
            return {watch: model, key: props.modelKeysToWatch};
        });
    },
    ['focus', 'blur', 'click'],
);
