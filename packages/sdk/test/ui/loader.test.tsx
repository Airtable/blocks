import React from 'react';
import {mount} from 'enzyme';
import {Loader} from '../../src/ui/unstable_standalone_ui';

describe('Loader', () => {
    it('renders outside of a blocks context', () => {
        mount(<Loader />);
    });
});
