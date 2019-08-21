// @flow
import * as React from 'react';
import {Box} from '@airtable/blocks/ui';

// The playground for the `Box` component is non-exhaustive,
// the box stories contain more exhaustive examples.
export default function BoxExample(props: void) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="200px"
            height="200px"
            backgroundColor="blueLight2"
        >
            Box
        </Box>
    );
}
