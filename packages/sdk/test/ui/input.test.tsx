import React from 'react';
import {mount} from 'enzyme';
import {Input} from '../../src/ui/ui';

describe('Input', () => {
    it('renders outside of a blocks context', () => {
        mount(<Input value="value" onChange={() => {}} />);
    });
});
