import React from 'react';
import Box, {BoxProps} from '../../src/ui/box';

export default {
    compoent: Box,
};

const RedCube = (props: BoxProps) => (
    <Box width={60} height={60} backgroundColor="red" {...props} />
);

export const AlignSelf = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignContent="center" height={200}>
                <RedCube alignSelf="center" />
            </Box>
        </React.Fragment>
    ),
};

export const FlexBasis = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignContent="center" height={200}>
                <RedCube flexBasis={100} />
            </Box>
        </React.Fragment>
    ),
};

export const FlexGrow = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignContent="center" height={200}>
                <RedCube flexGrow={1} />
            </Box>
        </React.Fragment>
    ),
};

export const FlexShrink = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignContent="center" height={200}>
                <RedCube flexShrink={0} />
            </Box>
        </React.Fragment>
    ),
};

export const JustifySelf = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignContent="center" height={200}>
                <RedCube justifySelf="flex-end" />
            </Box>
        </React.Fragment>
    ),
};

export const Order = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignContent="center" height={200}>
                <RedCube order={3}>1</RedCube>
                <RedCube order={1}>2</RedCube>
                <RedCube order={2}>3</RedCube>
            </Box>
        </React.Fragment>
    ),
};
