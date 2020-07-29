import React from 'react';
import {Box} from '@airtable/blocks/ui';

const FullscreenBox = ({shouldCenterContent = false, ...props}, ref) => {
    return (
        <Box
            ref={ref}
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
            {...(shouldCenterContent
                ? {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                  }
                : null)}
            {...props}
        />
    );
};

export default React.forwardRef(FullscreenBox);
