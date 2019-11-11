import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import Box from '../src/ui/box';
import Select from '../src/ui/select';
import Tooltip from '../src/ui/tooltip';
import FormField from '../src/ui/form_field';

const stories = storiesOf('Select', module);

const options = ['Apple', 'Pear', 'Banana'].map(value => ({value, label: value}));
const longOptions = [
    'Xavier Institute for Higher Learning',
    'Awesome cats from internet',
    'Business ideas I will build one day',
].map(value => ({value, label: value}));

stories.add('sizes', () => (
    <React.Fragment>
        <Box maxWidth="160px" margin={3}>
            <Select size="small" options={options} value={options[0].value} margin={2} />
            <Select size="default" options={options} value={options[0].value} margin={2} />
            <Select size="large" options={options} value={options[0].value} margin={2} />
        </Box>
        <Box maxWidth="320px" margin={3}>
            <Select size="small" options={longOptions} value={longOptions[0].value} margin={2} />
            <Select size="default" options={longOptions} value={longOptions[0].value} margin={2} />
            <Select size="large" options={longOptions} value={longOptions[0].value} margin={2} />
        </Box>
    </React.Fragment>
));

stories.add('disabled', () => (
    <Box maxWidth="400px" margin={3}>
        <Select disabled={true} options={options} value={options[0].value} margin={2} />
    </Box>
));

stories.add('label overflow', () => (
    <Box maxWidth="200px" margin={3}>
        <Select size="small" options={longOptions} value={longOptions[0].value} margin={2} />
        <Select size="default" options={longOptions} value={longOptions[0].value} margin={2} />
        <Select size="large" options={longOptions} value={longOptions[0].value} margin={2} />
    </Box>
));

stories.add('ref', () => (
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
));

stories.add('inside form field', () => (
    <Box maxWidth="400px" margin={3}>
        <FormField label="Select field">
            <Select options={options} value={options[0].value} />
        </FormField>
    </Box>
));

stories.add('with tooltip', () => (
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
));
