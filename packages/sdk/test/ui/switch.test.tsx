import React from 'react';
import {mount} from 'enzyme';
import {Switch} from '../../src/base/ui/unstable_standalone_ui';

describe('Switch', () => {
    it('renders outside of a blocks context', () => {
        mount(<Switch value={true} onChange={() => {}} label="A switch" />);
    });
});
