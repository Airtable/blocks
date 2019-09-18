// @flow
import React, {useState} from 'react';
import {Button, ConfirmationDialog} from '@airtable/blocks/ui';

export default function DialogExample(props: void) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <React.Fragment>
            <Button onClick={() => setIsDialogOpen(true)}>Open dialog</Button>
            {isDialogOpen && (
                <ConfirmationDialog
                    title="Are you sure?"
                    body="This is a confirmation dialog, which can be used as a warning or disclaimer."
                    confirmButtonText="Got it"
                    onCancel={() => setIsDialogOpen(false)}
                    onConfirm={() => setIsDialogOpen(false)}
                />
            )}
        </React.Fragment>
    );
}
