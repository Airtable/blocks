/* eslint-disable no-console */
// @flow
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import Switch, {switchStylePropTypes} from '../src/ui/switch';
import theme from '../src/ui/theme/default_theme';
import {keys} from '../src/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

const stories = storiesOf('Switch', module);

const sharedExampleProps = {
    options: {
        variant: {
            type: 'selectButtons',
            label: 'Variant',
            options: keys(theme.switchVariants),
        },
        size: {
            type: 'selectButtons',
            label: 'Size',
            options: keys(theme.switchSizes),
        },
        disabled: {
            type: 'switch',
            label: 'Disabled',
            defaultValue: false,
        },
        backgroundColor: {
            type: 'switch',
            label: 'Hide background',
            defaultValue: false,
        },
    },
    styleProps: Object.keys(switchStylePropTypes),
} as const;

function SwitchExample() {
    const [isEnabled, setIsEnabled] = useState(true);
    return (
        <Example
            {...sharedExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    backgroundColor: value => (value ? 'transparent' : null),
                });

                return `
                    import React, {useState} from 'react';
                    import {Switch} from '@airtable/blocks/ui';

                    const SwitchExample = () => {
                        const [isEnabled, setIsEnabled] = useState(true);

                        return (
                            <Switch
                                value={isEnabled}
                                onChange={newValue => setIsEnabled(newValue)}
                                label="Is switch enabled"
                                ${props}
                                width="${CONTROL_WIDTH}"
                            />
                        );
                    };
                `;
            }}
        >
            {({backgroundColor, ...values}) => {
                return (
                    <Switch
                        value={isEnabled}
                        onChange={newValue => setIsEnabled(newValue)}
                        label="Is switch enabled"
                        {...values}
                        backgroundColor={backgroundColor ? 'transparent' : undefined}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

stories.add('example', () => <SwitchExample />);

function SwitchSyncedExample() {
    const [isEnabled, setIsEnabled] = useState(true);
    return (
        <Example
            {...sharedExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    backgroundColor: value => (value ? 'transparent' : null),
                });

                return `
                    import React, {useState} from 'react';
                    import {SwitchSynced} from '@airtable/blocks/ui';

                    const SwitchSyncedExample = () => {
                        return (
                            <SwitchSynced
                                globalConfigKey="keyName"
                                label="Is switch enabled"
                                ${props}
                                width="${CONTROL_WIDTH}"
                            />
                        );
                    };
                `;
            }}
        >
            {({backgroundColor, ...values}) => {
                return (
                    <Switch
                        value={isEnabled}
                        onChange={newValue => setIsEnabled(newValue)}
                        label="Is switch enabled"
                        backgroundColor={backgroundColor ? 'transparent' : undefined}
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

stories.add('example synced', () => <SwitchSyncedExample />);

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
                <Switch
                    value={isChecked}
                    onChange={setIsChecked}
                    label="Inspect me"
                    disabled={true}
                />
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
