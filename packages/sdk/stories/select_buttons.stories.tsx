/* eslint-disable no-console */
import React, {useState} from 'react';
import Box from '../src/base/ui/box';
import Input from '../src/base/ui/input';
import FormField from '../src/base/ui/form_field';
import Heading from '../src/base/ui/heading';
import Select from '../src/base/ui/select';
import {keys} from '../src/shared/private_utils';
import SelectButtons, {selectButtonsStylePropTypes} from '../src/base/ui/select_buttons';
import useTheme from '../src/base/ui/theme/use_theme';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';
import Example from './helpers/example';

export default {
    component: SelectButtons,
};

function SelectButtonsExample() {
    const {selectButtonsSizes} = useTheme();
    const options = ['Banana', 'Apple', 'Orange'].map(value => ({
        value: value.toLowerCase(),
        label: value,
    }));
    const [value, setValue] = useState(options[0].value);

    return (
        <Example
            options={{
                size: {
                    type: 'selectButtons',
                    label: 'Size',
                    options: keys(selectButtonsSizes),
                },
                disabled: {
                    type: 'switch',
                    label: 'Disabled',
                    defaultValue: false,
                },
            }}
            styleProps={Object.keys(selectButtonsStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {SelectButtons} from '@airtable/blocks/ui';

                    const options = ${JSON.stringify(options)};

                    const SelectButtonsExample = () => {
                        const [value, setValue] = useState(options[0].value);

                        return (
                            <SelectButtons
                                value={value}
                                onChange={newValue => setValue(newValue)}
                                options={options}
                                ${props}
                                width="${CONTROL_WIDTH}"
                            />
                        )
                    }
                `;
            }}
        >
            {values => (
                <SelectButtons
                    value={value}
                    onChange={newValue => setValue(newValue as string)}
                    options={options}
                    {...values}
                    width={CONTROL_WIDTH}
                />
            )}
        </Example>
    );
}

export const _Example = {
    render: () => <SelectButtonsExample />,
};

function SelectButtonsSyncedExample() {
    const {selectButtonsSizes} = useTheme();
    const options = ['Banana', 'Apple', 'Orange'].map(value => ({
        value: value.toLowerCase(),
        label: value,
    }));
    const [value, setValue] = useState(options[0].value);

    return (
        <Example
            options={{
                size: {
                    type: 'selectButtons',
                    label: 'Size',
                    options: keys(selectButtonsSizes),
                },
                disabled: {
                    type: 'switch',
                    label: 'Disabled',
                    defaultValue: false,
                },
            }}
            styleProps={Object.keys(selectButtonsStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React from 'react';
                    import {SelectButtonsSynced} from '@airtable/blocks/ui';

                    const options = ${JSON.stringify(options)};

                    const SelectButtonsSyncedExample = () => {
                        return (
                            <SelectButtonsSynced
                                globalConfigKey="selectedOption"
                                options={options}
                                ${props}
                                width="${CONTROL_WIDTH}"
                            />
                        )
                    }
                `;
            }}
        >
            {values => (
                <SelectButtons
                    value={value}
                    onChange={newValue => setValue(newValue as string)}
                    options={options}
                    {...values}
                    width={CONTROL_WIDTH}
                />
            )}
        </Example>
    );
}

export const SyncedExample = {
    render: () => <SelectButtonsSyncedExample />,
};

export const Sizes = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = React.useState('Banana');
            const options = ['Banana', 'Apple', 'Orange'].map(_value => ({
                value: _value,
                label: _value,
            }));
            return (
                <React.Fragment>
                    <Box width={400} margin="auto">
                        <SelectButtons
                            size="small"
                            value={value}
                            onChange={val => setValue(val as string)}
                            options={options}
                            marginBottom={2}
                        />
                        <SelectButtons
                            size="default"
                            value={value}
                            onChange={val => setValue(val as string)}
                            options={options}
                            marginBottom={2}
                        />
                        <SelectButtons
                            size="large"
                            value={value}
                            onChange={val => setValue(val as string)}
                            options={options}
                            marginBottom={2}
                        />
                    </Box>
                </React.Fragment>
            );
        }),
};

