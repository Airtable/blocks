// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const TableModel = require('client/blocks/sdk/models/table');
const ViewModel = require('client/blocks/sdk/models/view');
const FieldModel = require('client/blocks/sdk/models/field');
const Select = require('client/blocks/sdk/ui/select');
const invariant = require('invariant');

type Model = TableModel | ViewModel | FieldModel;

// Private component used by TablePicker, ViewPicker, FieldPicker.
type ModelPickerSelectProps = {
    models: Array<Model>,
    selectedModelId: string | null,
    onChange: (string | null) => void,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
    placeholder: string,
    shouldAllowPickingNone: boolean,
    modelKeysToWatch: Array<string>,
    shouldAllowPickingModelFn?: (Model) => boolean,
};

class ModelPickerSelect extends React.Component {
    props: ModelPickerSelectProps;
    _select: Select | null;
    constructor(props: ModelPickerSelectProps) {
        super(props);

        this._select = null;
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
            onChange,
            style,
            className,
            disabled,
            placeholder,
            shouldAllowPickingNone,
            shouldAllowPickingModelFn,
            // Filter these out so they're not
            // included in restOfProps:
            modelKeysToWatch, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;
        return (
            <Select
                ref={el => this._select = el}
                value={selectedModelId}
                onChange={onChange}
                style={style}
                className={className}
                disabled={disabled}
                options={[
                    {value: null, label: placeholder, disabled: !shouldAllowPickingNone},
                    ...models.map(model => {
                        return {
                            value: model.id,
                            label: model.name,
                            disabled: shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model),
                        };
                    }),
                ]}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(ModelPickerSelect, (props: ModelPickerSelectProps) => {
    return props.models.map(model => {
        return {watch: model, key: props.modelKeysToWatch};
    });
}, [
    'focus',
    'blur',
    'click',
]);
