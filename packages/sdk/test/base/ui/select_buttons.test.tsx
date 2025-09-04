import React from 'react';
import {render} from '@testing-library/react';
import {SelectButtons} from '../../../src/base/ui/unstable_standalone_ui';

describe('SelectButtons', () => {
    it('renders outside of a blocks context', () => {
        render(<SelectButtons value="dance" options={[{value: 'dance', label: 'Dance'}]} />);
    });
});
