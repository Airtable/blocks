import React from 'react';
import {mount} from 'enzyme';
import {ChoiceToken} from '../../src/ui/ui';

describe('ChoiceToken', () => {
    it('renders outside of a blocks context', () => {
        mount(<ChoiceToken choice={{id: 'test', name: 'Very important choice', color: 'blue'}} />);
    });
});
