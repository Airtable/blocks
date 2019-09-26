// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {invariant} from '../error_utils';
import Table from '../models/table';
import View from '../models/view';
import Field from '../models/field';
import Select, {
    sharedSelectBasePropTypes,
    type SharedSelectBaseProps,
    stylePropTypes,
    type StyleProps,
} from './select';
import {type SelectOptionValue} from './select_and_select_buttons_helpers';
import useWatchable from './use_watchable';

type AnyModel = Table | View | Field;

type ModelPickerSelectProps<Model: AnyModel> = {|
    models: Array<Model>,
    selectedModelId: string | null,
    modelKeysToWatch: Array<string>,
    shouldAllowPickingNone?: boolean,
    shouldAllowPickingModelFn?: Model => boolean,
    placeholder: string,
    onChange: (newValue: string | null) => mixed,
    ...SharedSelectBaseProps,
    ...StyleProps,
|};

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
    static propTypes = {
        models: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.instanceOf(Table),
                PropTypes.instanceOf(View),
                PropTypes.instanceOf(Field),
            ]),
        ),
        selectedModelId: PropTypes.string,
        modelKeysToWatch: PropTypes.arrayOf(PropTypes.string).isRequired,
        shouldAllowPickingNone: PropTypes.bool,
        shouldAllowPickingModelFn: PropTypes.func,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        ...sharedSelectBasePropTypes,
        ...stylePropTypes,
    };
    _select: React.ElementRef<typeof Select> | null;
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
            placeholder,
            // eslint-disable-next-line no-unused-vars
            onChange,
            ...restOfProps
        } = this.props;

        return (
            <React.Fragment>
                <Select
                    {...restOfProps}
                    ref={el => (this._select = el)}
                    value={selectedModelId}
                    onChange={this._onChange}
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
