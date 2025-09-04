import React from 'react';
import {render} from '@testing-library/react';
import {TextButton} from '../../../src/base/ui/unstable_standalone_ui';

describe('TextButton', () => {
    it('renders outside of a blocks context', () => {
        render(<TextButton>Test</TextButton>);
    });
});
