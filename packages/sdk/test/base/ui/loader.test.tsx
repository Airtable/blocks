import React from 'react';
import {render} from '@testing-library/react';
import {Loader} from '../../../src/base/ui/unstable_standalone_ui';

describe('Loader', () => {
    it('renders outside of a blocks context', () => {
        render(<Loader />);
    });
});
