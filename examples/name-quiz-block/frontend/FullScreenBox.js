import React from 'react';
import {Box} from '@airtable/blocks/ui';

/**
 * A presentational helper component to render a Box full screen.
 */
export default function FullScreenBox({children, ...props}) {
    return (
        <Box position="absolute" top={0} bottom={0} left={0} right={0} {...props}>
            {children}
        </Box>
    );
}

FullScreenBox.propTypes = Box.propTypes;
