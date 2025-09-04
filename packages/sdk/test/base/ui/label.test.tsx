import React from 'react';
import {render} from '@testing-library/react';
import {Label} from '../../../src/base/ui/unstable_standalone_ui';

describe('Label', () => {
    it('renders outside of a blocks context', () => {
        render(<Label />);
    });
});
