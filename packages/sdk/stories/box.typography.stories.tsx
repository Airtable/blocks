import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import theme from '../src/ui/theme/default_theme/';
import {keys} from '../src/private_utils';

const stories = storiesOf('Box/typography', module);

stories.add('fontFamily', () => (
    <React.Fragment>
        {keys(theme.fontFamilies).map(fontFamilyKey => (
            <Box key={fontFamilyKey} fontFamily={fontFamilyKey}>
                {fontFamilyKey}: {theme.fontFamilies[fontFamilyKey]}
            </Box>
        ))}
    </React.Fragment>
));

stories.add('fontSize', () => (
    <React.Fragment>
        <Box fontSize="21px">Custom font size 21px</Box>
    </React.Fragment>
));

stories.add('fontStyle', () => (
    <React.Fragment>
        <Box fontStyle="italic">Italic</Box>
    </React.Fragment>
));

stories.add('fontWeight', () => (
    <React.Fragment>
        <Box fontWeight={600}>Custom font weight 600</Box>
    </React.Fragment>
));

stories.add('letterSpacing', () => (
    <React.Fragment>
        <Box letterSpacing={5}>Letter spacing</Box>
    </React.Fragment>
));

stories.add('lineHeight', () => (
    <React.Fragment>
        <Box lineHeight={1.25}>Set line height</Box>
    </React.Fragment>
));

stories.add('textAlign', () => (
    <React.Fragment>
        <Box textAlign="right">align right</Box>
    </React.Fragment>
));

stories.add('textTransform', () => (
    <React.Fragment>
        <Box textTransform="uppercase">uppercase</Box>
    </React.Fragment>
));

stories.add('textColor', () => (
    <React.Fragment>
        <Box textColor="red">Red text</Box>
    </React.Fragment>
));
