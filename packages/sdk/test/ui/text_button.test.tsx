import React from 'react';
import {mount} from 'enzyme';
import {TextButton} from '../../src/ui/unstable_standalone_ui';

describe('TextButton', () => {
    it('renders outside of a blocks context', () => {
        mount(<TextButton>Test</TextButton>);
    });
});
