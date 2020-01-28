import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {dialogStylePropTypes} from '../src/ui/dialog';
import ConfirmationDialog from '../src/ui/confirmation_dialog';
import Button from '../src/ui/button';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';
import Example from './helpers/example';

const stories = storiesOf('ConfirmationDialog', module);

function ConfirmationDialogExample() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Example
            options={{
                isConfirmActionDangerous: {
                    type: 'switch',
                    label: 'Is dangerous action',
                    defaultValue: false,
                },
            }}
            styleProps={Object.keys(dialogStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);
                return `
                    import React, { useState } from 'react';
                    import {Button, ConfirmationDialog} from '@airtable/blocks/ui';

                    const DialogExample = () => {
                        const [isDialogOpen, setIsDialogOpen] = useState(false);

                        return (
                            <React.Fragment>
                                <Button onClick={() => setIsDialogOpen(true)}>Open confirmation dialog</Button>
                              
                                {isDialogOpen && (
                                    <ConfirmationDialog
                                        ${props}
                                        title="Are you sure?"
                                        body="This action can’t be undone."
                                        onConfirm={() => {
                                            setIsDialogOpen(false);
                                        }}
                                        onCancel={() => setIsDialogOpen(false)}
                                    />
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
                        <Button onClick={() => setIsDialogOpen(true)}>
                            Open confirmation dialog
                        </Button>
                        {isDialogOpen && (
                            <ConfirmationDialog
                                {...values}
                                title="Are you sure?"
                                body="This action can’t be undone."
                                onConfirm={() => {
                                    setIsDialogOpen(false);
                                }}
                                onCancel={() => setIsDialogOpen(false)}
                            />
                        )}
                    </React.Fragment>
                );
            }}
        </Example>
    );
}

stories.add('example', () => <ConfirmationDialogExample />);
