import React from 'react';
import {render} from '@testing-library/react';
import {Link} from '../../../src/base/ui/unstable_standalone_ui';

describe('Link', () => {
    it('renders outside of a blocks context', () => {
        render(<Link href="https://example.com">Example</Link>);
    });
});
