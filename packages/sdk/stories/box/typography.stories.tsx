import React from 'react';
import Box from '../../src/base/ui/box';
import theme from '../../src/base/ui/theme/default_theme';
import {keys} from '../../src/shared/private_utils';

export default {
    component: Box,
};

export const FontFamily = {
    render: () => (
        <React.Fragment>
            {keys(theme.fontFamilies).map((fontFamilyKey) => (
                <Box key={fontFamilyKey} fontFamily={fontFamilyKey}>
                    {fontFamilyKey}: {theme.fontFamilies[fontFamilyKey]}
                </Box>
            ))}
        </React.Fragment>
    ),
};

export const FontSize = {
    render: () => (
        <React.Fragment>
            <Box fontSize="21px">Custom font size 21px</Box>
        </React.Fragment>
    ),
};

export const FontStyle = {
    render: () => (
        <React.Fragment>
            <Box fontStyle="italic">Italic</Box>
        </React.Fragment>
    ),
};

export const FontWeight = {
    render: () => (
        <React.Fragment>
            <Box fontWeight={600}>Custom font weight 600</Box>
        </React.Fragment>
    ),
};

export const LetterSpacing = {
    render: () => (
        <React.Fragment>
            <Box letterSpacing={5}>Letter spacing</Box>
        </React.Fragment>
    ),
};

export const LineHeight = {
    render: () => (
        <React.Fragment>
            <Box lineHeight={1.25}>Set line height</Box>
        </React.Fragment>
    ),
};

export const TextAlign = {
    render: () => (
        <React.Fragment>
            <Box textAlign="right">align right</Box>
        </React.Fragment>
    ),
};

export const TextTransform = {
    render: () => (
        <React.Fragment>
            <Box textTransform="uppercase">uppercase</Box>
        </React.Fragment>
    ),
};

export const TextColor = {
    render: () => (
        <React.Fragment>
            <Box textColor="red">Red text</Box>
        </React.Fragment>
    ),
};
