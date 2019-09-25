// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import Input from '../src/ui/input';
import Select from '../src/ui/select';
import Label from '../src/ui/label';

const stories = storiesOf('Label', module);

stories.add('with input', () => (
    <>
        <Box maxWidth="400px">
            <Label htmlFor="my-input">Label</Label>
            <Input id="my-input" onChange={() => {}} value="" />
        </Box>
    </>
));

stories.add('with select', () => (
    <>
        <Box maxWidth="400px">
            <Label htmlFor="my-input">Label</Label>
            <Select id="my-input" onChange={() => {}} options={[]} value="" />
        </Box>
    </>
));

stories.add('ref', () => (
    <>
        <Label
            ref={node => {
                // eslint-disable-next-line no-console
                console.log(node);
            }}
        >
            Look into your console to see the ref
        </Label>
    </>
));

stories.add('custom className', () => (
    <>
        <Label className="user-provided-class">Inspect element to see class name</Label>
    </>
));

stories.add('id attribute', () => (
    <>
        <Label id="my-id">Inspect element to see class name</Label>
    </>
));

stories.add('style attribute', () => (
    <>
        <Label
            style={{
                transform: 'scale(0.95)',
            }}
        >
            Inspect element to see style attribute
        </Label>
    </>
));

stories.add('data attributes', () => (
    <>
        <Label
            dataAttributes={{
                'data-something': true,
                'data-other': 'string value',
            }}
        >
            Inspect element to see data attributes
        </Label>
    </>
));

stories.add('role attribute', () => (
    <>
        <Label role="nav">Inspect element to see role attribute</Label>
    </>
));

stories.add('aria attributes', () => (
    <>
        <Label
            aria-label="__label__"
            aria-labelledby="__id__"
            aria-describedby="__id__"
            aria-controls="__id__"
            aria-expanded={false}
            aria-haspopup={false}
            aria-hidden={false}
            aria-live={false}
        >
            Inspect element to see aria attributes
        </Label>
    </>
));
