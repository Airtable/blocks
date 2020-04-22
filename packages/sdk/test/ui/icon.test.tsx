import React from 'react';
import {mount} from 'enzyme';
import {Icon} from '../../src/ui/ui';

describe('Icon', () => {
    it('renders outside of a blocks context', () => {
        mount(<Icon name="bell" />);
    });
});
