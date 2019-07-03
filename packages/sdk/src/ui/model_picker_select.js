// @flow
import * as React from 'react';
import {invariant} from '../error_utils';
import Table from '../models/table';
import View from '../models/view';
import Field from '../models/field';
import Select from './select';
import {type SelectOptionValue} from './select_and_select_buttons_helpers';
import useWatchable from './use_watchable';

type AnyModel = Table | View | Field;

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

const ModelWatcher = ({
    model,
    modelKeysToWatch,
    onChange,
}: {|
    model: AnyModel,
    modelKeysToWatch: Array<string>,
    onChange: () => mixed,
|}) => {
    useWatchable(model, modelKeysToWatch, onChange);
    return null;
};

class ModelPickerSelect<Model: AnyModel> extends React.Component<ModelPickerSelectProps<Model>> {
    _select: Select | null;
    _onChange: SelectOptionValue => void;
    constructor(props: ModelPickerSelectProps<Model>) {
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
            modelKeysToWatch,
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
            <React.Fragment>
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

                {models.map(model => (
                    <ModelWatcher
                        key={model.id}
                        model={model}
                        modelKeysToWatch={modelKeysToWatch}
                        onChange={() => this.forceUpdate()}
                    />
                ))}
            </React.Fragment>
        );
    }
}

export default ModelPickerSelect;
