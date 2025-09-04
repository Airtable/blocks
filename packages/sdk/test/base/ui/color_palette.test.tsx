import React from 'react';
import {render} from '@testing-library/react';
import {ColorPalette} from '../../../src/base/ui/unstable_standalone_ui';

describe('ColorPalette', () => {
    it('renders outside of a blocks context', () => {
        render(<ColorPalette allowedColors={['red']} />);
    });
});
