import React from 'react';
import {render} from '@testing-library/react';
import {Button} from '../../../src/base/ui/unstable_standalone_ui';

describe('Button', () => {
    it('renders outside of a blocks context', () => {
        render(<Button>Test</Button>);
    });
});
