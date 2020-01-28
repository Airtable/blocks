import React from 'react';
import {storiesOf} from '@storybook/react';
import Box, {BoxProps} from '../src/ui/box';

const stories = storiesOf('Box/flexItem', module);

const RedCube = (props: BoxProps) => (
    <Box width={60} height={60} backgroundColor="red" {...props} />
);

stories.add('alignSelf', () => (
    <React.Fragment>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube alignSelf="center" />
        </Box>
    </React.Fragment>
));

stories.add('flexBasis', () => (
    <React.Fragment>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube flexBasis={100} />
        </Box>
    </React.Fragment>
));

stories.add('flexGrow', () => (
    <React.Fragment>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube flexGrow={1} />
        </Box>
    </React.Fragment>
));

stories.add('flexShrink', () => (
    <React.Fragment>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube flexShrink={0} />
        </Box>
    </React.Fragment>
));

stories.add('justifySelf', () => (
    <React.Fragment>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube justifySelf="flex-end" />
        </Box>
    </React.Fragment>
));

stories.add('order', () => (
    <React.Fragment>
        <Box display="flex" border="default" alignContent="center" height={200}>
            <RedCube order={3}>1</RedCube>
            <RedCube order={1}>2</RedCube>
            <RedCube order={2}>3</RedCube>
        </Box>
    </React.Fragment>
));
