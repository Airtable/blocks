import React, {useState} from 'react';
import {dialogStylePropTypes} from '../src/base/ui/dialog';
import ConfirmationDialog from '../src/base/ui/confirmation_dialog';
import Button from '../src/base/ui/button';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';
import Example from './helpers/example';

export default {
    component: ConfirmationDialog,
};

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
                isCancelButtonDisabled: {
                    type: 'switch',
                    label: 'Is cancel button disabled',
                    defaultValue: false,
                },
                isConfirmButtonDisabled: {
                    type: 'switch',
                    label: 'Is confirm button disabled',
                    defaultValue: false,
                },
            }}
            styleProps={Object.keys(dialogStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);
                return `
                    import React, { useState } from 'react';
                    import {Button, ConfirmationDialog} from '@airtable/blocks/base/ui';

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

export const _Example = {
    render: () => <ConfirmationDialogExample />,
};
