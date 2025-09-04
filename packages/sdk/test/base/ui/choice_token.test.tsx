import React from 'react';
import {render} from '@testing-library/react';
import {ChoiceToken} from '../../../src/base/ui/unstable_standalone_ui';

describe('ChoiceToken', () => {
    it('renders outside of a blocks context', () => {
        render(<ChoiceToken choice={{id: 'test', name: 'Very important choice', color: 'blue'}} />);
    });
});
