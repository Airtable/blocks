// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';

const stories = storiesOf('Box/flexContainer', module);

const RedCube = () => <Box width={60} height={60} backgroundColor="red" />;

stories.add('alignContent', () => (
    <>
        <Box display="flex" border="default" flexWrap="wrap" alignContent="center" height={200}>
            <RedCube />
        </Box>
        <Box marginTop={2}>
            The align-content property modifies the behavior of the flex-wrap property. It is
            similar to align-items, but instead of aligning flex items, it aligns flex lines.
            https://www.w3schools.com/csSref/css3_pr_align-content.asp
        </Box>
    </>
));

stories.add('alignItems', () => (
    <>
        <Box display="flex" border="default" alignItems="center" height={200}>
            <RedCube />
        </Box>
    </>
));

stories.add('flexDirection', () => (
    <>
        <Box
            display="flex"
            border="default"
            flexDirection="column"
            alignItems="center"
            height={200}
        >
            <RedCube />
        </Box>
    </>
));

stories.add('flexWrap', () => (
    <>
        <Box
            display="flex"
            border="default"
            flexWrap="wrap"
            flexDirection="column"
            alignItems="center"
            height={200}
        >
            <RedCube />
        </Box>
    </>
));

stories.add('justifyContent', () => (
    <>
        <Box display="flex" border="default" justifyContent="center" height={200}>
            <RedCube />
        </Box>
        <Box display="flex" border="default" justifyContent="space-between" height={200}>
            <RedCube />
            <RedCube />
            <RedCube />
        </Box>
    </>
));

stories.add('justifyItems', () => (
    <>
        <Box display="flex" border="default" justifyItems="center" height={200}>
            <RedCube />
        </Box>
    </>
));
