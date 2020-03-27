/** @hidden */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {invariant} from '../error_utils';
import Table from '../models/table';
import View from '../models/view';
import Field from '../models/field';
import Select, {sharedSelectBasePropTypes, SharedSelectBaseProps} from './select';
import {SelectOptionValue} from './select_and_select_buttons_helpers';
import useWatchable from './use_watchable';

type AnyModel = Table | View | Field;

interface ModelPickerSelectProps<Model extends AnyModel> extends SharedSelectBaseProps {
    models: Array<Model>;
    selectedModelId: string | null;
    modelKeysToWatch: Array<string>;
    shouldAllowPickingNone?: boolean;
    shouldAllowPickingModelFn?: (arg1: Model) => boolean;
    placeholder: string;
    onChange: (newValue: string | null) => unknown;
}

function ModelPickerSelect<Model extends AnyModel>(
    props: ModelPickerSelectProps<Model>,
    ref: React.Ref<HTMLSelectElement>,
) {
    const {
        models,
        modelKeysToWatch,
        selectedModelId,
        shouldAllowPickingNone,
        shouldAllowPickingModelFn,
        placeholder,
        onChange,
        ...restOfProps
    } = props;

    useWatchable(models as any, modelKeysToWatch);

    function _onChange(value: SelectOptionValue) {
        invariant(value === null || typeof value === 'string', 'value must be null or model id');
        onChange(value);
    }

    const options = [
        {value: null, label: placeholder, disabled: !shouldAllowPickingNone},
        ...models.map(model => {
            return {
                value: model.id,
                label: model.name,
                disabled: shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model),
            };
        }),
    ];

    return (
        <Select
            {...restOfProps}
            ref={ref}
            value={selectedModelId}
            onChange={_onChange}
            options={options}
        />
    );
}

const ForwardedRefModelPickerSelect = React.forwardRef<
    HTMLSelectElement,
    ModelPickerSelectProps<AnyModel>
>(ModelPickerSelect);

ForwardedRefModelPickerSelect.displayName = 'ModelPickerSelect';

ForwardedRefModelPickerSelect.propTypes = {
    models: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.instanceOf(Table).isRequired,
            PropTypes.instanceOf(View).isRequired,
            PropTypes.instanceOf(Field).isRequired,
        ]).isRequired,
    ).isRequired,
    selectedModelId: PropTypes.string,
    modelKeysToWatch: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    shouldAllowPickingNone: PropTypes.bool,
    shouldAllowPickingModelFn: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    ...sharedSelectBasePropTypes,
};

export default ForwardedRefModelPickerSelect;
