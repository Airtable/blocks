// @flow
import React from 'react';
import {Button} from '@airtable/blocks/ui';

export default function ButtonExample(props: void) {
    return (
        <Button margin={3} theme={Button.themes.GREEN}>
            Click me!
        </Button>
    );
}
