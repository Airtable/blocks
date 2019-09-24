// @flow
import React from 'react';
import {CollaboratorToken, useBase, Box} from '@airtable/blocks/ui';

export default function CollaboratorTokenExample(props: void) {
    const base = useBase();
    const {activeCollaborators} = base;
    return (
        <Box width="400px" maxWidth="100%" marginX={2}>
            {activeCollaborators.slice(0, 10).map((collaborator, index) => (
                <CollaboratorToken key={index} collaborator={collaborator} margin={1} />
            ))}
        </Box>
    );
}
