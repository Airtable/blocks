import React from 'react';
import {mount} from 'enzyme';
import {Box} from '../../src/base/ui/unstable_standalone_ui';

describe('Box', () => {
    it('renders outside of a blocks context', () => {
        mount(<Box />);
    });
});
