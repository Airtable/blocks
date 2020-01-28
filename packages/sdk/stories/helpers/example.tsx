import React, {useState} from 'react';
import capitalize from 'lodash/capitalize';
import Select from '../../src/ui/select';
import SelectButtons from '../../src/ui/select_buttons';
import Switch from '../../src/ui/switch';
import Box from '../../src/ui/box';
import Heading from '../../src/ui/heading';
import FormField from '../../src/ui/form_field';
import {spawnUnknownSwitchCaseError} from '../../src/error_utils';
import ExampleCodePanel from './example_code_panel';
import categorizeStyleProps from './categorize_style_props';
import StylePropList from './style_prop_list';

interface SelectOption {
    type: 'select';
    label: string;
    options: Array<string>;
    defaultValue?: string;
}

interface SelectButtonsOption {
    type: 'selectButtons';
    label: string;
    options: Array<string>;
    defaultValue?: string;
}

interface SwitchOption {
    type: 'switch';
    label: string;
    defaultValue?: boolean;
}

type ArrayType<T extends Array<any>> = T extends Array<infer U> ? U : never;

type OptionType<T extends Option> = T extends SelectOption
    ? ArrayType<T['options']>
    : T extends SwitchOption
    ? boolean
    : T extends SelectButtonsOption
    ? ArrayType<T['options']>
    : never;

type Option = SelectOption | SwitchOption | SelectButtonsOption;
interface OptionMap {
    [key: string]: Option;
}
type OptionMapType<T extends OptionMap> = {[K in keyof T]: OptionType<T[K]>};

interface Props<T extends OptionMap> {
    options: T;
    styleProps?: Array<string>;
    children: (values: OptionMapType<T>) => React.ReactNode;
    renderCodeFn?: (values: OptionMapType<T>) => string;
    containerPadding?: number;
}

export default function Example<T extends OptionMap>(props: Props<T>) {
    const defaultValues: any = {};

    const [values, setValues] = useState(defaultValues);

    function _setValue(key: string, value: any) {
        setValues({...values, [key]: value});
    }

    for (const optionKey of Object.keys(props.options)) {
        const option = props.options[optionKey];
        switch (option.type) {
            case 'select':
            case 'selectButtons':
                if (option.defaultValue) {
                    defaultValues[optionKey] = option.defaultValue;
                } else if (option.options.includes('default')) {
                    defaultValues[optionKey] = 'default';
                } else {
                    defaultValues[optionKey] = option.options[0];
                }
                break;
            case 'switch':
                defaultValues[optionKey] = option.defaultValue ?? true;
                break;
            default:
                throw spawnUnknownSwitchCaseError('option.type', option, 'type');
        }
    }

    return (
        <Box display="flex" position="absolute" top="0" left="0" right="0" bottom="0">
            <Box flex="auto" display="flex" flexDirection="column">
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding={props.containerPadding || 2}
                    overflow="auto"
                    position="relative"
                >
                    {props.children(values)}
                </Box>
                {props.renderCodeFn && <ExampleCodePanel code={props.renderCodeFn(values)} />}
            </Box>

            <Box width="220px" borderLeft="thick" padding={3} overflow="auto">
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
                                        options={option.options.map(value => ({
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
                                        options={option.options.map(value => ({
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
                        default:
                            throw spawnUnknownSwitchCaseError('option.type', option, 'type');
                    }
                })}

                {props.styleProps && (
                    <StylePropList stylePropsByCategory={categorizeStyleProps(props.styleProps)} />
                )}
            </Box>
        </Box>
    );
}
