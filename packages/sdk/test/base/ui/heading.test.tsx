import React from 'react';
import {render} from '@testing-library/react';
import {Heading} from '../../../src/base/ui/unstable_standalone_ui';

describe('Heading', () => {
    it('renders outside of a blocks context', () => {
        render(<Heading />);
    });
});
