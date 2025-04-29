import React from 'react';
import {mount} from 'enzyme';
import {Heading} from '../../src/base/ui/unstable_standalone_ui';

describe('Heading', () => {
    it('renders outside of a blocks context', () => {
        mount(<Heading />);
    });
});
