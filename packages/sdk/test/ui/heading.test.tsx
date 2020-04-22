import React from 'react';
import {mount} from 'enzyme';
import {Heading} from '../../src/ui/ui';

describe('Heading', () => {
    it('renders outside of a blocks context', () => {
        mount(<Heading />);
    });
});
