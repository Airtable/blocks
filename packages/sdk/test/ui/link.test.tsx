import React from 'react';
import {mount} from 'enzyme';
import {Link} from '../../src/ui/ui';

describe('Link', () => {
    it('renders outside of a blocks context', () => {
        mount(<Link href="https://example.com">Example</Link>);
    });
});
