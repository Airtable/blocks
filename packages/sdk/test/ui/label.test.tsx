import React from 'react';
import {mount} from 'enzyme';
import {Label} from '../../src/ui/unstable_standalone_ui';

describe('Label', () => {
    it('renders outside of a blocks context', () => {
        mount(<Label />);
    });
});
