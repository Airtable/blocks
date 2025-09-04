import React from 'react';
import {render} from '@testing-library/react';
import {Text} from '../../../src/base/ui/unstable_standalone_ui';

describe('Text', () => {
    it('renders outside of a blocks context', () => {
        render(<Text />);
    });
});
