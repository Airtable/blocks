/* eslint-disable no-console */
import React from 'react';
import {storiesOf} from '@storybook/react';
import CollaboratorToken, {collaboratorTokenStylePropTypes} from '../src/ui/collaborator_token';
import Example from './helpers/example';
import collaboratorOptions from './helpers/collaborator_options';

const stories = storiesOf('CollaboratorToken', module);

function CollaboratorTokenExample() {
    return (
        <Example
            styleProps={Object.keys(collaboratorTokenStylePropTypes)}
            renderCodeFn={() => {
                return `
                    import {CollaboratorToken, useBase} from '@airtable/blocks/ui';

                    const CollaboratorTokenExample = () => {
                        const base = useBase();

                        return (
                            <React.Fragment>
                                {base.activeCollaborators.map(choice => (
                                    <CollaboratorToken key={collaborator.id} choice={choice} marginRight={1} />
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
                            <CollaboratorToken
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

stories.add('example', () => <CollaboratorTokenExample />);
