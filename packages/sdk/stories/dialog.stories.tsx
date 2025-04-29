import React, {useState} from 'react';
import Dialog, {dialogStylePropTypes} from '../src/base/ui/dialog';
import Button from '../src/base/ui/button';
import Text from '../src/base/ui/text';
import Heading from '../src/base/ui/heading';
import Example from './helpers/example';
import {CONTROL_WIDTH} from './helpers/code_utils';

export default {
    component: Dialog,
};

function DialogExample() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Example
            options={{
                showCloseButton: {
                    type: 'switch',
                    label: 'Show close button',
                    defaultValue: true,
                },
            }}
            styleProps={Object.keys(dialogStylePropTypes)}
            renderCodeFn={values => {
                return `
                    import React, { useState } from 'react';
                    import {Button, Dialog, Heading, Text} from '@airtable/blocks/ui';

                    const DialogExample = () => {
                        const [isDialogOpen, setIsDialogOpen] = useState(false);

                        return (
                            <React.Fragment>
                                <Button onClick={() => setIsDialogOpen(true)}>Open dialog</Button>

                                {isDialogOpen && (
                                    <Dialog onClose={() => setIsDialogOpen(false)} width="${CONTROL_WIDTH}">
                                        ${values.showCloseButton ? '<Dialog.CloseButton />' : ''}

                                        <Heading>Dialog</Heading>
                                        <Text variant="paragraph">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                            neque dui, euismod ac quam eget, pretium cursus nisl.
                                        </Text>

                                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                                    </Dialog>
                                )}
                            </React.Fragment>
                        );
                    }
                `;
            }}
        >
            {values => {
                return (
                    <React.Fragment>
                        <Button onClick={() => setIsDialogOpen(true)}>Open dialog</Button>
                        {isDialogOpen && (
                            <Dialog onClose={() => setIsDialogOpen(false)} width={CONTROL_WIDTH}>
                                {values.showCloseButton && <Dialog.CloseButton />}
                                <Heading>Dialog</Heading>
                                <Text variant="paragraph">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                                    neque dui, euismod ac quam eget, pretium cursus nisl.
                                </Text>
                                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                            </Dialog>
                        )}
                    </React.Fragment>
                );
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <DialogExample />,
};
