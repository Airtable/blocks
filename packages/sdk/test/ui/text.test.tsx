import React from 'react';
import {mount} from 'enzyme';
import {Text} from '../../src/ui/unstable_standalone_ui';

describe('Text', () => {
    it('renders outside of a blocks context', () => {
        mount(<Text />);
    });
});
