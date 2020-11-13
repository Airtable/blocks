import React from 'react';
import {mount} from 'enzyme';
import {Icon} from '../../src/ui/unstable_standalone_ui';

describe('Icon', () => {
    it('renders outside of a blocks context', () => {
        mount(<Icon name="bell" />);
    });
});
