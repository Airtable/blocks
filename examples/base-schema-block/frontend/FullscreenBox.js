import React from 'react';
import {Box} from '@airtable/blocks/ui';

/**
 * Utility component to wrap children in a container that fills the full container.
 *
 * @param {Element} children
 */
export default function FullscreenBox({children, ...props}) {
    return (
        <Box position="absolute" top="0" bottom="0" left="0" right="0" {...props}>
            {children}
        </Box>
    );
}

FullscreenBox.propTypes = Box.propTypes;
