import React, {useState} from 'react';
import Box from '../src/ui/box';
import Select, {selectStylePropTypes} from '../src/ui/select';
import Tooltip from '../src/ui/tooltip';
import FormField from '../src/ui/form_field';
import theme from '../src/ui/theme/default_theme';
import {keys} from '../src/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

export default {
    component: Select,
};

const options = ['Apple', 'Pear', 'Banana'].map(value => ({value, label: value}));
const longOptions = [
    'Xavier Institute for Higher Learning',
    'Awesome cats from internet',
    'Business ideas I will build one day',
].map(value => ({value, label: value}));

const sharedSelectExampleProps = {
    options: {
        size: {
            type: 'selectButtons',
            label: 'Size',
            options: keys(theme.selectSizes),
        },
        disabled: {
            type: 'switch',
            label: 'Disabled',
            defaultValue: false,
        },
    },
    styleProps: Object.keys(selectStylePropTypes),
} as const;

function SelectExample() {
    const [value, setValue] = useState(options[0].value);
    return (
        <Example
            {...sharedSelectExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import React, {useState} from 'react';
                    import {Select} from '@airtable/blocks/ui';

                    const options = ${JSON.stringify(options)};

                    const SelectExample = () => {
                        const [value, setValue] = useState(options[0].value);

                        return <Select options={options} value={value} onChange={newValue => setValue(newValue)} ${props} width="${CONTROL_WIDTH}"/>
                    };
                `;
            }}
        >
            {values => {
                return (
                    <Select
                        options={options}
                        value={value}
                        onChange={newValue => setValue(newValue as string)}
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <SelectExample />,
};

function SelectSyncedExample() {
    const [value, setValue] = useState(options[0].value);
    return (
        <Example
            {...sharedSelectExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import {SelectSynced} from '@airtable/blocks/ui';

                    const options = ${JSON.stringify(options)};

                    const selectSyncedExample = (
                        <SelectSynced options={options} globalConfigKey="selectedOption" ${props} width="${CONTROL_WIDTH}"/>
                    );
                `;
            }}
        >
            {values => {
                return (
                    <Select
                        options={options}
                        value={value}
                        onChange={newValue => setValue(newValue as string)}
                        {...values}
                        width={CONTROL_WIDTH}
                    />
                );
            }}
        </Example>
    );
}

export const SyncedExample = {
    render: () => <SelectSyncedExample />,
};

export const Sizes = {
    render: () => (
        <React.Fragment>
            <Box maxWidth="160px" margin={3}>
                <Select size="small" options={options} value={options[0].value} margin={2} />
                <Select size="default" options={options} value={options[0].value} margin={2} />
                <Select size="large" options={options} value={options[0].value} margin={2} />
            </Box>
            <Box maxWidth="320px" margin={3}>
                <Select
                    size="small"
                    options={longOptions}
                    value={longOptions[0].value}
                    margin={2}
                />
                <Select
                    size="default"
                    options={longOptions}
                    value={longOptions[0].value}
                    margin={2}
                />
                <Select
                    size="large"
                    options={longOptions}
                    value={longOptions[0].value}
                    margin={2}
                />
            </Box>
        </React.Fragment>
    ),
};

export const Disabled = {
    render: () => (
        <Box maxWidth="400px" margin={3}>
            <Select disabled={true} options={options} value={options[0].value} margin={2} />
        </Box>
    ),
};

export const LabelOverflow = {
    render: () => (
        <Box maxWidth="200px" margin={3}>
            <Select size="small" options={longOptions} value={longOptions[0].value} margin={2} />
            <Select size="default" options={longOptions} value={longOptions[0].value} margin={2} />
            <Select size="large" options={longOptions} value={longOptions[0].value} margin={2} />
        </Box>
    ),
};

export const Ref = {
    render: () => (
        <Box maxWidth="400px" margin={3}>
            <Select
                ref={node => {
                    // eslint-disable-next-line no-console
                    console.log(node);
                }}
                options={options}
                value={options[0].value}
            />
        </Box>
    ),
};

export const InsideFormField = {
    render: () => (
        <Box maxWidth="400px" margin={3}>
            <FormField label="Select field">
                <Select options={options} value={options[0].value} />
            </FormField>
        </Box>
    ),
};

export const WithTooltip = {
    render: () => (
        <Box maxWidth="400px" margin={3}>
            <Tooltip
                content="Tooltip content"
                placementX={Tooltip.placements.CENTER}
                placementY={Tooltip.placements.BOTTOM}
                placementOffsetX={0}
                placementOffsetY={8}
            >
                <Select options={options} value={options[0].value} margin={2} />
            </Tooltip>
        </Box>
    ),
};
