// @flow
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import Switch from '../src/ui/switch';

const stories = storiesOf('Switch', module);

stories.add('sizes', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    size="small"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Small switch"
                    marginBottom={2}
                />
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Default switch"
                    marginBottom={2}
                />
                <Switch
                    size="large"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Large switch"
                />
            </Box>
        );
    }),
);

stories.add('variants', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    variant="default"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Default switch"
                    marginBottom={2}
                />
                <Switch
                    variant="danger"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Danger switch"
                />
            </Box>
        );
    }),
);

stories.add('disabled', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch value={isChecked} onChange={setIsChecked} label="Inspect me" disabled />
            </Box>
        );
    }),
);

stories.add('override backgroundColor', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    backgroundColor="transparent"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Transparent"
                    marginBottom={2}
                />
                <Switch
                    backgroundColor="black"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Black ?"
                    marginBottom={2}
                />
                <Switch
                    backgroundColor="red"
                    value={isChecked}
                    onChange={setIsChecked}
                    label="This bg-color may be a criminal offense"
                />
            </Box>
        );
    }),
);

stories.add('override width', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="default (100%)"
                    marginBottom={2}
                />
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="fit-content"
                    width="fit-content"
                />
            </Box>
        );
    }),
);

stories.add('forwarded ref', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    ref={node => console.log(node)}
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Check the console"
                />
            </Box>
        );
    }),
);

stories.add('responsive size', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    size={{
                        xsmallViewport: 'small',
                        mediumViewport: 'default',
                        largeViewport: 'large',
                    }}
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Resize the window"
                />
            </Box>
        );
    }),
);

stories.add('custom classname', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Inspect me"
                    className="user-provided-classname"
                />
            </Box>
        );
    }),
);

stories.add('id attribute', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Inspect me"
                    id="user-provided-id"
                />
            </Box>
        );
    }),
);

stories.add('style attribute', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Inspect me"
                    style={{
                        padding: 0,
                        height: '50px',
                        backgroundColor: 'orange',
                    }}
                />
            </Box>
        );
    }),
);

stories.add('errors with no label', () =>
    React.createElement(() => {
        const [isChecked, setIsChecked] = useState(true);
        return (
            <Box maxWidth="300px" margin="auto">
                <Box>Check the console</Box>
                <Switch value={isChecked} onChange={setIsChecked} />
            </Box>
        );
    }),
);
