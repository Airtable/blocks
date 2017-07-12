// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const TableModel = require('client/blocks/sdk/models/table');
const ViewModel = require('client/blocks/sdk/models/view');
const FieldModel = require('client/blocks/sdk/models/field');
const Select = require('client/blocks/sdk/ui/select');

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
const ModelPickerSelect = createDataContainer((props: ModelPickerSelectProps) => {
    const {shouldAllowPickingModelFn} = props;
    return (
        <Select
            value={props.selectedModelId}
            onChange={props.onChange}
            style={props.style}
            className={props.className}
            disabled={props.disabled}
            options={[
                {value: null, label: props.placeholder, disabled: !props.shouldAllowPickingNone},
                ...props.models.map(model => {
                    return {
                        value: model.id,
                        label: model.name,
                        disabled: shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model),
                    };
                }),
            ]}
        />
    );
}, (props: ModelPickerSelectProps) => {
    return props.models.map(model => {
        return {watch: model, key: props.modelKeysToWatch};
    });
});

module.exports = ModelPickerSelect;
