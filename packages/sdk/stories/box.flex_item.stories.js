// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';

const stories = storiesOf('Box/flexItem', module);

const RedCube = props => <Box width={60} height={60} backgroundColor="red" {...props} />;

stories.add('alignSelf', () => (
    <>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube alignSelf="center" />
        </Box>
    </>
));

stories.add('flexBasis', () => (
    <>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube flexBasis={100} />
        </Box>
    </>
));

stories.add('flexGrow', () => (
    <>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube flexGrow={1} />
        </Box>
    </>
));

stories.add('flexShrink', () => (
    <>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube flexShrink={0} />
        </Box>
    </>
));

stories.add('justifySelf', () => (
    <>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube justifySelf="flex-end" />
        </Box>
    </>
));

stories.add('order', () => (
    <>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube order={3}>1</RedCube>
            <RedCube order={1}>2</RedCube>
            <RedCube order={2}>3</RedCube>
        </Box>
    </>
));
