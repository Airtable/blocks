import React from 'react';
import {render} from '@testing-library/react';
import {Icon} from '../../../src/base/ui/unstable_standalone_ui';

describe('Icon', () => {
    it('renders outside of a blocks context', () => {
        render(<Icon name="bell" />);
    });
});
