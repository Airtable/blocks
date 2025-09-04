import React from 'react';
import {render} from '@testing-library/react';
import {Switch} from '../../../src/base/ui/unstable_standalone_ui';

describe('Switch', () => {
    it('renders outside of a blocks context', () => {
        render(<Switch value={true} onChange={() => {}} label="A switch" />);
    });
});
