import React from 'react';
import {mount} from 'enzyme';
import {Box} from '../../src/ui/ui';

describe('Box', () => {
    it('renders outside of a blocks context', () => {
        mount(<Box />);
    });
});
