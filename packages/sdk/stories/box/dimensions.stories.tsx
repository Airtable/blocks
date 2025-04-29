import React from 'react';
import Box from '../../src/base/ui/box';

export default {
    component: Box,
};

export const Width = {
    render: () => (
        <React.Fragment>
            <Box border="default" padding={2} width={200}>
                {'width={200}'}
            </Box>
            <Box border="default" padding={2} width="200px">
                width="200px"
            </Box>
            <Box border="default" padding={2} width="40vw">
                width="40vw"
            </Box>
            <Box border="default" padding={2} width="50%">
                width="50%"
            </Box>
        </React.Fragment>
    ),
};

export const MinWidth = {
    render: () => (
        <React.Fragment>
            <Box border="default" padding={2} minWidth={200}>
                {'minWidth={200}'}
            </Box>
            <Box border="default" padding={2} minWidth="200px">
                minWidth="200px"
            </Box>
            <Box border="default" padding={2} minWidth="40vw">
                minWidth="40vw"
            </Box>
            <Box border="default" padding={2} minWidth="50%">
                minWidth="50%"
            </Box>
        </React.Fragment>
    ),
};

export const MaxWidth = {
    render: () => (
        <React.Fragment>
            <Box border="default" padding={2} maxWidth={200}>
                {'maxWidth={200}'}
            </Box>
            <Box border="default" padding={2} maxWidth="200px">
                maxWidth="200px"
            </Box>
            <Box border="default" padding={2} maxWidth="40vw">
                maxWidth="40vw"
            </Box>
            <Box border="default" padding={2} maxWidth="50%">
                maxWidth="50%"
            </Box>
        </React.Fragment>
    ),
};

export const Height = {
    render: () => (
        <React.Fragment>
            <Box border="default" padding={2} height={200}>
                {'height={200}'}
            </Box>
            <Box border="default" padding={2} height="200px">
                height="200px"
            </Box>
            <Box border="default" padding={2} height="40vw">
                height="40vw"
            </Box>
            <Box border="default" padding={2} height="50%">
                height="50%"
            </Box>
        </React.Fragment>
    ),
};

export const MinHeight = {
    render: () => (
        <React.Fragment>
            <Box border="default" padding={2} minHeight={200}>
                {'minHeight={200}'}
            </Box>
            <Box border="default" padding={2} minHeight="200px">
                minHeight="200px"
            </Box>
            <Box border="default" padding={2} minHeight="40vw">
                minHeight="40vw"
            </Box>
            <Box border="default" padding={2} minHeight="50%">
                minHeight="50%"
            </Box>
        </React.Fragment>
    ),
};

export const MaxHeight = {
    render: () => (
        <React.Fragment>
            <Box border="default" padding={2} maxHeight={200}>
                {'maxHeight={200}'}
            </Box>
            <Box border="default" padding={2} maxHeight="200px">
                maxHeight="200px"
            </Box>
            <Box border="default" padding={2} maxHeight="40vw">
                maxHeight="40vw"
            </Box>
            <Box border="default" padding={2} maxHeight="50%">
                maxHeight="50%"
            </Box>
        </React.Fragment>
    ),
};
