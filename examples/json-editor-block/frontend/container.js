import React from 'react';
import {Box} from '@airtable/blocks/ui';

// Container element which takes up the full viewport and centers its children.
export default function Container({children, style}) {
    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={style}
        >
            {children}
        </Box>
    );
}
