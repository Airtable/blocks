import React from 'react';
import {render} from '@testing-library/react';
import {Box} from '../../../src/base/ui/unstable_standalone_ui';

describe('Box', () => {
    it('renders outside of a blocks context', () => {
        render(<Box />);
    });
});
