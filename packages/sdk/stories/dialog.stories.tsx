import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import Dialog, {dialogStylePropTypes} from '../src/ui/dialog';
import Button from '../src/ui/button';
import Text from '../src/ui/text';
import Heading from '../src/ui/heading';
import Example from './helpers/example';
import {CONTROL_WIDTH} from './helpers/code_utils';

const stories = storiesOf('Dialog', module);

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

stories.add('example', () => <DialogExample />);