export const Disabled = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = React.useState('Banana');
            const [value2, setValue2] = React.useState('Boston');
            const options = ['Banana', 'Apple', 'Orange'].map(_value => ({
                value: _value,
                label: _value,
            }));
            const options2 = ['Boston', 'Chicago', 'New York'].map((_value, index) => ({
                value: _value,
                label: _value,
                disabled: index === 2,
            }));
            return (
                <Box width={400} margin="auto">
                    <Heading size="xsmall">Entire component disabled</Heading>
                    <SelectButtons
                        disabled={true}
                        value={value}
                        onChange={val => setValue(val as string)}
                        options={options}
                        marginBottom={3}
                    />
                    <Heading size="xsmall">Single option disabled</Heading>
                    <SelectButtons
                        value={value2}
                        onChange={val => setValue2(val as string)}
                        options={options2}
                    />
                </Box>
            );
        }),
};

export const ForwardedRef = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = React.useState('Check');
            const options = ['Check', 'The', 'Console'].map(_value => ({
                value: _value,
                label: _value,
            }));
            return (
                <Box width={400} margin="auto">
                    <SelectButtons
                        ref={node => {
                            console.log(node);
                        }}
                        value={value}
                        onChange={val => setValue(val as string)}
                        options={options}
                        marginBottom={3}
                    />
                </Box>
            );
        }),
};

export const ResponsiveSize = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = React.useState('Resize');
            const options = ['Resize', 'The', 'Window'].map(_value => ({
                value: _value,
                label: _value,
            }));
            return (
                <Box>
                    <SelectButtons
                        size={{
                            xsmallViewport: 'small',
                            mediumViewport: 'default',
                            largeViewport: 'large',
                        }}
                        value={value}
                        onChange={val => setValue(val as string)}
                        options={options}
                        marginBottom={3}
                    />
                </Box>
            );
        }),
};

export const TruncatedText = {
    render: () =>
        React.createElement(() => {
            const [value, setValue] = React.useState('neat');
            const options = ['Some really long text that just keeps going', 'neat', 'cool'].map(
                _value => ({
                    value: _value,
                    label: _value,
                }),
            );
            return (
                <Box margin="auto" width="250px">
                    <SelectButtons
                        value={value}
                        onChange={val => setValue(val as string)}
                        options={options}
                        marginBottom={3}
                    />
                </Box>
            );
        }),
};

export const TabBehaviorForManyInputs = {
    render: () =>
        React.createElement(() => {
            const [food, setFood] = React.useState('');
            const [veggie, setVeggie] = React.useState('Squash');
            const [fruit, setFruit] = React.useState('Apple');
            const [junkfood, setJunkfood] = React.useState('Candy');
            const veggies = ['Bok choy', 'Squash', 'Carrot', 'Broccoli'].map(value => ({
                value,
                label: value,
            }));
            const fruits = ['Banana', 'Apple', 'Orange'].map(value => ({
                value,
                label: value,
            }));
            const junkfoods = ['Pizza', 'Milkshake', 'Burger', 'Candy', 'Soda'].map(value => ({
                value,
                label: value,
            }));
            return (
                <React.Fragment>
                    <Box width={400} margin="auto">
                        <FormField label="Enter a food">
                            <Input value={food} onChange={e => setFood(e.target.value)} />
                        </FormField>
                        <SelectButtons
                            value={veggie}
                            onChange={val => setVeggie(val as string)}
                            options={veggies}
                            marginBottom={2}
                        />
                        <FormField label="Pick a fruit">
                            <Select
                                options={fruits}
                                value={fruit}
                                onChange={val => setFruit(val as string)}
                            ></Select>
                        </FormField>
                        <SelectButtons
                            value={junkfood}
                            onChange={val => setJunkfood(val as string)}
                            options={junkfoods}
                            marginBottom={2}
                        />
                    </Box>
                </React.Fragment>
            );
        }),
};
