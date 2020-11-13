import React from 'react';
import {mount} from 'enzyme';
import {Button} from '../../src/ui/unstable_standalone_ui';

describe('Button', () => {
    it('renders outside of a blocks context', () => {
        mount(<Button>Test</Button>);
    });
});
