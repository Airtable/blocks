import React, {useState} from 'react';
import {injectGlobal} from 'emotion';
import capitalize from 'lodash/capitalize';
import Select from '../../src/base/ui/select';
import SelectButtons from '../../src/base/ui/select_buttons';
import Switch from '../../src/base/ui/switch';
import Box from '../../src/base/ui/box';
import Text from '../../src/base/ui/text';
import Heading from '../../src/base/ui/heading';
import FormField from '../../src/base/ui/form_field';
import {spawnUnknownSwitchCaseError} from '../../src/shared/error_utils';
import ExampleCodePanel from './example_code_panel';
import {SelectOptionValue} from '../../src/base/ui/select_and_select_buttons_helpers';

injectGlobal(`
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
`);

interface SelectOption {
    type: 'select';
    label: string;
    options: Array<string | number>;
    defaultValue?: string | number;
    renderLabel?: (label: string) => string;
}

interface SelectButtonsOption {
    type: 'selectButtons';
    label: string;
    options: Array<string | number>;
    defaultValue?: string | number;
    renderLabel?: (label: string) => string;
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
    options?: T;
    children: (values: OptionMapType<T>) => React.ReactNode;
    renderCodeFn?: (values: OptionMapType<T>) => string;
    containerPadding?: number;
}

export default function Example<T extends OptionMap>(props: Props<T>) {
    const {options} = props;
    const defaultValues: any = {};

    if (options) {
        for (const optionKey of Object.keys(options)) {
            const option = options[optionKey];
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
    }

    const [values, setValues] = useState(defaultValues);

    const children = props.children(values);

    function _setValue(key: string, value: any) {
        console.log();
        setValues({...values, [key]: value});
    }

    return (
        <Box display="flex" position="absolute" top="0" left="0" right="0" bottom="0">
            <ExampleMain code={props.renderCodeFn ? props.renderCodeFn(values) : null}>
                {children}
            </ExampleMain>

            <Box width="264px" flex="none" borderLeft="thick" padding={3} overflow="auto">
                <Heading size="xsmall" marginBottom={3}>
                    Props
                </Heading>
                {options ? (
                    Object.keys(options).map(optionKey => {
                        const option = options[optionKey];
                        switch (option.type) {
                            case 'select':
                            case 'selectButtons': {
                                const optionsType = typeof option.options[0];
                                const renderLabel = option.renderLabel ?? capitalize;
                                const sharedProps = {
                                    size: 'small' as const,
                                    value: String(values[optionKey]),
                                    options: option.options.map(String).map(value => ({
                                        label: renderLabel(value),
                                        value,
                                    })),
                                    onChange: (newValue: SelectOptionValue) => {
                                        switch (optionsType) {
                                            case 'number':
                                                _setValue(optionKey, Number(newValue));
                                                break;
                                            case 'string':
                                                _setValue(optionKey, newValue);
                                                break;
                                        }
                                    },
                                };
                                switch (option.type) {
                                    case 'select':
                                        return (
                                            <FormField key={optionKey} label={option.label}>
                                                <Select {...sharedProps} />
                                            </FormField>
                                        );
                                    case 'selectButtons':
                                        return (
                                            <FormField key={optionKey} label={option.label}>
                                                <SelectButtons {...sharedProps} />
                                            </FormField>
                                        );
                                }
                            }
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
                    })
                ) : (
                    <Text textColor="light" fontStyle="italic">
                        This example has no options.
                    </Text>
                )}
            </Box>
        </Box>
    );
}

const CODE_PANEL_INITIAL_HEIGHT = 140;
const CODE_PANEL_MIN_HEIGHT = 24;

function ExampleMain({code, children}: {code: string | null; children: React.ReactNode}) {
    const [codePanelHeight, setCodePanelHeight] = useState(CODE_PANEL_INITIAL_HEIGHT);
    return (
        <Box
            flex="auto"
            display="flex"
            flexDirection="column"
            position="relative"
            style={{paddingBottom: codePanelHeight}}
        >
            <Box
                flex="auto"
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding={2}
                overflowX="auto"
                position="relative"
            >
                {children}
            </Box>
            {code && (
                <ExampleCodePanel
                    onHeightChange={setCodePanelHeight}
                    code={code}
                    initialHeight={CODE_PANEL_INITIAL_HEIGHT}
                    minHeight={CODE_PANEL_MIN_HEIGHT}
                />
            )}
        </Box>
    );
}
