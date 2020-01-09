import React, {useState, useEffect} from 'react';
import capitalize from 'lodash/capitalize';
import Select from '../../src/ui/select';
import SelectButtons from '../../src/ui/select_buttons';
import Switch from '../../src/ui/switch';
import Box from '../../src/ui/box';
import Heading from '../../src/ui/heading';
import FormField from '../../src/ui/form_field';
import ExampleCodePanel from './example_code_panel';

type SelectOption = {
    type: 'select';
    label: string;
    options: {[key: string]: unknown};
    defaultValue?: string;
};

type SelectButtonsOption = {
    type: 'selectButtons';
    label: string;
    options: {[key: string]: unknown};
    defaultValue?: string;
};

type SwitchOption = {
    type: 'switch';
    label: string;
    defaultValue?: boolean;
};

type OptionType<T extends Option> = T extends SelectOption
    ? keyof T['options']
    : T extends SwitchOption
    ? boolean
    : T extends SelectButtonsOption
    ? keyof T['options']
    : never;

type Option = SelectOption | SwitchOption | SelectButtonsOption;
type OptionMap = {[key: string]: Option};
type OptionMapType<T extends OptionMap> = {[K in keyof T]: OptionType<T[K]>};

type Props<T extends OptionMap> = {
    options: T;
    children: (values: OptionMapType<T>) => React.ReactNode;
    renderCodeFn?: (values: OptionMapType<T>) => string;
};

export default function Example<T extends OptionMap>(props: Props<T>) {
    const defaultValues: any = {};

    for (const optionKey of Object.keys(props.options)) {
        const option = props.options[optionKey];
        switch (option.type) {
            case 'select':
            case 'selectButtons':
                if (option.defaultValue) {
                    defaultValues[optionKey] = option.defaultValue;
                } else if (option.options.hasOwnProperty('default')) {
                    defaultValues[optionKey] = 'default';
                } else {
                    defaultValues[optionKey] = Object.keys(option.options)[0];
                }
                break;
            case 'switch':
                defaultValues[optionKey] = option.defaultValue ?? true;
                break;
        }
    }

    const [values, setValues] = useState(defaultValues);

    function _setValue(key: string, value: any) {
        setValues({...values, [key]: value});
    }

    return (
        <Box display="flex" position="absolute" top="0" left="0" right="0" bottom="0">
            <Box flex="auto" display="flex" flexDirection="column">
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding={2}
                >
                    {props.children(values)}
                </Box>
                {props.renderCodeFn && <ExampleCodePanel code={props.renderCodeFn(values)} />}
            </Box>

            <Box width="200px" borderLeft="thick" padding={3}>
                <Heading size="xsmall" marginBottom={3}>
                    Props
                </Heading>
                {Object.keys(props.options).map(optionKey => {
                    const option = props.options[optionKey];
                    switch (option.type) {
                        case 'select':
                            return (
                                <FormField key={optionKey} label={option.label}>
                                    <Select
                                        size="small"
                                        value={values[optionKey]}
                                        options={Object.keys(option.options).map(value => ({
                                            label: capitalize(value),
                                            value,
                                        }))}
                                        onChange={newValue => _setValue(optionKey, newValue)}
                                    />
                                </FormField>
                            );
                        case 'selectButtons':
                            return (
                                <FormField key={optionKey} label={option.label}>
                                    <SelectButtons
                                        size="small"
                                        value={values[optionKey]}
                                        options={Object.keys(option.options).map(value => ({
                                            label: capitalize(value),
                                            value,
                                        }))}
                                        onChange={newValue => _setValue(optionKey, newValue)}
                                    />
                                </FormField>
                            );
                        case 'switch':
                            return (
                                <Switch
                                    size="small"
                                    key={optionKey}
                                    label={option.label}
                                    value={values[optionKey]}
                                    onChange={newValue => _setValue(optionKey, newValue)}
                                    marginBottom={2}
                                />
                            );
                    }
                })}
            </Box>
        </Box>
    );
}
