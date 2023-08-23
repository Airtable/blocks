import React from 'react';
import {mount} from 'enzyme';
import {SelectButtons} from '../../src/ui/unstable_standalone_ui';

describe('SelectButtons', () => {
    it('renders outside of a blocks context', () => {
        mount(<SelectButtons value="dance" options={[{value: 'dance', label: 'Dance'}]} />);
    });
});
