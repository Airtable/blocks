import React from 'react';
import {mount} from 'enzyme';
import {Switch} from '../../src/ui/ui';

describe('Switch', () => {
    it('renders outside of a blocks context', () => {
        mount(<Switch value={true} onChange={() => {}} label="A switch" />);
    });
});
