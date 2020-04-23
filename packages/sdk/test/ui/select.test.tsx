import React from 'react';
import {mount} from 'enzyme';
import {Select} from '../../src/ui/ui';

describe('Select', () => {
    it('renders outside of a blocks context', () => {
        mount(<Select value={null} options={[{value: null, label: 'None'}]} />);
    });
});
