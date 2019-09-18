// @flow
import React, {useState} from 'react';
import {Button, Dialog} from '@airtable/blocks/ui';

export default function DialogExample(props: void) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <React.Fragment>
            <Button onClick={() => setIsDialogOpen(true)}>Open dialog</Button>
            {isDialogOpen && (
                <Dialog
                    maxWidth="400px"
                    height="200px"
                    padding={4}
                    margin={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClose={() => setIsDialogOpen(false)}
                >
                    <Dialog.CloseButton />
                    This is a dialog with a close button and more opinionated text styling.
                </Dialog>
            )}
        </React.Fragment>
    );
}
