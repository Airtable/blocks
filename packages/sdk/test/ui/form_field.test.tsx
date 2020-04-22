import React from 'react';
import {mount} from 'enzyme';
import {FormField} from '../../src/ui/ui';

describe('FormField', () => {
    it('renders outside of a blocks context', () => {
        mount(<FormField />);
    });
});
