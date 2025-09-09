/** @hidden */ /** */
import * as React from 'react';
import {invariant} from '../../shared/error_utils';
import type Table from '../models/table';
import type View from '../models/view';
import type Field from '../models/field';
import useWatchable from '../../shared/ui/use_watchable';
import Select, {type SharedSelectBaseProps} from './select';
import {type SelectOptionValue} from './select_and_select_buttons_helpers';

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
        ...models.map((model) => {
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

export default ForwardedRefModelPickerSelect;
