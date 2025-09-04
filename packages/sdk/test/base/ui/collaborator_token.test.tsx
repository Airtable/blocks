import React from 'react';
import {render} from '@testing-library/react';
import {CollaboratorToken} from '../../../src/base/ui/unstable_standalone_ui';

describe('StaticCollaboratorToken', () => {
    it('renders outside of a blocks context', () => {
        render(
            <CollaboratorToken.Static
                collaborator={{name: 'Kid Adultman', email: 'kid@trenchcoats4u.com'}}
            />,
        );
    });
});
