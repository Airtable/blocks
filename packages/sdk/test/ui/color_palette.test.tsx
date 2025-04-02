import React from 'react';
import {mount} from 'enzyme';
import {ColorPalette} from '../../src/base/ui/unstable_standalone_ui';

describe('ColorPalette', () => {
    it('renders outside of a blocks context', () => {
        mount(<ColorPalette allowedColors={['red']} />);
    });
});
