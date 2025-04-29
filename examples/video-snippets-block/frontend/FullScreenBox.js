import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@airtable/blocks/base/ui';

export default function FullScreenBox({backgroundColor, children}) {
    return (
        <Box
            height="100vh"
            width="100vw"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            backgroundColor={backgroundColor || '#fff'}
        >
            {children}
        </Box>
    );
}

FullScreenBox.propTypes = {
    backgroundColor: PropTypes.string,
    children: PropTypes.node,
};
