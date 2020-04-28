import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@airtable/blocks/ui';

export default function FullScreenBox({children}) {
    return (
        <Box
            height="100vh"
            width="100vw"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#222"
        >
            {children}
        </Box>
    );
}

FullScreenBox.propTypes = {
    children: PropTypes.node,
};
