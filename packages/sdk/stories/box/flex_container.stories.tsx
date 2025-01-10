import React from 'react';
import Box from '../../src/ui/box';

export default {
    component: Box,
};

const RedCube = () => <Box width={60} height={60} backgroundColor="red" />;

export const AlignContent = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" flexWrap="wrap" alignContent="center" height={200}>
                <RedCube />
            </Box>
            <Box marginTop={2}>
                The align-content property modifies the behavior of the flex-wrap property. It is
                similar to align-items, but instead of aligning flex items, it aligns flex lines.
                https://www.w3schools.com/csSref/css3_pr_align-content.asp
            </Box>
        </React.Fragment>
    ),
};

export const AlignItems = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" alignItems="center" height={200}>
                <RedCube />
            </Box>
        </React.Fragment>
    ),
};

export const FlexDirection = {
    render: () => (
        <React.Fragment>
            <Box
                display="flex"
                border="default"
                flexDirection="column"
                alignItems="center"
                height={200}
            >
                <RedCube />
            </Box>
        </React.Fragment>
    ),
};

export const FlexWrap = {
    render: () => (
        <React.Fragment>
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
        </React.Fragment>
    ),
};

export const JustifyContent = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" justifyContent="center" height={200}>
                <RedCube />
            </Box>
            <Box display="flex" border="default" justifyContent="space-between" height={200}>
                <RedCube />
                <RedCube />
                <RedCube />
            </Box>
        </React.Fragment>
    ),
};

export const JustifyItems = {
    render: () => (
        <React.Fragment>
            <Box display="flex" border="default" justifyItems="center" height={200}>
                <RedCube />
            </Box>
        </React.Fragment>
    ),
};
