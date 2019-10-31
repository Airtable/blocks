import React from 'react';
import {storiesOf} from '@storybook/react';
import FormField from '../src/ui/form_field';
import Input from '../src/ui/input';
import Box from '../src/ui/text';

const stories = storiesOf('Input', module);

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
                    disabled
                    onChange={e => setValue(e.target.value)}
                />
            </Box>
        );
    }),
);
