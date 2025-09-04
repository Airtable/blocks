/* eslint-disable no-console */
import React from 'react';
import CollaboratorToken from '../src/base/ui/collaborator_token';
import Example from './helpers/example';
import collaboratorOptions from './helpers/collaborator_options';

export default {
    component: CollaboratorToken,
};

function CollaboratorTokenExample() {
    return (
        <Example
            renderCodeFn={() => {
                return `
                    import {CollaboratorToken, useBase} from '@airtable/blocks/base/ui';

                    const CollaboratorTokenExample = () => {
                        const base = useBase();

                        return (
                            <React.Fragment>
                                {base.activeCollaborators.map(collaborator => (
                                    <CollaboratorToken key={collaborator.id} collaborator={collaborator} marginRight={1} />
                                ))}
                            </React.Fragment>
                        );
                    }
                `;
            }}
        >
            {() => {
                return (
                    <React.Fragment>
                        {collaboratorOptions.map(collaborator => (
                            <CollaboratorToken.Static
                                key={collaborator.id}
                                collaborator={collaborator}
                                marginRight={1}
                            />
                        ))}
                    </React.Fragment>
                );
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <CollaboratorTokenExample />,
};
