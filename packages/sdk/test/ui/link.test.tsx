import React from 'react';
import {mount} from 'enzyme';
import {Link} from '../../src/base/ui/unstable_standalone_ui';

describe('Link', () => {
    it('renders outside of a blocks context', () => {
        mount(<Link href="https://example.com">Example</Link>);
    });
});
