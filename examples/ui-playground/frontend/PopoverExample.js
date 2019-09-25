// @flow
import React, {useState} from 'react';
import {Button, Popover, Box} from '@airtable/blocks/ui';

export default function PopoverExample(props: void) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popover
            renderContent={() => (
                <Box border="thick" borderRadius="default" padding={4}>
                    Hello
                </Box>
            )}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placementOffsetY={4}
        >
            <Button onClick={() => setIsOpen(!isOpen)}>Toggle</Button>
        </Popover>
    );
}
