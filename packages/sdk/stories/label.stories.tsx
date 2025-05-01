import React from 'react';
import {keys} from '../src/shared/private_utils';
import Box from '../src/base/ui/box';
import Input from '../src/base/ui/input';
import Select from '../src/base/ui/select';
import Label from '../src/base/ui/label';
import {allStylesPropTypes} from '../src/base/ui/system';
import theme from '../src/base/ui/theme/default_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

export default {
    component: Label,
};

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
                    import {Label, Box, Input} from '@airtable/blocks/base/ui';

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

export const _Example = {
    render: () => <LabelExample />,
};

export const WithInput = {
    render: () => (
        <React.Fragment>
            <Box maxWidth="400px">
                <Label htmlFor="my-input">Label</Label>
                <Input id="my-input" onChange={() => {}} value="" />
            </Box>
        </React.Fragment>
    ),
};

export const WithSelect = {
    render: () => (
        <React.Fragment>
            <Box maxWidth="400px">
                <Label htmlFor="my-input">Label</Label>
                <Select id="my-input" onChange={() => {}} options={[]} value="" />
            </Box>
        </React.Fragment>
    ),
};

export const Ref = {
    render: () => (
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
    ),
};

export const CustomClassName = {
    render: () => (
        <React.Fragment>
            <Label className="user-provided-class">Inspect element to see class name</Label>
        </React.Fragment>
    ),
};

export const IdAttribute = {
    render: () => (
        <React.Fragment>
            <Label id="my-id">Inspect element to see class name</Label>
        </React.Fragment>
    ),
};

export const StyleAttribute = {
    render: () => (
        <React.Fragment>
            <Label
                style={{
                    transform: 'scale(0.95)',
                }}
            >
                Inspect element to see style attribute
            </Label>
        </React.Fragment>
    ),
};

export const DataAttributes = {
    render: () => (
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
    ),
};

export const RoleAttribute = {
    render: () => (
        <React.Fragment>
            <Label role="nav">Inspect element to see role attribute</Label>
        </React.Fragment>
    ),
};

export const AriaAttributes = {
    render: () => (
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
    ),
};
