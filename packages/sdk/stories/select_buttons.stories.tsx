import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import Heading from '../src/ui/heading';
import SelectButtons from '../src/ui/select_buttons';

const stories = storiesOf('SelectButtons', module);

stories.add('sizes', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('Banana');
        const options = ['Banana', 'Apple', 'Orange'].map(value => ({
            value,
            label: value,
        }));
        return (
            <>
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
            </>
        );
    }),
);

stories.add('disabled', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('Banana');
        const [value2, setValue2] = React.useState('Boston');
        const options = ['Banana', 'Apple', 'Orange'].map(value => ({
            value,
            label: value,
        }));
        const options2 = ['Boston', 'Chicago', 'New York'].map((value, index) => ({
            value,
            label: value,
            disabled: index === 2,
        }));
        return (
            <Box width={400} margin="auto">
                <Heading size="xsmall">Entire component disabled</Heading>
                <SelectButtons
                    disabled
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
);

stories.add('forwarded ref', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('Check');
        const options = ['Check', 'The', 'Console'].map(value => ({
            value,
            label: value,
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
);

stories.add('responsive size', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('Resize');
        const options = ['Resize', 'The', 'Window'].map(value => ({
            value,
            label: value,
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
);

stories.add('truncated text', () =>
    React.createElement(() => {
        const [value, setValue] = React.useState('neat');
        const options = ['Some really long text that just keeps going', 'neat', 'cool'].map(
            value => ({
                value,
                label: value,
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
);
