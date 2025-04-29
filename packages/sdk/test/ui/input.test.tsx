import React from 'react';
import {mount} from 'enzyme';
import {Input} from '../../src/base/ui/unstable_standalone_ui';

describe('Input', () => {
    it('renders outside of a blocks context', () => {
        mount(<Input value="value" onChange={() => {}} />);
    });

    it('does not render aria-describedby when unspecified', () => {
        const $el = mount(<Input value="0" onChange={() => {}} />).render();

        expect($el.is('[aria-describedby]')).toEqual(false);
    });

    it('recognizes aria-describedby', () => {
        const $el = mount(<Input value="0" onChange={() => {}} aria-describedby="foo" />).render();

        expect($el.attr('aria-describedby')).toEqual('foo');
    });
});
