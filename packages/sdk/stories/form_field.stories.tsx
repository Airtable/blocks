// @flow
import React, {useState} from 'react';
import {values as objectValues} from '../src/shared/private_utils';
import colors from '../src/shared/colors';
import ColorPalette from '../src/base/ui/color_palette';
import FormField, {formFieldStylePropTypes} from '../src/base/ui/form_field';
import Box from '../src/base/ui/box';
import Input from '../src/base/ui/input';
import Select from '../src/base/ui/select';
import SelectButtons from '../src/base/ui/select_buttons';
import Example from './helpers/example';
import {CONTROL_WIDTH, createJsxPropsStringFromValuesMap} from './helpers/code_utils';
import {SelectOptionValue} from '../src/base/ui/select_and_select_buttons_helpers';

export default {
    component: FormField,
};

function FormFieldExample() {
    const [value, setValue] = useState('');
    return (
        <Example
            options={{
                description: {
                    type: 'switch',
                    label: 'Show description',
                    defaultValue: false,
                },
            }}
            styleProps={Object.keys(formFieldStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    description: _value =>
                        _value ? 'This is a description for this field.' : null,
                });
                return `
                    import {FormField, Input} from '@airtable/blocks/base/ui';

                    const FormFieldExample = () => {
                        const [value, setValue] = useState('');
                        return (
                            <FormField label="Text field" ${props}>
                                <Input value={value} onChange={e => setValue(e.target.value)} />
                            </FormField>
                        );
                    };
                `;
            }}
        >
            {values => (
                <FormField
                    label="Text field"
                    description={
                        values.description ? 'This is a description for this field.' : null
                    }
                    width={CONTROL_WIDTH}
                >
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </FormField>
            )}
        </Example>
    );
}

export const _Example = {
    render: () => <FormFieldExample />,
};

export const TextInputField = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = useState('');
            return (
                <FormField label="Text Input field">
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </FormField>
            );
        }),
};

export const SelectField = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = useState<SelectOptionValue>('Option 1');
            const options = [
                {value: 'Option 1', label: 'Option 1'},
                {value: 'Option 2', label: 'Option 2'},
                {value: 'Option 3', label: 'Option 3'},
            ];
            return (
                <FormField label="Select field">
                    <Select value={value} options={options} onChange={val => setValue(val)} />
                </FormField>
            );
        }),
};

export const WithDescription = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = useState('');
            return (
                <FormField
                    className="custom-class-name"
                    label="Subject"
                    description={
                        <React.Fragment>
                            Insert values by wrapping the field name in brackets:{' '}
                            <span style={{fontWeight: 500}}>
                                {'{'}Name{'}'}
                            </span>
                        </React.Fragment>
                    }
                >
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </FormField>
            );
        }),
};

export const CustomClassName = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = useState('');
            return (
                <FormField className="custom-class-name" label="Inspect to see custom class name">
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </FormField>
            );
        }),
};

export const CustomId = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = useState('');
            return (
                <FormField id="custom-id" label="Inspect to see custom ID">
                    <Input value={value} onChange={e => setValue(e.target.value)} />
                </FormField>
            );
        }),
};

export const ForwardedRef = {
    render: () =>
        React.createElement(() => {
            return (
                <FormField
                    id="custom-id"
                    ref={node => {
                        // eslint-disable-next-line no-console
                        console.log(node);
                    }}
                    label="Look in console to see ref"
                />
            );
        }),
};

export const MultipleFormfields = {
    render: () =>
        React.createElement(() => {
            const [textValue, setTextValue] = useState('');
            const [selectValue, setSelectValue] = useState<SelectOptionValue>('Option 1');
            const [color, setColor] = useState<string | null>(null);
            const [coolLevel, setCoolLevel] = useState<SelectOptionValue>('Kinda cool');

            const selectOptions = [
                {value: 'Option 1', label: 'Option 1'},
                {value: 'Option 2', label: 'Option 2'},
                {value: 'Option 3', label: 'Option 3'},
            ];
            const allowedColors = objectValues(colors).slice(0, 12);
            const selectButtonsOptions = [
                {
                    value: 'Kinda cool',
                    label: 'Kinda cool',
                },
                {
                    value: 'Pretty cool',
                    label: 'Pretty cool',
                },
                {
                    value: 'So cool',
                    label: 'So cool',
                },
            ];
            return (
                <div style={{width: 400, margin: 'auto'}}>
                    <FormField
                        label="Text input"
                        description="Insert values by wrapping the field name in brackets"
                    >
                        <Input value={textValue} onChange={e => setTextValue(e.target.value)} />
                    </FormField>
                    <FormField label="Select">
                        <Select
                            value={selectValue}
                            options={selectOptions}
                            onChange={val => setSelectValue(val)}
                        />
                    </FormField>
                    <FormField
                        label="Color palette"
                        description="Pick a color from the color palette"
                    >
                        <ColorPalette
                            color={color}
                            allowedColors={allowedColors}
                            onChange={setColor}
                        />
                    </FormField>
                    <FormField label="Select buttons">
                        <SelectButtons
                            value={coolLevel}
                            options={selectButtonsOptions}
                            onChange={val => setCoolLevel(val)}
                        />
                    </FormField>
                </div>
            );
        }),
};

export const Width100InsideContainer = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = useState('');
            return (
                <Box border="thick" width="500px" display="flex">
                    <FormField label="Sample formfield" description="Width should fill container">
                        <Input value={value} onChange={e => setValue(e.target.value)} />
                    </FormField>
                </Box>
            );
        }),
};
