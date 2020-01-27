/* eslint-disable no-console */
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import FormField from '../src/ui/form_field';
import Input, {inputStylePropTypes} from '../src/ui/input';
import Box from '../src/ui/text';
import theme from '../src/ui/theme/default_theme';
import {keys} from '../src/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

const stories = storiesOf('Input', module);

const sharedExampleProps = {
    options: {
        size: {
            type: 'selectButtons',
            label: 'Size',
            options: keys(theme.inputSizes),
        },
        disabled: {
            type: 'switch',
            label: 'Disabled',
            defaultValue: false,
        },
    },
    styleProps: Object.keys(inputStylePropTypes),
} as const;

function InputExample() {
    const [value, setValue] = useState('');
    return (
        <Example
            {...sharedExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {Input} from '@airtable/blocks/ui';

                    const InputExample = () => {
                        const [value, setValue] = useState('');

                        return (
                            <Input
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                placeholder="Placeholder"
                                ${props}
                                width="${CONTROL_WIDTH}"
                            />
                        );
                    };
                `;
            }}
        >
            {values => {
                return (
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Placeholder"
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

stories.add('example', () => <InputExample />);

function InputSyncedExample() {
    const [value, setValue] = useState('');
    return (
        <Example
            {...sharedExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {InputSynced} from '@airtable/blocks/ui';

                    const InputSyncedExample = () => {
                        return (
                            <InputSynced
                                globalConfigKey="apiKey"
                                placeholder="Placeholder"
                                ${props}
                                width="${CONTROL_WIDTH}"
                            />
                        );
                    };
                `;
            }}
        >
            {values => {
                return (
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Placeholder"
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

stories.add('example synced', () => <InputSyncedExample />);

stories.add('sizes', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('');
        return (
            <Box margin="auto" width={300}>
                <Input
                    value={value}
                    size={'small'}
                    onChange={e => setValue(e.target.value)}
                    margin={2}
                />
                <Input
                    value={value}
                    size={'default'}
                    onChange={e => setValue(e.target.value)}
                    margin={2}
                />
                <Input
                    value={value}
                    size={'large'}
                    onChange={e => setValue(e.target.value)}
                    margin={2}
                />
            </Box>
        );
    }),
);

stories.add('inside form field', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('');
        return (
            <Box margin="auto" width={300}>
                <FormField label="My input value">
                    <Input value={value} size={'small'} onChange={e => setValue(e.target.value)} />
                </FormField>
            </Box>
        );
    }),
);

stories.add('with ref', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('Check the console');
        return (
            <Box margin="auto" width={300}>
                <Input
                    ref={node => console.log(node)}
                    value={value}
                    size={'small'}
                    onChange={e => setValue(e.target.value)}
                />
            </Box>
        );
    }),
);

stories.add('responsive sizing', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('Resize the window');
        return (
            <Box margin="auto" width={300}>
                <Input
                    ref={node => console.log(node)}
                    value={value}
                    size={{
                        xsmallViewport: 'small',
                        mediumViewport: 'default',
                        largeViewport: 'large',
                    }}
                    onChange={e => setValue(e.target.value)}
                />
            </Box>
        );
    }),
);

stories.add('disabled', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState("I'm disabled");
        return (
            <Box margin="auto" width={300}>
                <Input
                    ref={node => console.log(node)}
                    value={value}
                    disabled={true}
                    onChange={e => setValue(e.target.value)}
                />
            </Box>
        );
    }),
);
