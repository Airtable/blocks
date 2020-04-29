import React from 'react';
import {mount} from 'enzyme';
import {Select} from '../../src/ui/ui';

describe('Select', () => {
    it('renders outside of a blocks context', () => {
        mount(<Select value={null} options={[{value: null, label: 'None'}]} />);
    });

    it('does not include aria-describedby when unspecified', () => {
        const $el = mount(
            <Select value={null} options={[{value: null, label: 'None'}]} />,
        ).render();

        expect($el.is('[aria-describedby]')).toEqual(false);
    });

    it('recognizes aria-describedby', () => {
        const $el = mount(
            <Select value={null} options={[{value: null, label: 'None'}]} aria-describedby="foo" />,
        ).render();

        expect($el.attr('aria-describedby')).toEqual('foo');
    });
});
