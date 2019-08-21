// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import theme from '../src/ui/theme/default_theme';

const stories = storiesOf('Box/typography', module);

stories.add('fontFamily', () => (
    <>
        {Object.keys(theme.fontFamilies).map(fontFamilyKey => (
            <Box key={fontFamilyKey} fontFamily={fontFamilyKey}>
                {fontFamilyKey}: {theme.fontFamilies[fontFamilyKey]}
            </Box>
        ))}
    </>
));

stories.add('fontSize', () => (
    <>
        <Box fontSize="21px">Custom font size 21px</Box>
    </>
));

stories.add('fontStyle', () => (
    <>
        <Box fontStyle="italic">Italic</Box>
    </>
));

stories.add('fontWeight', () => (
    <>
        <Box fontWeight={600}>Custom font weight 600</Box>
    </>
));

stories.add('letterSpacing', () => (
    <>
        <Box letterSpacing={5}>Letter spacing</Box>
    </>
));

stories.add('lineHeight', () => (
    <>
        <Box lineHeight={1.25}>Set line height</Box>
    </>
));

stories.add('textAlign', () => (
    <>
        <Box textAlign="right">align right</Box>
    </>
));

stories.add('textTransform', () => (
    <>
        <Box textTransform="uppercase">uppercase</Box>
    </>
));

stories.add('textColor', () => (
    <>
        <Box textColor="red">Red text</Box>
    </>
));
