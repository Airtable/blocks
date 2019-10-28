/** @internal */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {spawnInvariantViolationError} from '../error_utils';
import Table from '../models/table';
import View from '../models/view';
import Field from '../models/field';
import {ReactRefType} from '../private_utils';
import Select, {
    sharedSelectBasePropTypes,
    SharedSelectBaseProps,
    selectStylePropTypes,
    SelectStyleProps,
} from './select';
import {SelectOptionValue} from './select_and_select_buttons_helpers';
import useWatchable from './use_watchable';
import {FormFieldIdContext} from './use_form_field_id';

type AnyModel = Table | View | Field;

// Private component used by TablePicker, ViewPicker, FieldPicker.
interface ModelPickerSelectProps<Model extends AnyModel>
    extends SharedSelectBaseProps,
        SelectStyleProps {
    models: Array<Model>;
    selectedModelId: string | null;
    modelKeysToWatch: Array<string>;
    shouldAllowPickingNone?: boolean;
    shouldAllowPickingModelFn?: (arg1: Model) => boolean;
    placeholder: string;
    onChange: (newValue: string | null) => unknown;
}

const ModelWatcher = ({
    model,
    modelKeysToWatch,
    onChange,
}: {
    model: AnyModel;
    modelKeysToWatch: Array<string>;
    onChange: () => unknown;
}) => {
    // useWatchable has stricter typing than createDataContainer which it replaced, so we can't
    // know that model and modelKeysToWatch are exactly compatible here:
    useWatchable(model as any, modelKeysToWatch, onChange);
    return null;
};

class ModelPickerSelect<Model extends AnyModel> extends React.Component<
    ModelPickerSelectProps<Model>
> {
    /** @hidden */
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
        ...selectStylePropTypes,
    };
    /** @internal */
    _select: ReactRefType<typeof Select> | null;
    /** */
    static contextType = FormFieldIdContext;
    /** @hidden */
    constructor(props: ModelPickerSelectProps<Model>) {
        super(props);
        // TODO (stephen): Use React.forwardRef
        this._onChange = this._onChange.bind(this);
        this._select = null;
    }
    /** @internal */
    _onChange(value: SelectOptionValue) {
        if (!(value === null || typeof value === 'string')) {
            throw spawnInvariantViolationError('value must be null or model id');
        }
        this.props.onChange(value);
    }
    /** */
    focus() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to focus');
        }
        this._select.focus();
    }
    /** */
    blur() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to blur');
        }
        this._select.blur();
    }
    /** */
    click() {
        if (!this._select) {
            throw spawnInvariantViolationError('No select to click');
        }
        this._select.click();
    }
    /** @hidden */
    render() {
        const {
            models,
            modelKeysToWatch,
            selectedModelId,
            shouldAllowPickingNone,
            shouldAllowPickingModelFn,
            placeholder,
            id,
            // Destructure `onChange` to prevent it from being passed to `Select`.
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onChange,
            ...restOfProps
        } = this.props;
        const controlId = this.context;

        return (
            <React.Fragment>
                <Select
                    {...restOfProps}
                    ref={el => (this._select = el)}
                    value={selectedModelId}
                    id={id || controlId}
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
                    // TODO: remove this once we have immutable schema models OR allow Select to
                    // take options elements
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
