import React from 'react';
import {storiesOf} from '@storybook/react';
import {keys} from '../src/private_utils';
import Box from '../src/ui/box';
import Input from '../src/ui/input';
import Select from '../src/ui/select';
import Label from '../src/ui/label';
import {allStylesPropTypes} from '../src/ui/system';
import theme from '../src/ui/theme/default_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

const stories = storiesOf('Label', module);

function LabelExample() {
    const [value, setValue] = React.useState('');
    return (
        <Example
            options={{
                size: {
                    type: 'select',
                    label: 'Size',
                    options: keys(theme.textStyles.default),
                },
                textColor: {
                    type: 'selectButtons',
                    label: 'Text color',
                    options: ['default', 'light'],
                },
            }}
            styleProps={Object.keys(allStylesPropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);
                return `
                    import {Label, Box, Input} from '@airtable/blocks/ui';

                    // You might want to consider using \`FormField\` instead.
                    const LabelExample = () => {
                        const [value, setValue] = React.useState('');

                        return (
                            <Box>
                                <Label htmlFor="my-input" ${props}>Label</Label>
                                <Input id="my-input" value={value} onChange={e => setValue(e.target.value)} />
                            </Box>
                        );
                    };
                `;
            }}
        >
            {values => (
                <Box width={CONTROL_WIDTH}>
                    <Label htmlFor="my-input" {...values}>
                        Label
                    </Label>
                    <Input id="my-input" value={value} onChange={e => setValue(e.target.value)} />
                </Box>
            )}
        </Example>
    );
}

stories.add('example', () => <LabelExample />);

stories.add('with input', () => (
    <React.Fragment>
        <Box maxWidth="400px">
            <Label htmlFor="my-input">Label</Label>
            <Input id="my-input" onChange={() => {}} value="" />
        </Box>
    </React.Fragment>
));

stories.add('with select', () => (
    <React.Fragment>
        <Box maxWidth="400px">
            <Label htmlFor="my-input">Label</Label>
            <Select id="my-input" onChange={() => {}} options={[]} value="" />
        </Box>
    </React.Fragment>
));

stories.add('ref', () => (
    <React.Fragment>
        <Label
            ref={node => {
                // eslint-disable-next-line no-console
                console.log(node);
            }}
        >
            Look into your console to see the ref
        </Label>
    </React.Fragment>
));

stories.add('custom className', () => (
    <React.Fragment>
        <Label className="user-provided-class">Inspect element to see class name</Label>
    </React.Fragment>
));

stories.add('id attribute', () => (
    <React.Fragment>
        <Label id="my-id">Inspect element to see class name</Label>
    </React.Fragment>
));

stories.add('style attribute', () => (
    <React.Fragment>
        <Label
            style={{
                transform: 'scale(0.95)',
            }}
        >
            Inspect element to see style attribute
        </Label>
    </React.Fragment>
));

stories.add('data attributes', () => (
    <React.Fragment>
        <Label
            dataAttributes={{
                'data-something': true,
                'data-other': 'string value',
            }}
        >
            Inspect element to see data attributes
        </Label>
    </React.Fragment>
));

stories.add('role attribute', () => (
    <React.Fragment>
        <Label role="nav">Inspect element to see role attribute</Label>
    </React.Fragment>
));

stories.add('aria attributes', () => (
    <React.Fragment>
        <Label
            aria-label="__label__"
            aria-labelledby="__id__"
            aria-describedby="__id__"
            aria-controls="__id__"
            aria-expanded={false}
            aria-haspopup={false}
            aria-hidden={false}
            aria-live="off"
        >
            Inspect element to see aria attributes
        </Label>
    </React.Fragment>
));
